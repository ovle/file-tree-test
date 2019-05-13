import styled from 'styled-components'


const Tree = styled.div`
  // background: #2B2B2B;
  border: 2px double #A9B7C6;
  cursor: pointer; 
  user-select: none;
`;

const Branch = styled.div`
  margin-top: 5px;
  padding-left: 4em;
`;

const Node = styled.span`
  color: #619647;
  textAlign: left;
  margin-left: 5px;
  padding: 2px;
    // border: 1px double #A9B7C6;  
`;

const NodeLoader = styled.div`
`;

const Warning = styled.div`
  background: yellow;
  color: darkgray;
`;

const Error = styled.div`
  background: red;
  color: white;
`;

export {
    Tree, Branch, Node, NodeLoader, Warning, Error
}