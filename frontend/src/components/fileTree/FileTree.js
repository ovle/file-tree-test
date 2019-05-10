import React from "react";
import FileTreeBranch from "./FileTreeBranch";

const FileTree = ({root, onNodeClick, getChildren}) => (
    <div>
        <div>FileTree</div>
        <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick} getChildren={getChildren}/>
    </div>
);

export default FileTree;