import { useState } from 'react';
import { Volume2, Save, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import HanziWriterComponent from '../components/HanziWriter';
import { supabase } from '../supabase'; // <-- AQUÍ IMPORTAMOS TU BASE DE DATOS
import { pinyin as getPinyin } from 'pinyin-pro';

export default function Editor() {
  const [spanish, setSpanish] = useState('');
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [classifier, setClassifier] = useState('');
  const [category, setCategory] = useState('Sustantivo');
  const [hsk, setHsk] = useState('1');
  
  // Nuevo estado para saber si está guardando
  const [isSaving, setIsSaving] = useState(false);

  const speakChinese = () => {
    if (!hanzi) return;
    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = 'zh-CN';
    const voices = speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh') && v.name.includes('Female'));
    if (chineseVoice) utterance.voice = chineseVoice;
    speechSynthesis.speak(utterance);
  };

  const handleAutoTranslate = async () => {
    if (!spanish.trim()) {
      alert('¡Primero escribe una palabra en español para traducirla! ✍️');
      return;
    }

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(spanish)}&langpair=es|zh-CN`);
      const data = await response.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        const translatedHanzi = data.responseData.translatedText;
        setHanzi(translatedHanzi);
        
        const pinyinText = getPinyin(translatedHanzi);
        setPinyin(pinyinText);
        
        // 🤖 TRUCO INTELIGENTE: Adivinar la categoría
        const palabra = spanish.toLowerCase().trim();
        if (palabra.endsWith('ar') || palabra.endsWith('er') || palabra.endsWith('ir')) {
          setCategory('Verbo');
        } else if (palabra.endsWith('mente')) {
          setCategory('Adverbio');
        } else {
          setCategory('Sustantivo'); // Por defecto asumimos que es una cosa (sustantivo)
        }

        // Clasificador por defecto y Nivel HSK por defecto
        setClassifier('个');
        setHsk('1'); 
        
      } else {
        alert('No pudimos encontrar la traducción en este momento.');
      }
    } catch (error) {
      console.error("Error al traducir:", error);
      alert('Hubo un error de conexión con el traductor.');
    }
  };

  // ESTA ES LA FUNCIÓN QUE CAMBIÓ: AHORA GUARDA EN LA NUBE REAL
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); // Encendemos el estado de carga

    try {
      // 1. Enviamos los datos a la tabla 'words' de Supabase
      const { error } = await supabase
        .from('words')
        .insert([
          { 
            spanish: spanish, 
            hanzi: hanzi, 
            pinyin: pinyin, 
            classifier: classifier, 
            category: category, 
            hsk: hsk 
          }
        ]);

      // 2. Si hay un error, lo mostramos
      if (error) {
        console.error("Error guardando:", error);
        alert('Hubo un error al guardar la palabra: ' + error.message);
        return;
      }

      // 3. Si todo salió bien, avisamos y limpiamos el formulario
      alert('¡Palabra guardada exitosamente en la nube! ☁️');
      setSpanish('');
      setHanzi('');
      setPinyin('');
      setClassifier('');
      setCategory('Sustantivo');
      setHsk('1');

    } catch (error) {
      console.error("Error inesperado:", error);
      alert('Ocurrió un error inesperado.');
    } finally {
      setIsSaving(false); // Apagamos el estado de carga
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Barra superior */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-ch-lightest rounded-full transition-colors text-ch-dark">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-ch-dark">Añadir Nueva Palabra</h1>
          <p className="text-ch-primary">Expande tu vocabulario y biblioteca</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-ch-lightest">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Campo Español */}
            <div>
              <label className="block text-sm font-bold text-ch-dark mb-2">Palabra en Español *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  required
                  value={spanish}
                  onChange={(e) => setSpanish(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary focus:ring-1 focus:ring-ch-primary"
                  placeholder="ej. hola"
                />
                <button 
                  type="button"
                  onClick={handleAutoTranslate}
                  className="shrink-0 px-4 bg-ch-lightest text-ch-dark hover:bg-ch-lighter rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <Wand2 size={20} />
                  <span className="hidden sm:inline">Autocompletar</span>
                </button>
              </div>
            </div>

            {/* Hanzi y Pinyin */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-ch-dark mb-2">Hanzi (Caracteres) *</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    value={hanzi}
                    onChange={(e) => setHanzi(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary font-bold text-xl"
                    placeholder="ej. 你好"
                  />
                  <button 
                    type="button"
                    onClick={speakChinese}
                    className="shrink-0 p-3 bg-ch-bg text-ch-primary hover:bg-ch-lightest rounded-xl transition-colors cursor-pointer border border-gray-200"
                    title="Escuchar pronunciación"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-bold text-ch-dark mb-2">Pinyin (con tonos) *</label>
                <input 
                  type="text" 
                  required
                  value={pinyin}
                  onChange={(e) => setPinyin(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary"
                  placeholder="ej. nǐ hǎo"
                />
              </div>
            </div>

            {/* Clasificador y Categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-ch-dark mb-2">Clasificador *</label>
                <input 
                  type="text" 
                  required
                  value={classifier}
                  onChange={(e) => setClassifier(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary"
                  placeholder="ej. 个"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ch-dark mb-2">Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary bg-white"
                >
                  <option>Sustantivo</option>
                  <option>Verbo</option>
                  <option>Adjetivo</option>
                  <option>Adverbio</option>
                  <option>Partícula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-ch-dark mb-2">Nivel HSK</label>
                <select 
                  value={hsk}
                  onChange={(e) => setHsk(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ch-primary bg-white"
                >
                  <option value="1">HSK 1</option>
                  <option value="2">HSK 2</option>
                  <option value="3">HSK 3</option>
                  <option value="4">HSK 4</option>
                  <option value="5">HSK 5</option>
                  <option value="6">HSK 6</option>
                </select>
              </div>
            </div>

            {/* Botón Guardar dinámico */}
            <button 
              type="submit"
              disabled={isSaving}
              className={`w-full mt-8 py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md ${
                isSaving ? 'bg-ch-light cursor-not-allowed' : 'bg-ch-primary hover:bg-ch-dark cursor-pointer'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar en la Bóveda
                </>
              )}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Vista Previa y Animación */}
        <div className="bg-white p-6 rounded-2xl border border-ch-lightest flex flex-col items-center justify-center text-center shadow-sm">
          <h3 className="text-lg font-bold text-ch-dark mb-6">Orden de Trazos</h3>
          {hanzi && hanzi.length > 0 ? (
            <div className="flex gap-4 flex-wrap justify-center">
              {hanzi.split('').map((char, index) => (
                <HanziWriterComponent key={index} character={char} size={120} />
              ))}
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50">
              Sin Hanzi
            </div>
          )}
          <p className="text-sm text-gray-500 mt-6">
            Escribe el Hanzi para ver la animación automática de los trazos.
          </p>
        </div>
      </div>
    </div>
  );
}