
export interface PatientData {
  fullName: string;
  age: number;
  gender: string;
  symptoms: string;
}

export interface PredictionResult {
  model: 'handwriting' | 'mri' | 'voice';
  prediction: 'Parkinson' | 'Healthy';
  confidence: number;
  healthy_probability?: number;
  parkinson_probability: number;
}

export interface AIAnalysisRequest {
  age: number;
  gender: string;
  symptoms: string;
  prediction_result: string;
  confidence: number;
  test_method: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  patient_info: {
    age: number;
    gender: string;
    symptoms: string;
  };
  test_results: {
    method: string;
    prediction: string;
    confidence: number;
  };
  ai_analysis: string;
  model_used: string;
}

export interface NavigationState {
  result: PredictionResult;
  patientName: string;
  method: 'handwriting' | 'mri' | 'voice';
  patientAge: number;
  patientGender: string;
  patientSymptoms: string;
  aiAnalysis?: AIAnalysisResponse;
}
