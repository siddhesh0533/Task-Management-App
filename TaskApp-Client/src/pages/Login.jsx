import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: '' }); };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[420px] flex-col justify-between p-12
                      bg-surface-900 border-r border-surface-700/60 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

        <div style={{ fontFamily: 'Syne, sans-serif' }}
          className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-accent-500 rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#0c0c0f" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="font-bold text-xl text-surface-50 tracking-tight">Taskr</span>
        </div>

        <div className="relative z-10">
          <blockquote className="text-surface-400 text-sm leading-relaxed mb-6 italic">
            "The secret of getting ahead is getting started."
          </blockquote>
          <div className="space-y-3">
            {[
              'Assign and track tasks across your team',
              'Daily reports keep everyone aligned',
              'Role-based access for managers & employees',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-surface-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#0c0c0f" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif' }}
              className="font-bold text-lg text-surface-50">TaskApp</span>
          </div>

          <div className="mb-8">
            <h1 style={{ fontFamily: 'Syne, sans-serif' }}
              className="text-2xl font-bold text-surface-50">
              Welcome back
            </h1>
            <p className="text-surface-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input type="email" className={`field ${errors.email ? 'field-error' : ''}`}
                placeholder="you@company.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="field-label">Password</label>
              <input type="password" className={`field ${errors.password ? 'field-error' : ''}`}
                placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)} />
              {errors.password && <p className="text-danger-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            No account?{' '}
            <Link to="/register" className="text-accent-400 hover:text-accent-300 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
