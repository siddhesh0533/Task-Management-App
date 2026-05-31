const STATUS = {
  pending:      { cls: 'badge-pending',     label: 'Pending' },
  'in-progress':{ cls: 'badge-in-progress', label: 'In Progress' },
  completed:    { cls: 'badge-completed',   label: 'Completed' },
};

const StatusBadge = ({ status }) => {
  const { cls, label } = STATUS[status] || { cls: 'badge-pending', label: status };
  return <span className={cls}>{label}</span>;
};

export default StatusBadge;
