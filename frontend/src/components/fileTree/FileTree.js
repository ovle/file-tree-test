import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree, TreeContent, TreeHeader} from "../styles.js";
import {Error} from "../styles";


class FileTree extends Component {

    render = () => {
        let {stateApi, error} = this.props;
        let treeRoot = stateApi.root();
        return (
            <Tree style={{"overflow": "auto"}}>
                {/*todo fix header*/}
                <TreeHeader>
                    <div>File tree</div>
                    {error && <Error>{error}</Error>}
                </TreeHeader>
                <TreeContent>
                    {treeRoot && <FileTreeBranch branchRoot={treeRoot} stateApi={stateApi}/>}
                </TreeContent>
            </Tree>
        );
    };
}

export default FileTree;