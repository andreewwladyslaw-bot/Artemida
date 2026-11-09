import './ui.css';

export default function Button({
  children,
  type = 'button',
  loading = false,
  block = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn ${block ? 'btn--block' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...props}
    >
      {children}
      {loading && <span className="btn__spinner" aria-hidden="true" />}
    </button>
  );
}
