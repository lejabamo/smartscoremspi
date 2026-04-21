import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  data: any[];
  metrics: {
    landings: number;
    starts: number;
    completions: number;
  };
  churn: any[];
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        navigate('/admin/login');
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/data');
      const json = await response.json();
      if (json.success) {
        setDashboardData(json);
      }
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const exportLeads = () => {
    if (!dashboardData) return;
    const headers = ['Nombre', 'Email', 'Teléfono', 'Puntaje', 'Nivel', 'Fecha'];
    const rows = dashboardData.data.map(e => [
      e.name, e.email, e.phone, e.total_score, e.maturity_level, new Date(e.created_at).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_mspi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando Panel de Administración...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
              <h1 className="text-xl font-black uppercase tracking-widest">Panel de Administración <span className="text-blue-500">SmartScore</span></h1>
          </div>
          <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">Salir</button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 py-10 space-y-10">
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6 bg-white border-none shadow-premium">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visitas Landing</p>
                <p className="text-3xl font-black text-slate-900">{dashboardData?.metrics.landings || 0}</p>
            </div>
            <div className="card p-6 bg-white border-none shadow-premium">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inicios Evaluación</p>
                <p className="text-3xl font-black text-blue-600">{dashboardData?.metrics.starts || 0}</p>
            </div>
            <div className="card p-6 bg-white border-none shadow-premium">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Leads Capturados</p>
                <p className="text-3xl font-black text-green-600">{dashboardData?.metrics.completions || 0}</p>
            </div>
            <div className="card p-6 bg-blue-600 text-white border-none shadow-premium">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Tasa de Conversión</p>
                <p className="text-3xl font-black">
                    {dashboardData?.metrics.starts ? Math.round((dashboardData.metrics.completions / dashboardData.metrics.starts) * 100) : 0}%
                </p>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Conversion Funnel Visualization */}
            <div className="card p-8 bg-white border-none shadow-premium">
                <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded"></span>
                    Embudo de Conversión (Funnel)
                </h2>
                <div className="space-y-6">
                    <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-blue-900">Visitas Landing (100%)</div>
                    </div>
                    <div className="flex justify-center">
                        <span className="text-slate-300 text-lg">↓</span>
                    </div>
                    <div className="relative h-12 rounded-xl overflow-hidden mx-8">
                        <div 
                          className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-blue-300 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-blue-900"
                          style={{ width: `${dashboardData?.metrics.landings ? (dashboardData.metrics.starts / dashboardData.metrics.landings) * 100 : 0}%` }}
                        >
                            Inicios Evaluación
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <span className="text-slate-300 text-lg">↓</span>
                    </div>
                    <div className="relative h-12 rounded-xl overflow-hidden mx-16">
                        <div 
                          className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-blue-600 flex items-center justify-center font-bold text-xs uppercase tracking-widest text-white"
                          style={{ width: `${dashboardData?.metrics.starts ? (dashboardData.metrics.completions / dashboardData.metrics.starts) * 100 : 0}%` }}
                        >
                            Leads Finalizados
                        </div>
                    </div>
                </div>
            </div>

            {/* Churn Analytics */}
            <div className="card p-8 bg-white border-none shadow-premium">
                <h2 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                    <span className="w-2 h-6 bg-red-500 rounded"></span>
                    Identificación de Fricción (Churn)
                </h2>
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium mb-4">Preguntas con mayor tasa de abandono:</p>
                    {dashboardData?.churn && dashboardData.churn.length > 0 ? (
                        dashboardData.churn.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-xs font-black text-slate-400 w-24 uppercase">Pregunta {item.question_id}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-400" style={{ width: `${(item.count / dashboardData.metrics.starts) * 100}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{item.count} rtas.</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 italic">No hay suficientes datos de abandono...</p>
                    )}
                </div>
            </div>
        </div>

        {/* Lead Table */}
        <div className="card bg-white border-none shadow-premium overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
                <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-6 bg-green-600 rounded"></span>
                    Base de Datos de Leads
                </h2>
                <button 
                  onClick={exportLeads}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-green-600/20"
                >
                    Exportar Leads (.CSV)
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Puntaje</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {dashboardData?.data.map((lead, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 text-sm font-bold text-slate-900">{lead.name}</td>
                                <td className="px-8 py-4 text-sm text-slate-600">{lead.email}</td>
                                <td className="px-8 py-4 text-sm text-slate-600">{lead.phone}</td>
                                <td className="px-8 py-4 text-sm font-black text-blue-600 text-center">{Math.round(lead.total_score)}</td>
                                <td className="px-8 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                        {lead.maturity_level}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Binary Testing Module (Placeholder Structure) */}
        <div className="card p-8 bg-slate-900 text-white border-none shadow-premium">
            <h2 className="text-lg font-black uppercase tracking-widest mb-4">Resultados de Pruebas A/B</h2>
            <div className="flex items-center gap-6">
                <div className="flex-1 p-6 border border-white/10 rounded-2xl bg-white/5">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Versión A (Fondo Azul)</p>
                    <p className="text-2xl font-black">68% Conversión</p>
                </div>
                <div className="flex-1 p-6 border border-white/10 rounded-2xl bg-white/5 opacity-50">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Versión B (Fondo Blanco)</p>
                    <p className="text-2xl font-black">42% Conversión</p>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
