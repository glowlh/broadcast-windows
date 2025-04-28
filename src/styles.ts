import styled, {createGlobalStyle} from "styled-components";

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
`;

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
