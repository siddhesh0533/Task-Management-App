import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { SkeletonCard, SkeletonRow } from '../components/Skeleton';

const StatCard = ({ label, value, color, delay }) => (
  <div className={`panel p-5 animate-fade-up ${delay}`}>
    <p className="text-xs text-surface-400 uppercase tracking-widest font-medium mb-2">{label}</p>
    <p className={`text-3xl font-display font-bold ${color}`}
      style={{ fontFamily: 'Syne, sans-serif' }}>
      {value ?? '—'}
    </p>
  </div>
);

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          api.get('/tasks/summary'),
          api.get('/tasks'),
        ]);
        setSummary(sRes.data);
        setRecentTasks(tRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-surface-400 text-sm mb-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="page-title">
          {greet()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-surface-400 text-sm mt-1 capitalize">{user?.role}</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total"       value={summary.total}      color="text-surface-50"  delay="stagger-1" />
          <StatCard label="Pending"     value={summary.pending}    color="text-warn-400"    delay="stagger-2" />
          <StatCard label="In Progress" value={summary.inProgress} color="text-info-400"    delay="stagger-3" />
          <StatCard label="Completed"   value={summary.completed}  color="text-ok-400"      delay="stagger-4" />
        </div>
      )}

      {/* Recent tasks */}
      <div className="panel animate-fade-up stagger-2">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/60">
          <h2 style={{ fontFamily: 'Syne, sans-serif' }}
            className="font-semibold text-surface-100 text-sm tracking-wide uppercase">
            Recent Tasks
          </h2>
          <Link to="/tasks" className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonRow key={i} cols={3} />)
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-14 text-surface-500 text-sm">
            <p>No tasks yet.</p>
            {user?.role === 'manager' && (
              <Link to="/tasks" className="text-accent-400 text-sm hover:underline mt-1 block">
                Create your first task →
              </Link>
            )}
          </div>
        ) : (
          <div>
            {recentTasks.map((task, i) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="flex items-center justify-between px-5 py-3.5 border-b border-surface-700/30
                           last:border-0 hover:bg-surface-800/60 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-100 group-hover:text-accent-300
                                transition-colors truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {user?.role === 'manager'
                      ? `→ ${task.assignedTo?.name}`
                      : `from ${task.createdBy?.name}`}
                    {task.deadline && (
                      <span className="ml-2 text-surface-600">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex gap-3 animate-fade-up stagger-3">
        {user?.role === 'manager' && (
          <Link to="/tasks" className="btn-primary btn-sm">+ New Task</Link>
        )}
        {user?.role === 'employee' && (
          <Link to="/reports/new" className="btn-primary btn-sm">+ Submit Daily Report</Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
