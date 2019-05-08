// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";

class FileTreeBranch extends Component<{ branchRoot: any, onNodeClick: any, getChildren: any }> {

    constructor() {
        super();
        this.state = { nodes: [] };
    }

    componentWillReceiveProps(nextProps: any, nextContext: any): void {
        let { branchRoot, getChildren } = nextProps;
        this.setState(() => ({nodes: getChildren(branchRoot)}))
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