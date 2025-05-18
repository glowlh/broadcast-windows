import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { AnimationParams, Path } from './types.ts';

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
    
    html,
    body {
        padding: 0;
        margin: 0;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    * {
        box-sizing: border-box;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: normal;
        color: azure;
    }
`;

const PORTAL_COLOR = {
  main: {
    border: '#0559D8',
    shadow: 'rgba(72, 140, 232, 0.51)',
  },
  secondary: {
    border: '#B0320B',
    shadow: 'rgba(232, 142, 86, 0.51)',
  },
};

export const Box = styled.div`
  background: #1a1a1a;
  height: 100vh;
  width: 100%;
  color: #afafaf;
  margin: 0;
  padding: 24px 16px;

  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 8px;
  position: relative;
  overflow: hidden;
`;

const portalAnimation = keyframes`
    0% {
        transform: rotate(0deg) skew(0deg, 0deg) translate(-50%, -50%);
    }
    50% {
        transform: rotate(-5deg) skew(20deg, 30deg) translate(-50%, -50%);
    }
    100% {
        transform: rotate(-10deg) skew(0deg, 0deg) translate(-50%, -50%);
    }
`;

export const PortalBox = styled.div<{ isMain: boolean }>`
  width: 70px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border-radius: 50%;
  border: 2px solid
    ${({ isMain }) =>
      isMain ? PORTAL_COLOR.main.border : PORTAL_COLOR.secondary.border};

  animation: 4s linear 0s infinite alternate ${portalAnimation};
  transform-origin: center;
  box-shadow: 0px 0px 20px 2px
    ${({ isMain }) =>
      isMain ? PORTAL_COLOR.main.shadow : PORTAL_COLOR.secondary.shadow};

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 0px
      ${({ isMain }) =>
        isMain ? PORTAL_COLOR.main.shadow : PORTAL_COLOR.secondary.shadow}
      inset;
  }
`;

export const animationMoving = (from: AnimationParams, to: AnimationParams) => {
  const animation = keyframes`
    0% {
        left: ${from.x || 0}px;
        top: ${from.y || 0}px;
        transform: rotate(0deg);
    }
    50% {
        left: ${to.x || 0}px;
        top: ${to.y || 0}px;
        transform: rotate(360deg);
    }
      
    100% {
        left: ${from.x || 0}px;
        top: ${from.y || 0}px;
        transform: rotate(720deg);
    }
`;

  return css`
    ${animation} 2s linear
  `;
};

export const animationMovingInitial = (
  from: AnimationParams,
  to: AnimationParams,
) => {
  const animation = keyframes`
    0% {
        left: ${from.x || 0}px;
        top: ${from.y || 0}px;
        transform: rotate(0deg);
    }
    100% {
        left: ${to.x || 0}px;
        top: ${to.y || 0}px;
        transform: rotate(360deg);
    }
`;

  return css`
    ${animation} 2s linear
  `;
};

export const Particle = styled.img<
  Path & { canAnimate: boolean; isInitial: boolean }
>`
  position: absolute;
  width: 30px;
  height: 30px;
  ${({ canAnimate }) =>
    canAnimate
      ? css`
          animation: ${({ from, to, isInitial }) =>
            isInitial
              ? animationMovingInitial(from, to)
              : animationMoving(from, to)};
        `
      : ''}}
  
`;

export const ButtonsBox = styled.div`
  display: flex;
  gap: 8px;
`;

export const Button = styled.button<{ hint: string }>`
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;

  &:hover {
    background: transparent;

    & * {
      fill: beige;
    }
  }

  &:before {
    content: '${({ hint }) => hint}';
    position: absolute;
    bottom: calc(100% + 4px);
    width: 100%;
    white-space: nowrap;
    color: beige;
    display: none;
  }

  &:hover:before {
    display: block;
  }

  * {
    fill: azure;
  }
`;

export const HeaderTextID = styled.h1`
  margin: 0;
  opacity: 0.2;
  font-size: 18px;
  margin-left: auto;
  padding: 0;
  font-weight: 300;
`;
