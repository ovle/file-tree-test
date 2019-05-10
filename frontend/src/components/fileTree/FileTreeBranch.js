// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";

class FileTreeBranch extends Component{

    constructor(props) {
        super(props);
        let { branchRoot, getChildren } = this.props;
        this.state = { nodes: getChildren(branchRoot) };
    }

    render() {
        let { onNodeClick } = this.props;
        let nodes = this.state.nodes;
        let isBranch = Array.isArray(nodes);
        return (
            <div>
                {isBranch ?
                    <div>
                        {
                            nodes.map((node) => (
                                    <FileTreeNode file={node} onClick={onNodeClick}/>
                                )
                            )
                        }
                    </div>
                    : <FileTreeNode file={nodes} onClick={onNodeClick}/>
                }
            </div>
        );
    }
}

export default FileTreeBranch;