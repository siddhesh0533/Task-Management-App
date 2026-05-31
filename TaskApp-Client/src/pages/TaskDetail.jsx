import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const Field = ({ label, children }) => (
  <div>
    <p className="field-label">{label}</p>
    <div className="text-sm text-surface-200">{children || <span className="text-surface-500">—</span>}</div>
  </div>
);

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data);
        setForm({
          title: data.title,
          description: data.description || '',
          status: data.status,
          assignedTo: data.assignedTo?._id || '',
          deadline: data.deadline ? data.deadline.split('T')[0] : '',
        });
      } catch {
        toast.error('Task not found');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
    if (user?.role === 'manager') {
      api.get('/users').then(r => setEmployees(r.data)).catch(() => {});
    }
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/tasks/${id}`, form);
      setTask(data);
      setEditing(false);
      toast.success('Task updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/tasks/${id}`, { status: newStatus });
      setTask(data);
      setForm(f => ({ ...f, status: newStatus }));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="skeleton h-4 w-20 rounded mb-6" />
        <div className="panel p-6 space-y-5">
          <div className="skeleton h-7 w-1/2 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="divider" />
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back */}
      <Link to="/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-surface-500
                   hover:text-surface-200 transition-colors mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        Back to tasks
      </Link>

      <div className="panel p-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            {editing && user?.role === 'manager' ? (
              <input className="field text-lg font-semibold" value={form.title}
                onChange={e => setF('title', e.target.value)} />
            ) : (
              <h1 style={{ fontFamily: 'Syne, sans-serif' }}
                className="text-xl font-bold text-surface-50 leading-snug">
                {task.title}
              </h1>
            )}
            <p className="text-xs text-surface-500 mt-1.5">
              Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })} by {task.createdBy?.name}
            </p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="divider" />

        {/* Description */}
        <div className="mb-5">
          <p className="field-label">Description</p>
          {editing && user?.role === 'manager' ? (
            <textarea className="field resize-none" rows={4} value={form.description}
              onChange={e => setF('description', e.target.value)}
              placeholder="Add a description…" />
          ) : (
            <p className="text-sm text-surface-300 leading-relaxed">
              {task.description || <span className="text-surface-600 italic">No description</span>}
            </p>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <p className="field-label">Assigned to</p>
            {editing && user?.role === 'manager' ? (
              <select className="field" value={form.assignedTo}
                onChange={e => setF('assignedTo', e.target.value)}>
                {employees.map(e => (
                  <option key={e._id} value={e._id}>{e.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-surface-200">{task.assignedTo?.name}</p>
            )}
          </div>

          <div>
            <p className="field-label">Deadline</p>
            {editing && user?.role === 'manager' ? (
              <input type="date" className="field" value={form.deadline}
                onChange={e => setF('deadline', e.target.value)} />
            ) : (
              <p className="text-sm text-surface-200">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : <span className="text-surface-500">—</span>}
              </p>
            )}
          </div>
        </div>

        {/* Status control — employee */}
        {user?.role === 'employee' && (
          <div className="mb-6">
            <p className="field-label">Update Status</p>
            <div className="flex gap-2">
              {['pending', 'in-progress', 'completed'].map(s => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  disabled={saving || task.status === s}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-all capitalize ${
                    task.status === s
                      ? 'bg-accent-500/15 text-accent-400 border-accent-500/30'
                      : 'bg-surface-800 text-surface-400 border-surface-600 hover:text-surface-200'
                  }`}>
                  {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manager status edit */}
        {editing && user?.role === 'manager' && (
          <div className="mb-6">
            <p className="field-label">Status</p>
            <select className="field" value={form.status}
              onChange={e => setF('status', e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {/* Manager actions */}
        {user?.role === 'manager' && (
          <>
            <div className="divider" />
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button onClick={handleUpdate} disabled={saving} className="btn-primary">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="btn-ghost">Edit Task</button>
                  <button onClick={handleDelete} className="btn-danger">Delete</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
