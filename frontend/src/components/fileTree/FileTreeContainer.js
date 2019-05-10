import React, {Component} from "react";
import FileTree from "./FileTree";
import {fetchData} from "../../api/httpClient";
import {FileTreeNodeDto} from "../../model/file";


const fetchRoot = (success: (root: any) => void) => {
    return fetchData(
        `/files/root`, (root) => {
            success(new FileTreeNodeDto(root))
        }
    )
};

const fetchFiles = (parentFileId: number, success: (children: any) => void) => {
    return fetchData(
        `/files/${parentFileId}`, (children) => {
            success(children.map(file => new FileTreeNodeDto(file)))
        }
    )
};

// todo following structure needed:
// api wrapper -> state management wrapper -> view-only-aware tree component -> branch -> node
class FileTreeContainer extends Component {

    constructor(props) {
        super(props);
        //todo read from ls
        this.state = {root: null};
    }

    componentDidMount = () => {
        fetchRoot(
            (root) => {
                this.setState(() => {
                    return {root: root}
                })
            }
        );
    };

    onNodeClick = (node, onSuccessLoading) => {
        let parentFileId = node.file.id;
        fetchFiles(
            parentFileId,
            (children) => {
                node.children = children;

                this.setState((prevState) => {
                    return {root: prevState.root}
                }, onSuccessLoading)
            }
        );
    };

    render = () => <div>
        {this.state.root && <FileTree root={this.state.root} onNodeClick={this.onNodeClick}/>}
    </div>;
}

export default FileTreeContainer;