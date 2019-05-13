// @flow

import React, {Component} from "react";
import FileTreeNode from "./FileTreeNode";
import {Branch} from "../styles";

/**
 * Expandable tree branch
 */
class FileTreeBranch extends Component {

    constructor(props) {
        super(props);
        this.state = { isOpened: props.branchRoot.isOpened, isLoading: props.isLoading }; // todo duplicated part of state
    }

    onBranchNodeClick = (node) => {
        if (!node.file.mayHaveChildren) return;

        //todo show loader
        //todo component can be unmounted when response has been received
        let onSuccessLoading = () => {
            this.setState((prevState) => {
                return {isOpened: !prevState.isOpened}
            }, () => {
                node.isOpened = this.state.isOpened
            });
            //todo hide loader
            node.isLoaded = true;
        };

        let onError = (error) => {
            //todo
            console.log("FileTreeBranch error");
        };

        if (node.isLoaded) {
            onSuccessLoading();
        } else {
            let {onNodeClick} = this.props;
            onNodeClick(node, onSuccessLoading, onError);
        }
    };

    render() {
        let {branchRoot, onNodeClick, isLoading, error} = this.props;
        let {isOpened} = this.state;
        let children = branchRoot.children;
        let mayHaveChildren = branchRoot.file.mayHaveChildren;
        let loaderComponent = <span style={{"text-align": "left"}}>{"[loading...]"}</span>;
        let openerComponent = <span style={{"text-align": "left"}} onClick={() => this.onBranchNodeClick(branchRoot)}>{isOpened ? "[-]" : "[+]"}</span>;

        return (
            <Branch>
                <div style={{"text-align": "left"}}>
                    {/*todo fine controls */}
                    { isLoading(branchRoot) ? loaderComponent : mayHaveChildren && openerComponent }
                    <FileTreeNode file={branchRoot.file}/>
                </div>
                {isOpened &&
                <div>
                    {
                        children.map((node) => (
                                <div key={node.file.id}>
                                    <FileTreeBranch branchRoot={node} onNodeClick={onNodeClick} isLoading={isLoading}/>
                                </div>
                            )
                        )
                    }
                </div>
                }
            </Branch>
        );
    }
}

export default FileTreeBranch;