import React from "react";
import FileTreeBranch from "./FileTreeBranch";

const FileTree = ({root, onNodeClick}) => (
    <div>
        <div>FileTree</div>
        <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick}/>
    </div>
);

export default FileTree;