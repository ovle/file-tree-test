import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree} from "../styles.js";
import messages from "../../utils/messages";
import {Error} from "../styles";


class FileTree extends Component {

    errorMessage = error => {
        return messages.error[error.type] || error;
    };

    render = () => {
        let {root, onNodeClick, isLoading, error} = this.props;
        return (
            <Tree>
                {/*{error && <Error>{this.errorMessage(error)}</Error>}*/}
                {root && <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick} isLoading={isLoading}/>}
            </Tree>
        );
    };
}

export default FileTree;