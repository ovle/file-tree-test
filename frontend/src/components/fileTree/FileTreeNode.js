import React, {Component} from "react";
import {Node} from "../styles.js";

//todo icon
class FileTreeNode extends Component {

    render() {
        let {file} = this.props;
        let fullName = file.name;
        let splittedFullName = fullName.split('.');
        let name = splittedFullName[0];
        let extension = splittedFullName.length > 1 && splittedFullName.pop();

        return (
            <Node>
                <span>{name} </span>
                {extension && <span>| {extension}</span>}
                <span>| {file.type}</span>
            </Node>
        );
    }
}

export default FileTreeNode;