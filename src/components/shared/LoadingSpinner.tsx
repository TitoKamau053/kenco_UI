import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-2'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-t-blue-900 border-r-blue-900 border-b-transparent border-l-transparent ${sizeClasses[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center p-4">{spinner}</div>;
};

export default LoadingSpinner;
