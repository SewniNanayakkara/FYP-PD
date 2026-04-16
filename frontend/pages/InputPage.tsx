
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PredictionResult } from '../types';
import { predictHandwriting, predictMRI, predictVoice, getAIAnalysis } from '../lib/api';

type TestMethod = 'handwriting' | 'mri' | 'voice' | null;

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  
  const [testMethod, setTestMethod] = useState<TestMethod>(null);

  
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!fullName || !age || !testMethod || !selectedFile) {
      setError('Please fill in all required fields and select a test method and file.');
      return;
    }

    setLoading(true);

    try {
      let result: PredictionResult;
      
      
      setLoadingMessage('Analyzing image...');

      if (testMethod === 'handwriting') {
        const apiResponse = await predictHandwriting(selectedFile);
        result = {
          model: 'handwriting',
          prediction: apiResponse.prediction,
          confidence: apiResponse.confidence,
          healthy_probability: apiResponse.healthy_probability,
          parkinson_probability: apiResponse.parkinson_probability,
        };
      } else if (testMethod === 'mri') {
        const apiResponse = await predictMRI(selectedFile);
        result = {
          model: 'mri',
          prediction: apiResponse.prediction,
          confidence: apiResponse.confidence,
          healthy_probability: apiResponse.healthy_probability,
          parkinson_probability: apiResponse.parkinson_probability,
        };
      } else {
        const apiResponse = await predictVoice(selectedFile);
        result = {
          model: 'voice',
          prediction: apiResponse.prediction,
          confidence: apiResponse.confidence,
          healthy_probability: apiResponse.healthy_probability,
          parkinson_probability: apiResponse.parkinson_probability,
        };
      }

      
      setLoadingMessage('Generating AI recommendations...');
      
      let aiAnalysis = undefined;
      try {
        aiAnalysis = await getAIAnalysis({
          age: parseInt(age),
          gender: gender,
          symptoms: symptoms,
          prediction_result: result.prediction,
          confidence: result.confidence,
          test_method: testMethod,
        });
      } catch (aiError) {
        console.warn('AI analysis failed, continuing without it:', aiError);
        
      }

      navigate('/result', { 
        state: { 
          result, 
          patientName: fullName,
          method: testMethod,
          patientAge: parseInt(age),
          patientGender: gender,
          patientSymptoms: symptoms,
          aiAnalysis: aiAnalysis,
        } 
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the prediction.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="fas fa-clipboard-user text-blue-600"></i>
          Parkinson's Disease Detection
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
            <i className="fas fa-exclamation-circle text-xl"></i>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Method Selection */}
          {!testMethod ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Select Testing Method *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => { setTestMethod('handwriting'); setSelectedFile(null); }}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <i className="fas fa-pen text-4xl text-blue-600 mb-3 block"></i>
                  <h3 className="font-bold text-gray-800">Handwriting Test</h3>
                  <p className="text-xs text-gray-600 mt-2">Upload a handwriting or spiral drawing sample</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setTestMethod('mri'); setSelectedFile(null); }}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <i className="fas fa-brain text-4xl text-blue-600 mb-3 block"></i>
                  <h3 className="font-bold text-gray-800">MRI Scan Test</h3>
                  <p className="text-xs text-gray-600 mt-2">Upload an MRI brain scan image</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setTestMethod('voice'); setSelectedFile(null); }}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <i className="fas fa-microphone text-4xl text-blue-600 mb-3 block"></i>
                  <h3 className="font-bold text-gray-800">Voice Test</h3>
                  <p className="text-xs text-gray-600 mt-2">Upload a voice recording sample</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Method Indicator */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className={`text-2xl ${
                    testMethod === 'handwriting' ? 'fas fa-pen text-blue-600' :
                    testMethod === 'mri' ? 'fas fa-brain text-blue-600' :
                    'fas fa-microphone text-blue-600'
                  }`}></i>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {testMethod === 'handwriting' ? 'Handwriting Test' :
                       testMethod === 'mri' ? 'MRI Scan Test' : 'Voice Test'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {testMethod === 'handwriting' 
                        ? 'Upload a handwriting or spiral sample' 
                        : testMethod === 'mri'
                        ? 'Upload an MRI brain scan'
                        : 'Upload a voice recording sample'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTestMethod(null)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  Change
                </button>
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Symptoms Description</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe physical symptoms like tremors, stiffness, or movement difficulties..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {testMethod === 'handwriting' ? 'Handwriting/Spiral Sample *' : 
                   testMethod === 'mri' ? 'MRI Brain Image *' : 'Voice Recording *'}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept={testMethod === 'voice' ? 'audio/*' : 'image/*'}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <i className={`text-4xl mb-3 block ${
                      testMethod === 'handwriting' ? 'fas fa-pen text-gray-400' :
                      testMethod === 'mri' ? 'fas fa-brain text-gray-400' :
                      'fas fa-microphone text-gray-400'
                    }`}></i>
                    <p className="text-sm text-gray-700 font-medium">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {loadingMessage || 'Processing...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-search-plus"></i>
                    Get Prediction
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default InputPage;