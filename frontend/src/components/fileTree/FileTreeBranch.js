// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";
import {Branch, NodeButton, TreeDiv} from "../styles";

/**
 * Expandable tree branch
 */
class FileTreeBranch extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpened: props.branchRoot.isOpened, isLoading: props.isLoading}; // todo duplicated part of state
    }

    onBranchNodeClick = (node) => {
        if (!node.file.mayHaveChildren) return;

        //todo component can be unmounted when response has been received
        let onSuccessLoading = () => {
            this.setState((prevState) => {
                return {isOpened: !prevState.isOpened}
            }, () => {
                node.isOpened = this.state.isOpened
            });
            node.isLoaded = true;
        };

        if (node.isLoaded) {
            onSuccessLoading();
        } else {
            let {onNodeClick} = this.props;
            onNodeClick(node, onSuccessLoading);
        }
    };

    render() {
        let {branchRoot, onNodeClick, isLoading} = this.props;
        let {isOpened} = this.state;
        let children = branchRoot.children;
        let mayHaveChildren = branchRoot.file.mayHaveChildren;
        let loaderComponent = <NodeButton>{"[loading...]"}</NodeButton>;
        let openerComponent = <NodeButton
            onClick={() => this.onBranchNodeClick(branchRoot)}>{isOpened ? "[-]" : "[+]"}</NodeButton>;

        return (
            <Branch>
                <div style={{"text-align": "left"}}>
                    {/*todo fine controls */}
                    {isLoading(branchRoot) ? loaderComponent : mayHaveChildren && openerComponent}
                    <FileTreeNode file={branchRoot.file}/>
                </div>
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