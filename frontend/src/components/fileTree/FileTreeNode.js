import React from "react";

const FileTreeNode = ({file, onClick}) =>
    (
        <div onClick={() => {
            onClick(file);
        }}>
            <div>FileTreeNode</div>
            <div>{file.name}</div>
        </div>
    );

export default FileTreeNode;