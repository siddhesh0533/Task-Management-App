import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { SkeletonRow } from '../components/Skeleton';
import toast from 'react-hot-toast';

/* ── Task creation modal ──────────────────────────────── */
const TaskModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users').then(r => setEmployees(r.data)).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.assignedTo) e.assignedTo = 'Select an employee';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: '' }); };

  return (
    <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      {/* Sheet on mobile, centered modal on sm+ */}
      <div className="panel w-full sm:max-w-md p-5 sm:p-6 animate-fade-up rounded-b-none sm:rounded-b-lg">

        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-surface-600 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2
            style={{ fontFamily: 'Syne, sans-serif' }}
            className="text-base sm:text-lg font-semibold text-surface-50"
          >
            New Task
          </h2>
          <button
            onClick={onClose}
            className="text-surface-500 hover:text-surface-200 transition-colors text-xl leading-none p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              className={`field ${errors.title ? 'field-error' : ''}`}
              placeholder="Task title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && <p className="text-danger-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="field-label">
              Description{' '}
              <span className="normal-case text-surface-500">(optional)</span>
            </label>
            <textarea
              className="field resize-none"
              rows={3}
              placeholder="What needs to be done?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Assign to</label>
            <select
              className={`field ${errors.assignedTo ? 'field-error' : ''}`}
              value={form.assignedTo}
              onChange={e => set('assignedTo', e.target.value)}
            >
              <option value="">Select employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
            {errors.assignedTo && <p className="text-danger-400 text-xs mt-1">{errors.assignedTo}</p>}
          </div>

          <div>
            <label className="field-label">
              Deadline{' '}
              <span className="normal-case text-surface-500">(optional)</span>
            </label>
            <input
              type="date"
              className="field"
              value={form.deadline}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => set('deadline', e.target.value)}
            />
          </div>

          {/* Stacked on mobile, side-by-side on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost w-full sm:flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary w-full sm:flex-1" disabled={loading}>
              {loading ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Filter pill ────────────────────────────────────────── */
const FilterPill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
      active
        ? 'bg-accent-500/15 text-accent-400 border border-accent-500/30'
        : 'bg-surface-800 text-surface-400 border border-surface-700 hover:text-surface-200'
    }`}
  >
    {children}
  </button>
);

/* ── Main page ──────────────────────────────────────────── */
const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignedTo?.name?.toLowerCase().includes(q)
      );
    });

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6 animate-fade-up">
        <div className="min-w-0">
          <h1 className="page-title text-xl sm:text-2xl">Tasks</h1>
          <p className="text-surface-400 text-xs sm:text-sm mt-1">
            {tasks.length} total task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {user?.role === 'manager' && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary btn-sm sm:btn flex-shrink-0 whitespace-nowrap"
          >
            + New Task
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-3 animate-fade-up stagger-1">
        <input
          className="w-full field text-sm"
          placeholder="Search by title, description or assignee..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters — horizontally scrollable on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible animate-fade-up stagger-1">
        {[
          { key: 'all',         label: 'All' },
          { key: 'pending',     label: 'Pending' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed',   label: 'Completed' },
        ].map(({ key, label }) => (
          <FilterPill key={key} active={filter === key} onClick={() => setFilter(key)}>
            {label}
            <span className={`ml-1.5 ${filter === key ? 'text-accent-500' : 'text-surface-600'}`}>
              {counts[key]}
            </span>
          </FilterPill>
        ))}
      </div>

      {/* Task list */}
      <div className="panel animate-fade-up stagger-2">
        {loading ? (
          [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={3} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-surface-500">
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          filtered.map((task) => (
            <Link
              key={task._id}
              to={`/tasks/${task._id}`}
              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4
                         border-b border-surface-700/30 last:border-0
                         hover:bg-surface-800/50 transition-colors group"
            >
              {/* Indicator dot */}
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                task.status === 'completed' ? 'bg-ok-500' :
                task.status === 'in-progress' ? 'bg-info-500' : 'bg-warn-500'
              }`} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-100
                               group-hover:text-accent-300 transition-colors truncate">
                  {task.title}
                </p>
                <p className="text-xs text-surface-500 mt-0.5 truncate">
                  {user?.role === 'manager'
                    ? `→ ${task.assignedTo?.name}`
                    : `from ${task.createdBy?.name}`}
                  {task.deadline && (
                    <span className="ml-2 hidden xs:inline">
                      · Due {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              {/* Badge hidden on very small screens to avoid overflow */}
              <div className="hidden xs:block flex-shrink-0">
                <StatusBadge status={task.status} />
              </div>

              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="text-surface-600 group-hover:text-surface-400 transition-colors flex-shrink-0"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))
        )}
      </div>

      {showModal && (
        <TaskModal onClose={() => setShowModal(false)} onCreated={fetchTasks} />
      )}
    </div>
  );
};

export default Tasks;