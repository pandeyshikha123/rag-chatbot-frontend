import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

const Button: React.FC<Props> = ({ children, className = "", ...rest }) => {
  return (
    <button {...rest} className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
