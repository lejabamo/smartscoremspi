import { useLocation, Navigate, Link } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const resultData = location.state?.scoringResult;

  if (!resultData) {
    return <Navigate to="/" replace />;
  }

  const { totalScore, maturityLevel } = resultData;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="app-header px-4 !py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src="/icon.png" alt="SmartScore" className="w-10 h-10 object-contain bg-white rounded-xl p-1.5" />
                <span className="text-xl font-black tracking-tighter uppercase text-white">Resultados <span className="text-blue-500">MSPI</span></span>
            </div>
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Volver al inicio</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          
          <div className="mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                Diagnóstico de Seguridad Finalizado
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                Tu Puntaje Actual de Seguridad es:
            </h1>
          </div>

          <div className="relative mb-16">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
            <div className="relative inline-flex items-center justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-[12px] border-slate-100 flex items-center justify-center bg-white shadow-2xl">
                    <div className="text-center">
                        <span className="text-7xl sm:text-9xl font-black text-blue-600 block leading-none">{Math.round(totalScore)}</span>
                        <span className="text-lg sm:text-xl font-bold text-slate-400 uppercase tracking-widest">de 100</span>
                    </div>
                </div>
                {/* Visual indicator for maturity level */}
                <div className="absolute -bottom-4 bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl border border-white/10">
                    Nivel: {maturityLevel}
                </div>
            </div>
          </div>

          <div className="glass-card !p-8 sm:!p-12 mb-12">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-6">✓</div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">¡Gracias por evaluarte!</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
                El detalle detallado de tu evaluación y la **ruta recomendada a seguir** acaba de ser enviada a tu correo electrónico.
            </p>
            <p className="mt-4 text-sm text-slate-400 font-medium">
                Por favor, revisa tu bandeja de entrada (y carpeta de spam si es necesario) para acceder a tu informe completo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-primary !px-12 !py-4 shadow-blue-500/20">
                Realizar otra evaluación
            </Link>
          </div>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">
                Evaluación basada en el modelo de seguridad de la información MSPI del MINTIC
            </p>
            <div className="flex justify-center gap-8 opacity-40 grayscale pointer-events-none">
                <img src="/logo-mspi.png" alt="MSPI" className="h-6 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span className="text-xs font-black text-slate-400 uppercase">Certificado SmartScore</span>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default Results;
