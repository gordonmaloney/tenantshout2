import React from 'react';

export default function GreenOverlayImage({ src, alt, border_radius, max_width, height}) {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
      borderRadius: border_radius,
      maxWidth: max_width,
      width: '100%',
      height: height || 'auto',
    }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `contrast(115%) grayscale(18%)`,
        }}
      />

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(9,124,53,0.24)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
