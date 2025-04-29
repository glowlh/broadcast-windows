import styled, {createGlobalStyle, css, keyframes} from "styled-components";
import {AnimationParams, Path} from "./types.ts";

export const Box = styled.div`
    background: #1a1a1a;
    height: 100vh;
    width: 100%;
    padding: 0;
    margin: 0;
    color: #afafaf;
    margin: auto;
    
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
`;

export const PortalBox = styled.div`
    width: 70px;
    height: 70px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: blanchedalmond;
    border-radius: 50%;
`;



export const animationMoving = (from: AnimationParams, to: AnimationParams) => {
  console.log(to);
  const animation = keyframes`
    0% {
        left: ${from.x || 0}px;
        top: ${from.x || 0}px;
    }
    100% {
        left: ${to.x || 0}px;
        top: ${to.x || 0}px;
    }
`;

  return css`${animation} 5s linear infinite`;
}



export const Particle = styled.div<Path>`
    position: absolute;
    width: 20px;
    height: 20px;
    background: cornflowerblue;
    border-radius: 50%;
    animation: ${({ from, to }) => animationMoving(from, to)};
`

export const GlobalStyles = createGlobalStyle`
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
    }
`;
