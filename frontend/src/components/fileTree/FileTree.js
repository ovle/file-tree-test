import React from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree} from "../styles.js";
import {Error} from "../styles";

const FileTree = ({root, onNodeClick, error}) => (
    <Tree>
        {error && <Error>{error.text}</Error>}
        {root && <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick}/>}
    </Tree>
);

export default FileTree;