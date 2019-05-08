import React from "react";

const FileTreeNode = ({file: node, onClick}) =>
    (
        <div onClick={() => {
            onClick(node);
        }}>
            <div>{node.file.name}</div>
        </div>
    );

export default FileTreeNode;