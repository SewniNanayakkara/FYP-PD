import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 rounded-full p-4">
                <i className="fas fa-brain text-white text-4xl"></i>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              NeuroGuard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Early Detection System for Parkinson's Disease
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Leveraging AI-powered analysis of handwriting patterns and MRI imaging to detect early signs of Parkinson's disease with clinical precision
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/test')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 text-lg"
            >
              <i className="fas fa-flask-vial mr-2"></i> Start Diagnosis
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg border-2 border-blue-600 transition duration-300 text-lg"
            >
              <i className="fas fa-info-circle mr-2"></i> Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Advanced Detection Methods
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Handwriting Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 rounded-full p-3">
                  <i className="fas fa-pen text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Handwriting Analysis</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our advanced CNN model analyzes subtle changes in handwriting patterns that are often imperceptible to the human eye. These tremors and irregularities are early indicators of neurological changes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">Non-invasive and quick assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">Detects micro-tremors in real-time</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">High accuracy custom CNN model</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/test')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Test Handwriting <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>

            {/* MRI Analysis */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600 rounded-full p-3">
                  <i className="fas fa-image text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">MRI Imaging Analysis</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Advanced deep learning algorithms analyze structural MRI scans to identify characteristic patterns associated with Parkinson's disease, including changes in brain regions responsible for motor control.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">Structural analysis of brain regions</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">Identifies neural pattern changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg mt-1"></i>
                  <span className="text-gray-700">Clinical-grade image processing</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/test')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Test MRI <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How NeuroGuard Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Data</h3>
              <p className="text-gray-600">
                Enter patient information and select your preferred diagnostic method
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Image Upload</h3>
              <p className="text-gray-600">
                Upload handwriting sample or MRI scan image for analysis
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Advanced ML models analyze patterns and extract clinical features
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Results Report</h3>
              <p className="text-gray-600">
                Get detailed analysis with confidence scores and AI insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose NeuroGuard?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-microchip text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-700">
                State-of-the-art deep learning models trained on thousands of clinical cases for high accuracy
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-lock text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-700">
                Patient data is encrypted and processed with strict HIPAA compliance standards
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-clock text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Results</h3>
              <p className="text-gray-700">
                Get instantaneous analysis and comprehensive reports within seconds
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-chart-line text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High Accuracy</h3>
              <p className="text-gray-700">
                95%+ precision rate with confidence scoring for clinical decision support
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-stethoscope text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clinical Grade</h3>
              <p className="text-gray-700">
                Designed for healthcare professionals with detailed clinical insights
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-blue-50 rounded-lg">
              <i className="fas fa-lightbulb text-blue-600 text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Explanations</h3>
              <p className="text-gray-700">
                Integrated AI assistant provides clinical context and explanation for results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Begin your patient's diagnostic journey with NeuroGuard today
          </p>
          <button
            onClick={() => navigate('/test')}
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-10 rounded-lg shadow-lg transition duration-300 text-lg"
          >
            <i className="fas fa-play-circle mr-2"></i> Start Diagnosis Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
