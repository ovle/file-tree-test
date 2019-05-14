import styled from 'styled-components'


const TreeDiv = styled.div`
  height: 100%;
`;

const Tree = styled(TreeDiv)`
  background: #2B2B2B;
  border: 2px double #A9B7C6;
  cursor: pointer; 
  user-select: none;
`;

const Header = styled.div`
  color: #9876AA;
`;

const Branch = styled(TreeDiv)`
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
    Tree, TreeDiv, Header, Branch, Node, NodeButton, Warning, Error
}