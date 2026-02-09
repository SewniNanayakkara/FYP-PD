
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {/* Simple Navigation Header */}
        <header className="bg-blue-700 text-white shadow-md p-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-microscope text-2xl"></i>
              <h1 className="text-xl font-bold tracking-tight">NeuroGuard</h1>
            </div>
            <div className="hidden md:block text-sm font-medium opacity-80">
              Early Detection System v1.0
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<InputPage />} />
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
