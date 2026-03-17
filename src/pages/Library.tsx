import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Volume2, Trash2, Book, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Library() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWords(data || []);
    } catch (error) {
      console.error('Error cargando las palabras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta palabra de tu bóveda?')) return;
    
    try {
      const { error } = await supabase.from('words').delete().eq('id', id);
      if (error) throw error;
      setWords(words.filter(word => word.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error al eliminar la palabra.');
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

  // Función para activar el cuadro de diálogo de impresión/PDF del navegador
  const handleExportPDF = () => {
    window.print();
  };

  const filteredWords = words.filter(w => 
    w.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.hanzi.includes(searchTerm)
  );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      {/* Barra Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* print:hidden oculta la flecha en el PDF */}
          <Link to="/" className="p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark print:hidden">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-ch-dark">Mi Bóveda</h1>
            <p className="text-ch-primary print:hidden">Tu glosario personal completo</p>
          </div>
        </div>

        {/* Botón para exportar a PDF (se oculta al imprimir) */}
        <button 
          onClick={handleExportPDF}
          className="print:hidden bg-white border-2 border-ch-primary text-ch-primary hover:bg-ch-primary hover:text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Download size={20} />
          Exportar PDF
        </button>
      </div>

      {/* Barra de Búsqueda (se oculta al imprimir) */}
      <div className="print:hidden bg-white p-4 rounded-2xl shadow-sm border border-ch-lightest mb-8 flex items-center gap-3">
        <Search className="text-ch-light" size={24} />
        <input 
          type="text" 
          placeholder="Busca en español, pinyin o hanzi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-lg"
        />
        <div className="bg-ch-bg text-ch-dark px-4 py-2 rounded-xl font-bold text-sm">
          {filteredWords.length} Palabras
        </div>
      </div>

      {/* Lista de Palabras */}
      {loading ? (
        <div className="text-center py-20 text-ch-light print:hidden">
          <Book size={48} className="mx-auto mb-4 animate-bounce" />
          <p className="font-bold text-lg">Abriendo la bóveda...</p>
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300 print:hidden">
          <p className="text-lg">No se encontraron palabras.</p>
          <Link to="/editor" className="text-ch-primary font-bold hover:underline mt-2 inline-block">
            ¡Agrega una nueva aquí!
          </Link>
        </div>
      ) : (
        // print:grid-cols-2 asegura que en el PDF salgan a 2 columnas para ahorrar hojas
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-2 gap-4">
          {filteredWords.map((word) => (
            <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-ch-lightest flex flex-col hover:border-ch-primary transition-colors group print:break-inside-avoid print:shadow-none print:border-gray-300">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-ch-dark mb-1">{word.hanzi}</h3>
                  <p className="text-ch-primary font-medium">{word.pinyin}</p>
                </div>
                {/* Ocultamos el botón de audio en el PDF */}
                <button 
                  onClick={() => speakChinese(word.hanzi)}
                  className="print:hidden p-2 bg-ch-bg text-ch-primary hover:bg-ch-lightest rounded-full transition-colors cursor-pointer"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="font-bold text-lg text-ch-text mb-2 capitalize">{word.spanish}</p>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md print:border print:border-blue-200">
                    {word.category}
                  </span>
                  <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md print:border print:border-purple-200">
                    HSK {word.hsk}
                  </span>
                  {word.classifier && (
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md print:border print:border-emerald-200">
                      Clasif: {word.classifier}
                    </span>
                  )}
                </div>
              </div>

              {/* Botón Eliminar oculto en el PDF */}
              <button 
                onClick={() => handleDelete(word.id)}
                className="print:hidden mt-4 flex items-center justify-center gap-2 w-full py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium cursor-pointer sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}