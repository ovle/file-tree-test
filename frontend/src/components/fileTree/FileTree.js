import React from "react";
import FileTreeBranch from "./FileTreeBranch";

const FileTree = ({root, onNodeClick}) => (
    <div>
        <div>FileTree</div>
        {root && <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick}/>}
    </div>
);

export default FileTree;