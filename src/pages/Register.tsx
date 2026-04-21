import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleStart = () => {
    navigate('/assessment');
  };

  const modals: Record<string, { title: string, content: JSX.Element }> = {
    metodologia: {
      title: 'Metodología MSPI',
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Basada en un subconjunto crítico de controles de la **ISO/IEC 27001**, adaptados para el contexto nacional.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Alineado con el Marco de Referencia MSPI del MINTIC.</li>
            <li>Enfoque en dominios de Gobierno, Estrategia y Control.</li>
            <li>Referencia directa a la norma ISO 27001 para cumplimiento internacional.</li>
          </ul>
        </div>
      )
    },
    seguridad: {
      title: 'Seguridad y Marco Legal',
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Implementación garantizada de mejores prácticas de gestión de riesgos:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Metodología de análisis de riesgos **ISO 27005-02**.</li>
            <li>Protección de datos bajo la Ley de **Habeas Data**.</li>
            <li>Protocolos de cifrado punto a punto para la información recolectada.</li>
          </ul>
        </div>
      )
    },
    contacto: {
      title: 'Información de Contacto',
      content: (
        <div className="space-y-4 text-white text-center">
          <div className="mb-6">
              <p className="text-xl font-bold">Ing. Leonardo Javier Bastidas Moreno</p>
              <p className="text-blue-400 font-medium">Especialista en Seguridad de la Información</p>
          </div>
          <div className="flex flex-col gap-3">
              <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-400">📱 Cel:</span> 3137830951
              </p>
              <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-400">📧 Email:</span> mrleorobot@gmail.com
              </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background avec fondo.jpeg provide by user - Enhanced visibility */}
      <div 
        className="fixed inset-0 z-0 opacity-60 bg-cover bg-right bg-no-repeat transition-opacity duration-1000 hidden lg:block"
        style={{ backgroundImage: 'url("/fondo.jpeg")'}}
      />
      {/* Fallback for mobile or shared background */}
      <div 
        className="fixed inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{ backgroundImage: 'url("/fondo.jpeg")' }}
      />
      
      {/* Softer Mesh Gradient Overlay to show the image more */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="SmartScore" className="w-10 h-10 object-contain bg-white rounded-xl p-1.5" />
          <span className="text-xl font-black tracking-tighter uppercase">SmartScore <span className="text-blue-500">MSPI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => setActiveModal('metodologia')} className="hover:text-blue-400 transition-colors">Metodología</button>
          <button onClick={() => setActiveModal('seguridad')} className="hover:text-blue-400 transition-colors">Seguridad</button>
          <button onClick={() => setActiveModal('contacto')} className="hover:text-blue-400 transition-colors">Contacto</button>
        </div>
      </nav>

      {/* Hero Content - Aligned Left to show image on the right */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 pt-12 pb-32 flex flex-col items-start text-left">
        <div className="animate-fade-in max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Basado en MSPI del MINTIC
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black leading-[1] tracking-tighter mb-10">
              Evaluación de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500">
                Seguridad de la Información
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-xl mb-12 font-medium opacity-80">
              Descubra el nivel de madurez de su organización frente al modelo MSPI y asegure sus activos digitales más valiosos.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={handleStart}
                className="btn-primary !px-12 !py-5 text-xl shadow-2xl shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                Comenzar Evaluación
              </button>
              <button 
                onClick={() => setActiveModal('metodologia')}
                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.1em] text-xs rounded-2xl border border-white/10 transition-all backdrop-blur-md"
              >
                Normatividad ISO e MSPI del MINTIC
              </button>
            </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl w-full border-t border-white/5 pt-16">
            <div className="text-center">
                <p className="text-3xl font-black mb-1">ISO</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Normativa 27001</p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-black mb-1">GDPR</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Habeas Data</p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-black mb-1">SST</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Gestión de Riesgos</p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-black mb-1">100%</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Privacidad Total</p>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-slate-950/80 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Evaluación basada en el modelo de seguridad de la información MSPI del MINTIC
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <button onClick={() => setActiveModal('seguridad')} className="hover:text-white transition-colors">Normativa</button>
            <button onClick={() => setActiveModal('metodologia')} className="hover:text-white transition-colors">Documentación</button>
            <button onClick={() => setActiveModal('contacto')} className="hover:text-white transition-colors">Soporte</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full !bg-slate-900/80 border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-blue-400">{modals[activeModal].title}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-500 hover:text-white transition-colors text-2xl"
              >&times;</button>
            </div>
            <div className="text-sm">
                {modals[activeModal].content}
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
