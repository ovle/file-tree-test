import React, {Component} from "react";
import FileTreeBranch from "./FileTreeBranch";
import {Tree, TreeContent, TreeHeader, TreeFooter, TreeTitle, Button} from "../styles.js";
import {Error} from "../styles";
import {withNamespaces} from "react-i18next";


class FileTree extends Component {

    render = () => {
        let {stateApi, error, t} = this.props;
        let resetState = stateApi.reset;
        let treeRoot = stateApi.root();
        let resetButton = <Button style={{"margin": "-20px 10px 0px auto", "width": "100px"}}
                                  onClick={resetState}>{t("reset")}</Button>;

        return (
            <Tree>
                <TreeHeader>
                    <TreeTitle>{t("title")}</TreeTitle>
                    {resetButton}
                </TreeHeader>
                <TreeContent>
                    {treeRoot && <FileTreeBranch branchRoot={treeRoot} stateApi={stateApi} level={0}/>}
                </TreeContent>
                <TreeFooter>
                    {error && <Error>{error}</Error>}
                </TreeFooter>
            </Tree>
        );
    };
}

export default withNamespaces("fileTree")(FileTree);