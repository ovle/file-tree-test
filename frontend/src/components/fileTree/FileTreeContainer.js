import React, {Component} from "react";
import FileTree from "./FileTree";
import {fetchData} from "../../api/httpClient";
import {FileTreeNodeDto} from "../../model/file";
import ls from "local-storage";


const STATE_STORAGE_KEY = "STATE_STORAGE_KEY";

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
        this.state = ls.get(STATE_STORAGE_KEY) || {root: null};
    }

    componentDidMount = () => {
        if (this.state.root) return;

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
                }, this.onSuccessLoading(onSuccessLoading))
            }
        );
    };

    onSuccessLoading(onSuccessLoading) {
        ls.set(STATE_STORAGE_KEY, this.state);

        return onSuccessLoading;
    }

    render = () => <div>
        <FileTree root={this.state.root} onNodeClick={this.onNodeClick}/>
    </div>;
}

export default FileTreeContainer;