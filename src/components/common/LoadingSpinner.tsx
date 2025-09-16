import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div role="status" aria-hidden="false" className="loading-spinner">
      <svg width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.415, 31.415"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
