import PropTypes from 'prop-types';

const Switch = ({ open, onClick }) => {
  // Remove redux usage from here, use props instead
  return (
    <div className="relative">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="relative w-10 h-8 flex items-center justify-center focus:outline-none"
        onClick={onClick}
      >
        {open ? (
          // Close (X) icon
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 w-8 h-8">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Hamburger icon
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 w-8 h-8">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>
    </div>
  );
};

Switch.propTypes = {
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Switch;
