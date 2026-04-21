import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('admin_token', data.token);
            navigate('/admin');
        } else {
            setError(data.message);
        }
    } catch (err) {
        setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="card max-w-sm w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">Acceso Administrativo</h1>
          <p className="text-sm text-slate-500">SmartScore MSPI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          
          <button type="submit" className="btn-primary w-full mt-4">
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
