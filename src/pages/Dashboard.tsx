import { BookOpen, Brain, PlusCircle, Flame, Library } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Encabezado y Racha */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ch-dark mb-1">¡Hola mi amor! Lista para aprender?</h1>
          <p className="text-ch-primary font-medium">Tu progreso en Shino</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 text-purple-600 px-5 py-2.5 rounded-2xl font-bold shadow-sm border border-purple-200">
          <Flame size={24} className="animate-pulse" />
          <span>Racha: 0 días</span>
        </div>
      </header>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-ch-lightest">
          <p className="text-sm text-gray-500 mb-1">Palabras Aprendidas</p>
          <p className="text-2xl font-bold text-ch-dark">0</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-ch-lightest">
          <p className="text-sm text-gray-500 mb-1">Para Repasar Hoy</p>
          <p className="text-2xl font-bold text-ch-primary">0</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-ch-lightest">
          <p className="text-sm text-gray-500 mb-1">Precisión</p>
          <p className="text-2xl font-bold text-emerald-600">0%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-ch-lightest">
          <p className="text-sm text-gray-500 mb-1">Mazos</p>
          <p className="text-2xl font-bold text-ch-light">0</p>
        </div>
      </div>

      {/* Acciones Principales */}
      <h2 className="text-xl font-bold text-ch-dark mt-8 mb-4">¿Qué quieres hacer hoy?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Botón Estudiar */}
        <Link to="/study" className="flex flex-col items-center justify-center p-6 bg-ch-primary hover:bg-ch-dark text-white rounded-2xl shadow-md transition-all group cursor-pointer">
          <Brain size={40} className="mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg">Modo Estudio</span>
          <span className="text-sm text-ch-lightest mt-1 text-center">Usa tus flashcards</span>
        </Link>

        {/* Botón Examen */}
        <Link to="/exam" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-ch-primary text-ch-primary hover:bg-ch-lightest hover:text-ch-dark rounded-2xl shadow-sm transition-all group cursor-pointer">
          <BookOpen size={40} className="mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg">Modo Examen</span>
          <span className="text-sm mt-1 text-center">Prueba tu conocimiento</span>
        </Link>

        {/* Botón Añadir (AQUÍ ESTÁ EL LINK CORREGIDO) */}
        <Link to="/editor" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-ch-lighter text-ch-light hover:bg-ch-lightest rounded-2xl shadow-sm transition-all group cursor-pointer">
          <PlusCircle size={40} className="mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg">Nueva Palabra</span>
          <span className="text-sm mt-1 text-center">Añadir al mazo</span>
        </Link>

      {/* Botón Biblioteca */}
        <Link to="/library" className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl shadow-sm transition-all group cursor-pointer">
          <Library size={40} className="mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg">Mi Bóveda</span>
          <span className="text-sm mt-1 text-center">Glosario y PDFs</span>
        </Link>

      </div>
    </div>
  );
}