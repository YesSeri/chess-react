import styled from 'styled-components/macro';

export const Container = styled.div`
  width:  min(100vh, 100vw);
  height:  min(100vh, 100vw);
`;

export const Board = styled.div`
    display:grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr);
`;

export const Row = styled.div`
    &:nth-child(even){
        background-color: #EEE;
        img:nth-child(even){
            background-color:#9AB;
        }
    }
    &:nth-child(odd){
        background-color:#9AB;
        img:nth-child(even){
            background-color: #eee;
        }
    }
    display:flex;
`;

export const Square = styled.img`
    flex:1 0 0 ;
`;