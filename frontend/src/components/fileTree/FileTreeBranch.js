// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";
import {Branch, NodeButton, NodeWrapper, TreeDiv} from "../styles";

/**
 * Expandable tree branch
 */
class FileTreeBranch extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpened: props.branchRoot.isOpened, isLoading: props.isLoading}; // todo duplicated part of state
    }

    //todo rewrite. should react to props change, not change state on callback
    onSuccessLoading = () => {
        this.setState((prevState) => {
            return {isOpened: !prevState.isOpened}
        }, () => {
            let {branchRoot} = this.props;
            branchRoot.isOpened = this.state.isOpened
        });
    };

    onBranchNodeClick = (node) => {
        if (!node.file.mayHaveChildren) return;

        let {isOpened} = node;
        if (isOpened || node.isLoaded) {
            this.onSuccessLoading();
        } else {
            let {onNodeClick} = this.props;
            this.cancelExpanding = onNodeClick(node, this.onSuccessLoading);
        }
    };

    componentWillUnmount(): void {
        this.cancelExpanding && this.cancelExpanding();
    }

    render() {
        let {branchRoot, onNodeClick, isLoading} = this.props;
        let {isOpened} = this.state;
        let children = branchRoot.children;
        let mayHaveChildren = branchRoot.file.mayHaveChildren;
        let loaderComponent = <NodeButton>{"[loading...]"}</NodeButton>;
        let openerComponent = <NodeButton>{isOpened ? "[-]" : "[+]"}</NodeButton>;

        return (
            <Branch>
                <NodeWrapper onClick={() => this.onBranchNodeClick(branchRoot)}>
                    {/*todo fine controls */}
                    {isLoading(branchRoot) ? loaderComponent : mayHaveChildren && openerComponent}
                    <FileTreeNode file={branchRoot.file}/>
                </NodeWrapper>
                {isOpened &&
                <TreeDiv>
                    {
                        children.map((node) => (
                                <FileTreeBranch key={node.file.id} branchRoot={node} onNodeClick={onNodeClick}
                                                isLoading={isLoading}/>
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