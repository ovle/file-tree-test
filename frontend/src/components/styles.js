import styled from 'styled-components'


const TreeDiv = styled.div`
  height: 100%;
`;

const Tree = styled(TreeDiv)`
  overflow: auto;
  background: #2B2B2B;
  border: 2px double #A9B7C6;
`;

const TreeHeader = styled.div`
  color: #9876AA;
  width: 100%;
  position: fixed;
`;

const TreeContent = styled(TreeDiv)`
  cursor: pointer; 
  user-select: none;
`;

const Branch = styled.div`
  margin-top: 5px;
  padding-left: 4em;
`;

const NodeWrapper = styled.div`
  text-align: left;
    &:hover {
    background-color: #214283;
  }  
`;

const Node = styled.span`
  color: #619647;
  textAlign: left;
  margin-left: 5px;
  padding: 2px;
`;

const NodeButton = styled.span`
  textAlign: left;
  color: #9876AA;
`;

const Warning = styled.div`
  background: yellow;
  color: darkgray;
`;

const Error = styled.div`
  background: #D25252;
  color: white;
`;

export {
    Tree, TreeContent, TreeDiv, TreeHeader, Branch, Node, NodeWrapper, NodeButton, Warning, Error
}