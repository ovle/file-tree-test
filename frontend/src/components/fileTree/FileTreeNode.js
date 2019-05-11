import React from "react";
import {Node} from "../styles.js";

//todo icon
const FileTreeNode = ({file: node}) =>
    (
        <Node>
            <div>{node.file.name}</div>
        </Node>
    );

export default FileTreeNode;