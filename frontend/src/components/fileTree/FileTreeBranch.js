import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";
import {Branch, NodeWrapper, TreeDiv} from "../styles";

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
        let {branchRoot, stateApi, level} = this.props;
        let {openingStatus, fileId: rootFileId} = branchRoot;
        let rootFile = stateApi.file(rootFileId);
        let children = stateApi.children(rootFileId);
        let leftPaddingPerLevel = 60;

        return (
            <Branch>
                <NodeWrapper onClick={() => this.onNodeClick()}>
                    <TreeDiv style={{"paddingLeft": `${leftPaddingPerLevel * level}px`}}>
                        <FileTreeNode file={rootFile} node={branchRoot}/>
                    </TreeDiv>
                </NodeWrapper>
                {openingStatus &&
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