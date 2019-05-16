import React, {Component} from "react";
import {Node} from "../styles.js";

//todo icon
class FileTreeNode extends Component {

    render() {
        let {file} = this.props;
        return (
            <Node>
                <span>{file.name} </span>
                <span>| {file.type}</span>
            </Node>
        );
    }
}

export default FileTreeNode;