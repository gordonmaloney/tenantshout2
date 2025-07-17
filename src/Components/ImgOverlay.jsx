import React from 'react';

export default function GreenOverlayImage({ src, alt, border_radius, max_width, height}) {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
      borderRadius: border_radius,
      maxWidth: max_width,
    }}>
      {/* 1) your image with an adjustable contrast filter */}
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          height: height,
          filter: `contrast(130%) grayscale(30%)`,
        }}
      />

      {/* 2) the green overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,128,0,0.4)',  // play with alpha
        mixBlendMode: 'screen',               // or 'overlay', 'screen', etc.
        pointerEvents: 'none',
      }} />
    </div>
  );
}
