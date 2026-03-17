import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Library from './pages/Library';
import Study from './pages/Study';
import Exam from './pages/Exam'; // <-- 1. AÑADIMOS EL IMPORT

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ch-bg text-ch-text font-sans">
        <main className="max-w-5xl mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/library" element={<Library />} />
            <Route path="/study" element={<Study />} />
            <Route path="/exam" element={<Exam />} /> {/* <-- 2. AÑADIMOS LA RUTA */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}