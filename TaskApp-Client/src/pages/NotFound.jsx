import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center text-center p-4 sm:p-8">
    <div className="animate-fade-up w-full max-w-xs sm:max-w-sm md:max-w-md">

      {/* Giant 404 — scales from mobile to desktop */}
      <p
        style={{ fontFamily: 'Syne, sans-serif' }}
        className="
          text-[6rem] leading-none
          sm:text-[8rem]
          md:text-[10rem]
          font-extrabold text-surface-800 mb-4 select-none
        "
      >
        404
      </p>

      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-surface-200 mb-2">
        Page not found
      </h1>

      <p className="text-surface-500 text-xs sm:text-sm mb-8 px-2 sm:px-0">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="btn-primary inline-block px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base"
      >
        Go home
      </Link>

    </div>
  </div>
);

export default NotFound;