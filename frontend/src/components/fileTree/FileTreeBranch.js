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

    static nodeButton({isOpened, loadingStatus}, {type, mayHaveChildren}) {
        let isLoading = loadingStatus === "Loading";
        let isError = loadingStatus === "LoadingError";
        let text = isLoading ? "..." : isError ? "X" : isOpened ? "-" : "+";
        let nodeComponent = mayHaveChildren ? `[${text}]` : "";

        return <NodeButton>{nodeComponent}</NodeButton>;
    }

    render() {
        let {branchRoot, stateApi, level} = this.props;
        let {isOpened, fileId: rootFileId} = branchRoot;
        let rootFile = stateApi.file(rootFileId);
        let children = stateApi.children(rootFileId);
        let nodeButton = FileTreeBranch.nodeButton(branchRoot, rootFile);
        let leftPaddingPerLevel = 50;

        return (
            <Branch>
                <NodeWrapper onClick={() => this.onNodeClick()}>
                    <TreeDiv style={{"paddingLeft": `${leftPaddingPerLevel * level}px`}}>
                        {nodeButton}
                        <FileTreeNode file={rootFile}/>
                    </TreeDiv>
                </NodeWrapper>
                {isOpened &&
                <TreeDiv>
                    {
                        children.map(
                            (fileId) => (
                                <FileTreeBranch key={fileId} branchRoot={stateApi.node(fileId)} stateApi={stateApi}
                                                level={level + 1}/>
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