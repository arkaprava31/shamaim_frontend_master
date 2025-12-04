import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoaderContainer = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
`;

const LogoWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  transition: fill 1s ease-in-out;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
  svg {
    fill: ${(props) => props.logoColor};
    width: 100%;
    height: 100%;
  }
`;



const Loader = () => {
  const [logoColor, setLogoColor] = useState('#FFF');
  const [currentLogo, setCurrentLogo] = useState(0);

  const logos = [
    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <path d="M692.33,599.69l54.11,54.11c86.87,86.87,86.87,227.71,0,314.58h0c-17.16,17.16-44.99,17.16-62.16,0l-368.68-368.68c-17.16-17.16-17.16-44.99,0-62.16l242.47-242.47c86.87-86.87,227.71-86.87,314.58,0h0c17.16,17.16,17.16,44.99,0,62.16l-180.32,180.32c-17.16,17.16-17.16,44.99,0,62.16Z"/>
      <path d="M422.11,391.62l-126.21,126.21c-17.16,17.16-44.99,17.16-62.16,0l-54.11-54.11c-86.87-86.87-86.87-227.71,0-314.58h0c17.16-17.16,44.99-17.16,62.16,0l180.32,180.32c17.16,17.16,17.16,44.99,0,62.16Z"/>
      <path d="M422.11,807.76l-180.32,180.32c-17.16,17.16-44.99,17.16-62.16,0h0c-86.87-86.87-86.87-227.71,0-314.58l54.11-54.11c17.16-17.16,44.99-17.16,62.16,0l126.21,126.21c17.16,17.16,17.16,44.99,0,62.16Z"/>
      <circle cx="463.03" cy="111.78" r="112.73"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.12 3.13l-5.66 5.66c-.75.75-.2 2.05.84 2.05h4.12c1.1 0 2-.9 2-2V5.66c0-1.04-1.3-1.59-2.05-.84zM14 11L3.74 0.74a.9959.9959 0 00-1.41 0L.74 2.33a.9959.9959 0 000 1.41L11 14l3-3zM17 13H9c-1.1 0-2-.9-2-2V4h2v6c0 .55.45 1 1 1h8v2z"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
      <path d="M31.84 4.38c-1.4 0-2.8 0-4.2 0C19.44 4.38 15 8.62 15 16.08V48c0 4.42 3.58 8 8 8h1v-4h-1c-2.21 0-4-1.79-4-4V16.08c0-4.09 2.41-7.5 6.6-7.5s6.6 3.41 6.6 7.5v33.92c0 2.21-1.79 4-4 4h-1v4h1c4.42 0 8-3.58 8-8V16.08c0-7.46-4.44-11.7-12.64-11.7z"/>
      <path d="M50.15 11.68c-6.45 0-12.44 3.48-14.35 8.88-1.9-5.4-7.9-8.88-14.34-8.88C11.97 11.68 5 18.66 5 27.3V48c0 6.62 5.38 12 12 12h30c6.62 0 12-5.38 12-12V27.3c0-8.64-6.97-15.62-15.85-15.62zM53 48c0 4.41-3.59 8-8 8H19c-4.41 0-8-3.59-8-8V27.3c0-4.6 3.15-8.26 7.33-8.26 4.19 0 8.33 2.82 8.87 8.28h2.66c.54-5.46 4.68-8.28 8.87-8.28 4.18 0 7.33 3.66 7.33 8.26V48z"/>
    </svg>
  ];

  useEffect(() => {
    const colors = ['#FFFFFF', '#1E3A8A', '#10B981', '#D97706', '#EF4444'];
    let colorIndex = 0;
    let logoIndex = 0;
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setLogoColor(colors[colorIndex]);
      logoIndex = (logoIndex + 1) % logos.length;
      setCurrentLogo(logoIndex);
    }, 1000);
    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <LoaderWrapper>
      <LoaderContainer>
        <LogoWrapper logoColor={logoColor}>
          {logos[currentLogo]}
        </LogoWrapper>
      </LoaderContainer>
    </LoaderWrapper>
  );
};

export default Loader;
