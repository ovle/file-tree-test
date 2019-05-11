import styled, {css} from 'styled-components'


const Tree = styled.div`
  background: gray;
  cursor: pointer; 
  user-select: none;
`;

const Branch = styled.div`
  margin-left: 4em;
`;

const ClosedBranch = styled.div`
`;

const OpenedBranch = styled.div`
`;

const Node = styled.div`
  color: white;
  text-align: left;
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
    Tree, Branch, ClosedBranch, OpenedBranch, Node, NodeLoader, Warning, Error
}