import React, { useState } from 'react';

interface ToolIconProps {
  src: string;
  alt: string;
  size?: number;
}

const ToolIcon: React.FC<ToolIconProps> = ({ src, alt, size = 64 }) => {
  const [error, setError] = useState(false);

  // 기본 아이콘 SVG (파비콘 로드 실패 시 표시)
  const defaultIcon = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>`;

  return (
    <img
      src={error ? defaultIcon : src}
      alt={alt}
      onError={() => setError(true)}
      style={{ width: size, height: size }}
    />
  );
};

export default ToolIcon;