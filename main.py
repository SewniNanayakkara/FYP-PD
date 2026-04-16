import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import io
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import librosa
import pickle
import soundfile as sf
import joblib


load_dotenv()




HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MISTRAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
HF_API_URL = f"https://api-inference.huggingface.co/models/{MISTRAL_MODEL}"




app = FastAPI(title="Parkinson AI Prediction API")




app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




HANDWRITING_MODEL_PATH = "models/parkinsons_handwriting_model.keras"
MRI_MODEL_PATH = "models/mri_model.keras"
VOICE_MODEL_PATH = "models/voice_model.pkl"




handwriting_model = tf.keras.models.load_model(HANDWRITING_MODEL_PATH)
mri_model = tf.keras.models.load_model(MRI_MODEL_PATH)


try:
    with open(VOICE_MODEL_PATH, 'rb') as f:
        voice_model = pickle.load(f)
except:
    
    voice_model = joblib.load(VOICE_MODEL_PATH)

print("Handwriting model loaded")
print("MRI model loaded")
print("Voice model loaded")
print("Starting Parkinson AI API...")




HANDWRITING_IMG_SIZE = (224, 224)
MRI_IMG_SIZE = (192, 192)

LOW_THRESHOLD = 0.3
HIGH_THRESHOLD = 0.7
MRI_THRESHOLD = 0.4




def preprocess_handwriting(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize(HANDWRITING_IMG_SIZE)

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def preprocess_mri(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize(MRI_IMG_SIZE)

    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array


def extract_features(audio_data, sample_rate):
    """Extract acoustic features from audio for Parkinson's voice detection"""
    try:
        
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=13)
        features = np.mean(mfccs, axis=1) 
        
        return features
        
    except Exception as e:
        print(f"Error extracting features: {e}")
        
        return np.zeros(13)





@app.get("/")
def root():
    return {"message": "Parkinson AI API is running"}





@app.post("/predict/handwriting")
async def predict_handwriting(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img_array = preprocess_handwriting(contents)

        probs = handwriting_model.predict(img_array)[0]
        healthy_prob = float(probs[0])
        parkinson_prob = float(probs[1])

        
        if parkinson_prob >= HIGH_THRESHOLD:
            label = "Parkinson"
            confidence = parkinson_prob * 100
        elif parkinson_prob <= LOW_THRESHOLD:
            label = "Healthy"
            confidence = (1 - parkinson_prob) * 100
        else:
            label = "Uncertain"
            confidence = parkinson_prob * 100

        return JSONResponse({
            "model": "handwriting",
            "prediction": label,
            "confidence": round(confidence, 2),
            "healthy_probability": round(healthy_prob * 100, 2),
            "parkinson_probability": round(parkinson_prob * 100, 2)
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})





@app.post("/predict/mri")
async def predict_mri(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img_array = preprocess_mri(contents)

        prediction = mri_model.predict(img_array)
        probability = float(prediction[0][0])

        if probability >= MRI_THRESHOLD:
            label = "Parkinson"
            confidence = probability * 100
        else:
            label = "Healthy"
            confidence = (1 - probability) * 100

        return JSONResponse({
            "model": "mri",
            "prediction": label,
            "confidence": round(confidence, 2),
            "parkinson_probability": round(probability * 100, 2)
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})





@app.post("/predict/voice")
async def predict_voice(file: UploadFile = File(...)):
    try:
        
        contents = await file.read()
        
        
        audio_data, sample_rate = sf.read(io.BytesIO(contents))
        
        
        if len(audio_data.shape) > 1:
            audio_data = np.mean(audio_data, axis=1)
        
        
        features = extract_features(audio_data, sample_rate)
        
        
        prediction = voice_model.predict([features])
        
        
        is_parkinson = prediction[0] == 1
        label = "Parkinson" if is_parkinson else "Healthy"
        
        
        try:
            probabilities = voice_model.predict_proba([features])[0]
            confidence = float(probabilities[1] if is_parkinson else probabilities[0]) * 100
            healthy_prob = float(probabilities[0]) * 100
            parkinson_prob = float(probabilities[1]) * 100
        except:
            
            confidence = 80.0 if abs(prediction[0] - 0.5) > 0.3 else 60.0
            healthy_prob = 100 - confidence if is_parkinson else confidence
            parkinson_prob = confidence if is_parkinson else 100 - confidence

        return JSONResponse({
            "model": "voice",
            "prediction": label,
            "confidence": round(confidence, 2),
            "healthy_probability": round(healthy_prob, 2),
            "parkinson_probability": round(parkinson_prob, 2)
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})





class PatientAnalysisRequest(BaseModel):
    age: int
    gender: str
    symptoms: str
    prediction_result: str  
    confidence: float
    test_method: str  





def query_mistral(prompt: str) -> str:
    """Query the Mistral model via Hugging Face API"""
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    

    formatted_prompt = f"<s>[INST] {prompt} [/INST]"
    
    payload = {
        "inputs": formatted_prompt,
        "parameters": {
            "max_new_tokens": 1024,
            "temperature": 0.7,
            "top_p": 0.95,
            "do_sample": True,
            "return_full_text": False
        }
    }
    
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "").strip()
        return str(result)
    except requests.exceptions.RequestException as e:
        print(f"Mistral API error: {e}")
        return None





@app.post("/analyze/patient")
async def analyze_patient(request: PatientAnalysisRequest):
    """
    Generate AI-powered analysis and recommendations based on patient data
    and prediction results using Mistral-7B
    """
    try:

        prompt = f"""You are a medical AI assistant specialized in Parkinson's disease. 
Based on the following patient information and test results, provide a comprehensive analysis.

PATIENT INFORMATION:
- Age: {request.age} years old
- Gender: {request.gender}
- Reported Symptoms: {request.symptoms if request.symptoms else "No symptoms reported"}

TEST RESULTS:
- Test Method: {"Handwriting Analysis" if request.test_method == "handwriting" else "MRI Brain Scan"}
- Prediction: {request.prediction_result}
- Confidence Level: {request.confidence}%

Please provide:
1. **Risk Assessment**: Based on age, symptoms, and test results, assess the overall risk level (Low/Moderate/High)
2. **Symptom Analysis**: Analyze the reported symptoms in relation to Parkinson's disease
3. **Personalized Recommendations**: 
   - Lifestyle modifications
   - Dietary suggestions
   - Exercise recommendations
   - When to seek medical attention
4. **Next Steps**: Specific actions the patient should take

IMPORTANT: This is for informational purposes only and should not replace professional medical advice.

Provide a clear, compassionate, and actionable response."""

       
        ai_response = query_mistral(prompt)
        
        if ai_response is None:
            
            ai_response = generate_fallback_recommendations(request)
        
        return JSONResponse({
            "success": True,
            "patient_info": {
                "age": request.age,
                "gender": request.gender,
                "symptoms": request.symptoms
            },
            "test_results": {
                "method": request.test_method,
                "prediction": request.prediction_result,
                "confidence": request.confidence
            },
            "ai_analysis": ai_response,
            "model_used": MISTRAL_MODEL
        })

    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": str(e), "success": False}
        )


def generate_fallback_recommendations(request: PatientAnalysisRequest) -> str:
    """Generate fallback recommendations when API is unavailable"""
    is_parkinson = request.prediction_result == "Parkinson"
    
    if is_parkinson:
        return f"""## Risk Assessment
Based on the test results showing **Parkinson's indicators** with {request.confidence}% confidence, along with the patient's age ({request.age}), this warrants immediate medical attention.

## Symptom Analysis
{"The reported symptoms (" + request.symptoms + ") should be evaluated by a neurologist." if request.symptoms else "No specific symptoms were reported, but the test results suggest further evaluation is needed."}

## Recommendations

### Immediate Actions
- Schedule an appointment with a neurologist as soon as possible
- Keep a symptom diary to track any changes
- Bring all test results to your medical appointment

### Lifestyle Modifications
- Maintain regular physical activity (walking, swimming, tai chi)
- Ensure adequate sleep (7-8 hours)
- Reduce stress through meditation or relaxation techniques
- Stay socially active

### Dietary Suggestions
- Eat a balanced diet rich in fruits, vegetables, and whole grains
- Include omega-3 fatty acids (fish, walnuts, flaxseed)
- Stay well hydrated
- Limit processed foods and sugars

### Exercise Recommendations
- Balance exercises to prevent falls
- Stretching to maintain flexibility
- Aerobic exercises for cardiovascular health
- Consider physical therapy consultation

## Next Steps
1. Consult a neurologist within the next 1-2 weeks
2. Get additional confirmatory tests as recommended
3. Discuss treatment options with your healthcare provider

*This analysis is for informational purposes only and does not constitute medical advice.*"""
    else:
        return f"""## Risk Assessment
Based on the test results showing **Healthy** indicators with {request.confidence}% confidence, the current risk level appears to be **Low**.

## Symptom Analysis
{"The reported symptoms (" + request.symptoms + ") may be related to other conditions. Consider discussing these with your doctor if they persist." if request.symptoms else "No concerning symptoms were reported."}

## Recommendations

### Prevention & Wellness
- Continue regular health check-ups
- Stay physically and mentally active
- Maintain a healthy lifestyle

### Lifestyle Tips
- Exercise regularly (150 minutes moderate activity per week)
- Get quality sleep (7-9 hours)
- Manage stress effectively
- Stay socially connected

### Dietary Suggestions
- Mediterranean diet is associated with brain health
- Include antioxidant-rich foods
- Stay hydrated
- Limit alcohol consumption

### When to Seek Medical Attention
Monitor for these symptoms and consult a doctor if you experience:
- Persistent tremors
- Stiffness in limbs
- Slowed movement
- Balance problems
- Changes in handwriting

## Next Steps
1. Continue routine health screenings
2. Monitor for any new symptoms
3. Maintain a healthy, active lifestyle

*This analysis is for informational purposes only and does not constitute medical advice.*"""


if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
