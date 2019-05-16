import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree, TreeContent, TreeHeader, TreeTitle, Button} from "../styles.js";
import {Error} from "../styles";
import messages from "../../utils/messages";


class FileTree extends Component {

    render = () => {
        let {stateApi, error} = this.props;
        let resetState = stateApi.reset;
        let treeRoot = stateApi.root();
        let resetButton = <Button style={{"margin": "-20px 10px 0px auto", "width": "100px"}}
                                  onClick={resetState}>{messages.reset}</Button>;

        return (
            <Tree>
                <TreeHeader>
                    <TreeTitle>{messages.title}</TreeTitle>
                    {resetButton}
                    {error && <Error>{error}</Error>}
                </TreeHeader>
                <TreeContent>
                    {treeRoot && <FileTreeBranch branchRoot={treeRoot} stateApi={stateApi} level={0}/>}
                </TreeContent>
            </Tree>
        );
    };
}

export default FileTree;