import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', ...props }) => {
  return (
    <img
      src={logoImg}
      alt="SetuHub Logo"
      className={`${className} object-contain`}
      {...props}
    />
  );
};
