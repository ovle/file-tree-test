import styled from 'styled-components'


const backgroundColor = `#2B2B2B`;
const textColor = `#7E7E7E`;
const borderColor = `#808080`;
const selectionBackgroundColor = `#214283`;
const selectionTextColor = `#7E7E7E`;
const errorTextColor = `#D25252`;
const openableNodeTextColor = `#CB772F`;

const buttonTextColor = `#808080`;
const buttonBackgroundColor = `#2B2B2B`;
const buttonSelectionTextColor = `#ebd7ff`;
const buttonSelectionBackgroundColor = `#7E7E7E`;
const buttonBorderColor = `#808080`;


const TreeDiv = styled.div`
  height: 100%;
`;

const Tree = styled(TreeDiv)`
  background: ${backgroundColor};
  border: 1px solid ${borderColor};
`;

const TreeTitle = styled.span`
  vertical-align: middle;
`;

const TreeHeader = styled.div`
  color: ${textColor};
  height: 5%;
  width: 100%;
  position: relative;
`;

const TreeFooter = styled.div``;

const TreeContent = styled(TreeDiv)`
  cursor: pointer; 
  user-select: none;
  position: relative;
  overflow-y: auto;  
  border: 1px solid ${borderColor};
  height: 90%;
`;

const Branch = styled.div`
  margin-top: 5px;
`;

const NodeWrapper = styled.div`
  color: ${textColor};
  text-align: left;
    &:hover {
    background-color: ${selectionBackgroundColor};
    color: ${selectionTextColor};
  }  
`;

const Node = styled.span``;

const ErrorNode = styled(Node)`
  color: ${errorTextColor};
`;

const OpenableNode = styled(Node)`
  color: ${openableNodeTextColor};
`;

const Button = styled.div`
  user-select: none;
  background: ${buttonBackgroundColor};
  border: 1px solid ${buttonBorderColor};
  color: ${buttonTextColor};
  &:hover {
    background-color: ${buttonSelectionBackgroundColor};
    color: ${buttonSelectionTextColor};
  }
  padding: 5px;
`;

export {
    Tree, TreeContent, TreeDiv, TreeHeader, TreeFooter, TreeTitle, Branch, Node, NodeWrapper, ErrorNode, OpenableNode, Button
}