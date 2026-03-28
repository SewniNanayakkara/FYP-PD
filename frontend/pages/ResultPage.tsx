
import React, { useEffect, JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationState } from '../types';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as NavigationState | null;

  // Redirect back if no state is present (direct URL access)
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { result, patientName, method, patientAge, patientGender, patientSymptoms, aiAnalysis } = state;
  const isPositive = result.prediction === 'Parkinson';

  // Simple markdown-like rendering for AI response
  const renderAIAnalysis = (text: string) => {
    if (!text) return null;
    
    // Split by lines and process
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('## ')) {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-4 space-y-1">{listItems.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>);
          listItems = [];
        }
        elements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2"><i className="fas fa-chevron-right text-blue-600 text-sm"></i>{trimmed.slice(3)}</h3>);
      } else if (trimmed.startsWith('### ')) {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-4 space-y-1">{listItems.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>);
          listItems = [];
        }
        elements.push(<h4 key={index} className="text-md font-semibold text-gray-700 mt-4 mb-2">{trimmed.slice(4)}</h4>);
      }
      // Bold text markers
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-4 space-y-1">{listItems.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>);
          listItems = [];
        }
        elements.push(<p key={index} className="font-semibold text-gray-800 mt-3 mb-2">{trimmed.slice(2, -2)}</p>);
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const content = trimmed.replace(/^[-*]\s|^\d+\.\s/, '');
        listItems.push(content);
        inList = true;
      }
      // Regular paragraphs
      else if (trimmed.length > 0) {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-4 space-y-1">{listItems.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>);
          listItems = [];
        }
        // Handle inline bold
        const parts = trimmed.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
        elements.push(<p key={index} className="text-gray-700 mb-2">{rendered}</p>);
      }
    });
    
    // Flush remaining list items
    if (listItems.length > 0) {
      elements.push(<ul key="list-final" className="list-disc pl-6 mb-4 space-y-1">{listItems.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>);
    }
    
    return elements;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      {/* Result Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
        {/* Header Banner */}
        <div className={`p-8 flex flex-col items-center text-center ${
          isPositive ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isPositive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            <i className={`text-4xl fas ${isPositive ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">
            {isPositive ? 'Parkinson Detected' : 'Healthy'}
          </h2>
          <p className="text-lg opacity-80">Patient: <span className="font-bold underline">{patientName}</span></p>
          <p className="text-sm opacity-70 mt-2">Test Method: {
            method === 'handwriting' ? 'Handwriting Analysis' :
            method === 'mri' ? 'MRI Scan' : 'Voice Analysis'
          }</p>
        </div>

        <div className="p-8">
          {/* Patient Information */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <i className="fas fa-user-circle text-blue-600"></i>
              Patient Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Name</p>
                <p className="text-gray-800 font-semibold">{patientName}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Age</p>
                <p className="text-gray-800 font-semibold">{patientAge} years</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Gender</p>
                <p className="text-gray-800 font-semibold">{patientGender}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Test Method</p>
                <p className="text-gray-800 font-semibold">{
                  method === 'handwriting' ? 'Handwriting' :
                  method === 'mri' ? 'MRI' : 'Voice'
                }</p>
              </div>
            </div>
            {patientSymptoms && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-500 font-medium mb-1">Reported Symptoms</p>
                <p className="text-gray-700">{patientSymptoms}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            {/* Prediction Result */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs uppercase font-bold text-gray-500 mb-1">Prediction</p>
              <p className={`text-2xl font-black ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                {result.prediction}
              </p>
            </div>

            {/* Confidence */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs uppercase font-bold text-gray-500 mb-1">Confidence</p>
              <p className="text-2xl font-black text-blue-700">
                {result.confidence.toFixed(2)}%
              </p>
            </div>

            {/* Test Type */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs uppercase font-bold text-gray-500 mb-1">Test Method</p>
              <p className="text-lg font-bold text-gray-800">
                {method === 'handwriting' ? '✍️ Handwriting' :
                 method === 'mri' ? '🧠 MRI' : '🎤 Voice'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Probability Breakdown */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <i className="fas fa-chart-pie text-blue-600"></i>
                Probability Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Parkinson's Disease</span>
                    <span className="text-lg font-bold text-red-600">{result.parkinson_probability.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${result.parkinson_probability}%` }}
                    ></div>
                  </div>
                </div>

                {result.healthy_probability !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Healthy</span>
                      <span className="text-lg font-bold text-green-600">{result.healthy_probability.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${result.healthy_probability}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Section */}
            {aiAnalysis && aiAnalysis.ai_analysis && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2 mb-4">
                  <i className="fas fa-robot text-purple-600"></i>
                  AI-Powered Analysis & Recommendations
                  <span className="text-xs font-normal bg-purple-200 text-purple-800 px-2 py-1 rounded-full ml-2">
                    Powered by Mistral AI
                  </span>
                </h3>
                <div className="text-gray-700 leading-relaxed">
                  {renderAIAnalysis(aiAnalysis.ai_analysis)}
                </div>
              </div>
            )}

            {/* Model Information */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-3">
                <i className="fas fa-info-circle"></i>
                Analysis Details
              </h3>
              <p className="text-blue-800 text-sm">
                <strong>Detection Model:</strong> {
                  result.model === 'handwriting' ? 'Handwriting Pattern Analysis AI' :
                  result.model === 'mri' ? 'MRI Brain Scan Analysis AI' : 'Voice Pattern Analysis AI'
                }<br/>
                <strong>Confidence Level:</strong> {result.confidence.toFixed(2)}%<br/>
                <strong>Primary Finding:</strong> {result.prediction === 'Parkinson' ? 'Parkinson\'s disease indicators detected' : 'No Parkinson\'s disease indicators detected'}
                {aiAnalysis && <><br/><strong>Recommendation Model:</strong> {aiAnalysis.model_used}</>}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-print"></i>
            Print Report
          </button>
          <button
            onClick={() => navigate('/test')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fas fa-chevron-left"></i>
            New Assessment
          </button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 flex gap-3">
        <i className="fas fa-shield-halved text-lg opacity-50"></i>
        <p>
          <strong>DISCLAIMER:</strong> This tool is an AI-assisted detection system designed for research and educational purposes only.
          The results provided should not be considered a definitive medical diagnosis. Always consult a qualified neurologist
          for professional medical advice, diagnosis, or treatment. This analysis is supplementary and not a replacement for clinical examination.
        </p>
      </div>
    </div>
  );
};

export default ResultPage;