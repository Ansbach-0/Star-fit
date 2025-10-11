import React from 'react';

const LandingPage = ({ onLogin }) => (
  <main className="min-h-screen bg-black text-white font-sans bg-gradient-to-br from-black via-gray-900 to-black">
    <header className="flex items-center justify-between px-12 py-8">
      <div className="flex items-center gap-2">
        <span className="text-pink-400 text-3xl">★</span>
        <span className="text-teal-300 text-2xl font-bold tracking-tight">StarFit</span>
      </div>
      <nav className="hidden md:flex gap-12 text-lg font-medium">
        <a href="#features" className="hover:text-teal-300 transition">Funcionalidades</a>
        <a href="#dashboard" className="hover:text-teal-300 transition">Dashboard</a>
        <a href="#architecture" className="hover:text-teal-300 transition">Arquitetura</a>
        <a href="#mobile" className="hover:text-teal-300 transition">Mobile</a>
      </nav>
      <div className="flex items-center gap-6">
        <button className="text-gray-300 hover:text-white transition text-base" onClick={onLogin}>Login</button>
        <button className="bg-pink-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:bg-pink-600 transition text-lg">Demonstração</button>
      </div>
    </header>
    <section className="flex flex-col items-center justify-center text-center py-32">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
        A Revolução na Gestão<br />
        de <span className="bg-gradient-to-r from-pink-400 via-gray-400 to-teal-300 bg-clip-text text-transparent">Academias e Fitness</span>
      </h1>
      <p className="text-xl mb-10 font-medium text-gray-200">Dashboard Inteligente de Luc</p>
      <button className="bg-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-pink-600 transition mb-8" onClick={onLogin}>Ver Dashboard em Ação</button>
      <p className="mt-10 text-gray-400 text-base">
        Projeto de Conclusão de Curso em Engenharia de Software<br />
        <span className="font-bold">Nota: Este é um protótipo visual. As funcionalidades não estão ativas.</span>
      </p>
    </section>
  </main>
);

export default LandingPage;
