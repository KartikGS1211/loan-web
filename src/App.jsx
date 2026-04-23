import React from 'react';
import Wizard from './components/wizard/Wizard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-pink-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-purple-300/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="w-full max-w-4xl relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight mb-3">
            SwiftLoan Application
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get approved in minutes. Fill out our simple 8-step secure form and get the funds you need today.
          </p>
        </header>

        <Wizard />
      </div>
    </div>
  );
}

export default App;