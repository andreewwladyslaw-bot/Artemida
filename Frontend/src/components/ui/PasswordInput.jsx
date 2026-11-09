import { forwardRef, useState } from 'react';
import Input from './Input.jsx';
import { EyeIcon, EyeOffIcon, LockIcon } from './icons.jsx';

const PasswordInput = forwardRef(function PasswordInput(
  { autoComplete = 'current-password', ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      icon={<LockIcon />}
      action={
        <button
          type="button"
          className="field__action"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
