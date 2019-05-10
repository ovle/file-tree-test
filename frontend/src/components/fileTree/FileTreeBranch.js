// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";

/**
 * Expandable tree branch
 */
class FileTreeBranch extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpened: props.branchRoot.isOpened}; // todo duplicated part of state
    }

    onBranchNodeClick = (node) => {
        if (!node.file.mayHaveChildren) return;

        //todo show loader
        let onSuccessLoading = () => {
            // console.log(`onSuccessLoading: ${node.file.id}`);
            this.setState((prevState) => {
                return {isOpened: !prevState.isOpened}
            }, () => {
                node.isOpened = this.state.isOpened
            });
            //todo hide loader
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
        let {branchRoot, onNodeClick} = this.props;
        let {isOpened} = this.state;
        let children = branchRoot.children;
        return (
            <div>
                <FileTreeNode file={branchRoot} onClick={this.onBranchNodeClick}/>

                {isOpened &&
                <div>
                    {
                        children.map((node) => (
                                <div key={node.file.id}>
                                    <FileTreeBranch branchRoot={node} onNodeClick={onNodeClick}/>
                                </div>
                            )
                        )
                    }
                </div>
                }
            </div>
        );
    }
}

export default FileTreeBranch;