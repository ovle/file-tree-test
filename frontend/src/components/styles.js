import styled from 'styled-components'


const TreeDiv = styled.div`
  height: 100%;
`;

const Tree = styled(TreeDiv)`
  background: #2B2B2B;
  border: 1px solid #808080;
`;

const TreeTitle = styled.span`
  vertical-align: middle;
`;

const TreeHeader = styled.div`
  color: #9876AA;
  height: 10%;
  width: 100%;
  position: relative;
`;

const TreeContent = styled(TreeDiv)`
  cursor: pointer; 
  user-select: none;
  position: relative;
  overflow-y: auto;  
  border: 1px solid #808080;
  height: 90%;
`;

const Branch = styled.div`
  margin-top: 5px;
`;

const NodeWrapper = styled.div`
  text-align: left;
    &:hover {
    background-color: #214283;
  }  
`;

const Node = styled.span`
  color: #619647;
  margin-left: 5px;
  padding: 2px;
`;

const NodeButton = styled.span`
  color: #9876AA;
`;

const Error = styled.div`
  background: #D25252;
  color: white;
`;

const Button = styled.div`
  user-select: none;
  background: #2B2B2B;
  border: 1px solid #808080;
  color: A9B7C6;
  &:hover {
    background-color: #214283;
  }
  padding: 5px;
`;

export {
    Tree, TreeContent, TreeDiv, TreeHeader, TreeTitle, Branch, Node, NodeWrapper, NodeButton, Error, Button
}