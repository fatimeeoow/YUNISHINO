import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Volume2, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Study() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Descargamos las palabras al entrar a la página
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*');
      
      if (error) throw error;
      
      // Desordenamos (barajamos) las palabras para que no salgan siempre en el mismo orden
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setWords(shuffled);
    } catch (error) {
      console.error('Error cargando las palabras:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakChinese = (text: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    const voices = speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh') && v.name.includes('Female'));
    if (chineseVoice) utterance.voice = chineseVoice;
    speechSynthesis.speak(utterance);
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setShowAnswer(false);
    setCurrentIndex(0);
    // Volvemos a barajar al reiniciar
    setWords([...words].sort(() => Math.random() - 0.5));
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <Brain size={60} className="text-ch-primary animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-ch-dark">Preparando tu mazo...</h2>
      </div>
    );
  }

  // Pantalla cuando no hay palabras en la bóveda
  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in">
        <Link to="/" className="inline-block p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark mb-6">
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-3xl font-bold text-ch-dark mb-4">Tu mazo está vacío</h2>
        <p className="text-ch-primary mb-8 text-lg">Añade algunas palabras en la bóveda para empezar a estudiar.</p>
        <Link to="/editor" className="bg-ch-primary hover:bg-ch-dark text-white px-8 py-4 rounded-xl font-bold transition-colors">
          Añadir mi primera palabra
        </Link>
      </div>
    );
  }

  // Pantalla de "¡Mazo terminado!"
  if (currentIndex >= words.length) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in">
        <h2 className="text-4xl font-bold text-ch-dark mb-4">¡Excelente trabajo! 🎉</h2>
        <p className="text-ch-primary mb-8 text-lg">Has repasado todas las palabras de tu mazo actual.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="bg-white border-2 border-ch-lightest text-ch-dark hover:bg-ch-bg px-6 py-3 rounded-xl font-bold transition-colors">
            Volver al Inicio
          </Link>
          <button 
            onClick={handleRestart}
            className="bg-ch-primary hover:bg-ch-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={20} />
            Estudiar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Tarjeta actual
  const currentWord = words[currentIndex];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-10">
      {/* Barra Superior */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-ch-dark hidden sm:block">Modo Estudio</h1>
        </div>
        
        {/* Barra de progreso */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-ch-primary">
            Tarjeta {currentIndex + 1} de {words.length}
          </span>
          <div className="w-32 h-3 bg-ch-lightest rounded-full overflow-hidden">
            <div 
              className="h-full bg-ch-primary transition-all duration-300"
              style={{ width: `${((currentIndex) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tarjeta Flashcard */}
      <div 
        onClick={() => !showAnswer && setShowAnswer(true)}
        className={`bg-white min-h-[400px] rounded-3xl shadow-md border-2 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer relative ${
          showAnswer ? 'border-ch-primary' : 'border-ch-lightest hover:border-ch-light hover:shadow-lg'
        }`}
      >
        {/* Siempre mostramos el Hanzi en grande */}
        <h2 className="text-8xl sm:text-9xl font-bold text-ch-dark mb-8">
          {currentWord.hanzi}
        </h2>

        {/* Parte trasera (se revela al hacer clic) */}
        {showAnswer ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-medium text-ch-primary">{currentWord.pinyin}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Evita que el clic cierre algo
                  speakChinese(currentWord.hanzi);
                }}
                className="p-2 bg-ch-bg text-ch-primary hover:bg-ch-lightest rounded-full transition-colors"
              >
                <Volume2 size={24} />
              </button>
            </div>
            <p className="text-2xl font-bold text-gray-700 capitalize">{currentWord.spanish}</p>
            
            {/* Etiquetas extra */}
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">
                {currentWord.category}
              </span>
              <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold">
                HSK {currentWord.hsk}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 font-medium absolute bottom-8 animate-pulse">
            Toca la tarjeta para ver la respuesta
          </p>
        )}
      </div>

      {/* Botones de control (Solo aparecen cuando ya viste la respuesta) */}
      {showAnswer && (
        <div className="mt-8 flex justify-center animate-in fade-in zoom-in duration-300">
          <button 
            onClick={handleNextCard}
            className="w-full sm:w-auto px-10 py-4 bg-ch-primary hover:bg-ch-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md cursor-pointer text-lg"
          >
            Siguiente Tarjeta
            <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}