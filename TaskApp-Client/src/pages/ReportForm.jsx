import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MAX_SUMMARY = 2000;
const MAX_BLOCKERS = 500;

const ReportForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ workSummary: '', blockers: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.workSummary || form.workSummary.length < 10)
      e.workSummary = 'Work summary must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await api.post('/reports', form);
      toast.success('Report submitted!');
      navigate('/my-reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Back link */}
      <Link
        to="/my-reports"
        className="inline-flex items-center gap-1.5 text-sm text-surface-500
                   hover:text-surface-200 transition-colors mb-5 sm:mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        My Reports
      </Link>

      {/* Heading */}
      <div className="mb-5 sm:mb-6 animate-fade-up">
        <h1 className="page-title text-xl sm:text-2xl">Daily Report</h1>
        <p className="text-surface-400 text-xs sm:text-sm mt-1">{today}</p>
      </div>

      {/* Card */}
      <div className="panel p-4 sm:p-6 animate-fade-up stagger-1">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Work summary */}
          <div>
            <label className="field-label">
              What did you work on today?{' '}
              <span className="text-danger-400 normal-case">*</span>
            </label>
            <textarea
              className={`field resize-none ${errors.workSummary ? 'field-error' : ''}`}
              rows={6}
              placeholder="Describe tasks completed, progress made, and anything notable…"
              value={form.workSummary}
              maxLength={MAX_SUMMARY}
              onChange={e => {
                setForm({ ...form, workSummary: e.target.value });
                setErrors({ ...errors, workSummary: '' });
              }}
            />
            <div className="flex justify-between mt-1">
              {errors.workSummary
                ? <p className="text-danger-400 text-xs">{errors.workSummary}</p>
                : <span />}
              <p className={`text-xs tabular-nums ${
                form.workSummary.length > MAX_SUMMARY * 0.9 ? 'text-warn-400' : 'text-surface-600'
              }`}>
                {form.workSummary.length}/{MAX_SUMMARY}
              </p>
            </div>
          </div>

          {/* Blockers */}
          <div>
            <label className="field-label">
              Blockers{' '}
              <span className="normal-case text-surface-500 font-normal">(optional)</span>
            </label>
            <textarea
              className="field resize-none"
              rows={3}
              placeholder="Anything blocking your progress? Leave blank if none."
              value={form.blockers}
              maxLength={MAX_BLOCKERS}
              onChange={e => setForm({ ...form, blockers: e.target.value })}
            />
            <p className={`text-xs mt-1 tabular-nums text-right ${
              form.blockers.length > MAX_BLOCKERS * 0.9 ? 'text-warn-400' : 'text-surface-600'
            }`}>
              {form.blockers.length}/{MAX_BLOCKERS}
            </p>
          </div>

          {/* Actions — stacked on mobile, side-by-side on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('/my-reports')}
              className="btn-ghost w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportForm;