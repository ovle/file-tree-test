// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";
import {Branch, NodeButton, NodeWrapper, TreeDiv} from "../styles";

/**
 * Expandable tree branch
 */
class FileTreeBranch extends Component {

    onNodeClick = () => {
        let {branchRoot, stateApi} = this.props;
        stateApi.onNodeClick(branchRoot);
    };

    componentWillUnmount(): void {
        let {branchRoot, stateApi} = this.props;
        stateApi.onNodeUnmount(branchRoot);
    }

    render() {
        let {branchRoot, stateApi} = this.props;
        let {isOpened, fileId: rootFileId} = branchRoot;
        let isLoading = branchRoot.loadingStatus === "Loading";
        let rootFile = stateApi.file(rootFileId);
        let children = stateApi.children(rootFileId);
        let mayHaveChildren = rootFile.mayHaveChildren;

        let loaderComponent = <NodeButton>{"[loading...]"}</NodeButton>;
        let openerComponent = <NodeButton>{isOpened ? "[-]" : "[+]"}</NodeButton>;

        return (
            <Branch>
                <NodeWrapper onClick={() => this.onNodeClick()}>
                    {/*todo fine controls */}
                    {isLoading ? loaderComponent : mayHaveChildren && openerComponent}
                    <FileTreeNode file={rootFile}/>
                </NodeWrapper>
                {isOpened &&
                <TreeDiv>
                    {
                        children.map((fileId) => (
                                <FileTreeBranch key={fileId} branchRoot={stateApi.node(fileId)} stateApi={stateApi}/>
                            )
                        )
                    }
                </TreeDiv>
                }
            </Branch>
        );
    }
}

export default FileTreeBranch;