import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, BookOpen, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Exam() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Estados para el examen
  const [userInput, setUserInput] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase.from('words').select('*');
      if (error) throw error;
      
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setWords(shuffled);
    } catch (error) {
      console.error('Error cargando las palabras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentWord = words[currentIndex];
    // Limpiamos la respuesta para ignorar mayúsculas y espacios extra
    const correctAnswer = currentWord.spanish.toLowerCase().trim();
    const userAnswer = userInput.toLowerCase().trim();

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
    
    setIsEvaluated(true);
  };

  const handleNextWord = () => {
    setUserInput('');
    setIsEvaluated(false);
    setIsCorrect(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setUserInput('');
    setIsEvaluated(false);
    setIsCorrect(false);
    setScore(0);
    setCurrentIndex(0);
    setWords([...words].sort(() => Math.random() - 0.5));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <BookOpen size={60} className="text-ch-primary animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-ch-dark">Preparando tu examen...</h2>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in">
        <Link to="/" className="inline-block p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark mb-6">
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-3xl font-bold text-ch-dark mb-4">No hay palabras para evaluar</h2>
        <p className="text-ch-primary mb-8 text-lg">Añade palabras a tu bóveda antes de hacer un examen.</p>
        <Link to="/editor" className="bg-ch-primary hover:bg-ch-dark text-white px-8 py-4 rounded-xl font-bold transition-colors">
          Añadir palabras
        </Link>
      </div>
    );
  }

  // Pantalla de Resultados Finales
  if (currentIndex >= words.length) {
    const percentage = Math.round((score / words.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in zoom-in">
        <h2 className="text-4xl font-bold text-ch-dark mb-2">Examen Finalizado</h2>
        <p className="text-gray-500 mb-8 font-medium">Aquí están tus resultados</p>
        
        <div className="bg-white border-2 border-ch-lightest rounded-3xl p-8 mb-8 shadow-sm">
          <div className="text-7xl font-bold text-ch-primary mb-4">{percentage}%</div>
          <p className="text-xl text-ch-dark font-medium">
            Acertaste <span className="font-bold text-emerald-600">{score}</span> de <span className="font-bold text-ch-dark">{words.length}</span> palabras
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/" className="bg-white border-2 border-ch-lightest text-ch-dark hover:bg-ch-bg px-6 py-3 rounded-xl font-bold transition-colors">
            Volver al Inicio
          </Link>
          <button 
            onClick={handleRestart}
            className="bg-ch-primary hover:bg-ch-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw size={20} />
            Reintentar Examen
          </button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 pb-10">
      {/* Barra Superior */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-ch-dark hidden sm:block">Modo Examen</h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-ch-lightest font-bold text-ch-primary shadow-sm">
          Pregunta {currentIndex + 1} de {words.length}
        </div>
      </div>

      {/* Tarjeta de Pregunta */}
      <div className="bg-white rounded-3xl shadow-sm border-2 border-ch-lightest p-8 text-center mb-8">
        <p className="text-gray-500 font-medium mb-4 uppercase tracking-widest text-sm">¿Qué significa esta palabra?</p>
        <h2 className="text-8xl sm:text-9xl font-bold text-ch-dark mb-4">
          {currentWord.hanzi}
        </h2>
        {/* Mostramos el Pinyin como pequeña pista opcional */}
        <p className="text-xl text-ch-light font-medium">{currentWord.pinyin}</p>
      </div>

      {/* Zona de Respuesta */}
      {!isEvaluated ? (
        <form onSubmit={handleCheckAnswer} className="space-y-4 animate-in slide-in-from-bottom-4">
          <input 
            type="text" 
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe la traducción en español..."
            className="w-full p-5 text-xl text-center border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-ch-primary shadow-sm"
          />
          <button 
            type="submit"
            disabled={!userInput.trim()}
            className="w-full py-4 bg-ch-dark hover:bg-ch-text text-white rounded-2xl font-bold text-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Comprobar Respuesta
          </button>
        </form>
      ) : (
        <div className={`p-6 rounded-2xl border-2 animate-in zoom-in-95 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            {isCorrect ? (
              <CheckCircle2 size={32} className="text-emerald-600" />
            ) : (
              <XCircle size={32} className="text-red-600" />
            )}
            <h3 className={`text-2xl font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </h3>
          </div>
          
          {!isCorrect && (
            <div className="mb-6">
              <p className="text-red-600 mb-1">Tu respuesta: <span className="line-through">{userInput}</span></p>
              <p className="text-lg font-bold text-gray-800">
                Respuesta correcta: <span className="text-emerald-600 capitalize">{currentWord.spanish}</span>
              </p>
            </div>
          )}

          <button 
            onClick={handleNextWord}
            autoFocus
            className="w-full py-4 bg-white border-2 border-gray-200 hover:border-ch-primary hover:text-ch-primary rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm text-lg"
          >
            Siguiente Palabra
            <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}