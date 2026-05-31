import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center text-center p-8">
    <div className="animate-fade-up">
      <p style={{ fontFamily: 'Syne, sans-serif' }}
        className="text-8xl font-extrabold text-surface-800 mb-4 select-none">
        404
      </p>
      <h1 className="text-xl font-semibold text-surface-200 mb-2">Page not found</h1>
      <p className="text-surface-500 text-sm mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  </div>
);

export default NotFound;
