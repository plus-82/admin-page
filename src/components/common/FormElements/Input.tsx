import React from 'react';
import './FormElements.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  const classes = [
    'form-input',
    error ? 'form-input-error' : '',
    fullWidth ? 'form-input-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-control ${fullWidth ? 'form-control-full-width' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...props} />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Input;