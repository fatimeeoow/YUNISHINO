import { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziWriterProps {
  character: string;
  size?: number;
}

export default function HanziWriterComponent({ character, size = 150 }: HanziWriterProps) {
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstance = useRef<any>(null);

  useEffect(() => {
    // Si no hay contenedor o no hay carácter, no hacemos nada
    if (!writerRef.current || !character) return;

    // Limpiamos el contenedor por si había un carácter anterior
    writerRef.current.innerHTML = '';

    // Inicializamos la librería con tus colores personalizados
    writerInstance.current = HanziWriter.create(writerRef.current, character, {
      width: size,
      height: size,
      padding: 5,
      strokeColor: '#3e8fd8', // ch-primary
      radicalColor: '#0960ae', // ch-dark
      delayBetweenStrokes: 200,
    });

    return () => {
      if (writerRef.current) writerRef.current.innerHTML = '';
    };
  }, [character, size]);

  const animate = () => {
    writerInstance.current?.animateCharacter();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Contenedor del carácter chino */}
      <div 
        ref={writerRef} 
        className="border-2 border-ch-lightest rounded-xl bg-white shadow-sm min-h-[150px] min-w-[150px]" 
      />
      
      {/* Botón para animar */}
      <button 
        onClick={animate}
        className="px-6 py-2 bg-ch-primary text-white font-medium rounded-lg hover:bg-ch-dark transition-colors cursor-pointer shadow-sm"
      >
        Animar Trazos
      </button>
    </div>
  );
}