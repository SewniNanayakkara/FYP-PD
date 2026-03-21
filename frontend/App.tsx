
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {/* Simple Navigation Header */}
        <header className="bg-blue-700 text-white shadow-md p-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <i className="fas fa-microscope text-2xl"></i>
              <h1 className="text-xl font-bold tracking-tight">PDMatrix</h1>
            </Link>
            <div className="hidden md:block text-sm font-medium opacity-80">
              Early Detection System v1.0
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={<InputPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Parkinson's Disease Early Detection System. All rights reserved.</p>
            <p className="mt-1">Designed for Clinical Research and Diagnosis Support.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
