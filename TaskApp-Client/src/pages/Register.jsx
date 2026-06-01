import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: '' }); };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[360px] sm:max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
          <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#0c0c0f" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif' }}
            className="font-bold text-lg text-surface-50">TaskApp</span>
        </div>

        {/* Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 style={{ fontFamily: 'Syne, sans-serif' }}
            className="text-2xl sm:text-3xl font-bold text-surface-50 leading-tight">
            Create account
          </h1>
          <p className="text-surface-400 text-sm mt-1">Get started with TaskApp</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Full name</label>
            <input
              type="text"
              className={`field ${errors.name ? 'field-error' : ''}`}
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <p className="text-danger-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className={`field ${errors.email ? 'field-error' : ''}`}
              placeholder="you@company.com"
              autoComplete="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
            {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className={`field ${errors.password ? 'field-error' : ''}`}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
            {errors.password && <p className="text-danger-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Role selector — equal columns on all sizes */}
          <div>
            <label className="field-label">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {['employee', 'manager'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('role', r)}
                  className={`
                    px-3 sm:px-4 py-2.5 rounded text-sm font-medium border transition-all capitalize
                    ${form.role === r
                      ? 'bg-accent-500/15 text-accent-400 border-accent-500/30'
                      : 'bg-surface-800 text-surface-400 border-surface-600 hover:text-surface-200'}
                  `}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2 py-2.5 sm:py-3 text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-400 hover:text-accent-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;