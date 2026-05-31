import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SkeletonCard } from '../components/Skeleton';
import toast from 'react-hot-toast';

const ReportCard = ({ report, isManager, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-surface-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {isManager && (
            <div className="w-7 h-7 rounded bg-surface-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-surface-300">
                {report.userId?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-surface-100 text-sm">
              {isManager ? report.userId?.name : 'My Report'}
            </p>
            <p className="text-xs text-surface-500 mt-0.5">
              {new Date(report.date).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`text-surface-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-surface-700/40 pt-4 space-y-4 animate-fade-up">
          <div>
            <p className="field-label">Work Summary</p>
            <p className="text-sm text-surface-300 whitespace-pre-wrap leading-relaxed">
              {report.workSummary}
            </p>
          </div>
          <div>
            <p className="field-label">Blockers</p>
            <p className={`text-sm ${
              report.blockers === 'None' || !report.blockers
                ? 'text-surface-500 italic'
                : 'text-surface-300'
            }`}>
              {report.blockers || 'None'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Reports = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMyReports = location.pathname === '/my-reports';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then(r => setReports(r.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const isManager = user?.role === 'manager';
  const title = isManager ? 'Daily Reports' : 'My Reports';
  const subtitle = isManager
    ? `${reports.length} submission${reports.length !== 1 ? 's' : ''}`
    : `${reports.length} report${reports.length !== 1 ? 's' : ''} submitted`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="text-surface-400 text-sm mt-1">{subtitle}</p>
        </div>
        {user?.role === 'employee' && (
          <Link to="/reports/new" className="btn-primary btn-sm">+ New Report</Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="panel text-center py-16 text-surface-500">
          <p className="text-sm">No reports yet.</p>
          {user?.role === 'employee' && (
            <Link to="/reports/new" className="text-accent-400 text-sm hover:underline mt-2 block">
              Submit your first report →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2 animate-fade-up stagger-1">
          {reports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              isManager={isManager}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
