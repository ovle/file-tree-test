import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree, TreeContent, TreeHeader} from "../styles.js";
import {Error} from "../styles";


class FileTree extends Component {

    render = () => {
        let {root, onNodeClick, isLoading, error} = this.props;
        return (
            <Tree style={{"overflow": "auto"}}>
                {/*todo fix header*/}
                <TreeHeader>
                    <div>File tree</div>
                    {error && <Error>{error}</Error>}
                </TreeHeader>
                <TreeContent>
                    {root && <FileTreeBranch branchRoot={root} onNodeClick={onNodeClick} isLoading={isLoading}/>}
                </TreeContent>
            </Tree>
        );
    };
}

export default FileTree;