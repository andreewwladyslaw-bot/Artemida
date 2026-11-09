import { forwardRef, useId } from 'react';
import './ui.css';

const Input = forwardRef(function Input(
  { label, error, id, icon, action, className = '', ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;

  const classes = [
    'field',
    error && 'field--error',
    icon && 'field--has-icon',
    action && 'field--has-action',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        {icon && <span className="field__icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className="field__input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {action}
      </div>
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
