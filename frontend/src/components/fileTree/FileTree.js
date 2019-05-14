import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree, TreeDiv, Header} from "../styles.js";
import {Error} from "../styles";


class FileTree extends Component {

    render = () => {
        let {root, onNodeClick, isLoading, error} = this.props;
        return (
            <TreeDiv>
                <Header style={{"width": "100%"}}>
                    <div>File tree</div>
                    {error && <Error>{error}</Error>}
                </Header>
                <Tree>
                    {root && <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick} isLoading={isLoading}/>}
                </Tree>
            </TreeDiv>
        );
    };
}

export default FileTree;