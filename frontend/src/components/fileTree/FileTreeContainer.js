import React, {Component} from "react";
import FileTree from "./FileTree";
import {fetchData} from "../../api/httpClient";
import {FileTreeNodeDto} from "../../model/file";


const fetchRoot = (success: (root: any) => void) => {
    return fetchData(
        `/files/root`, (root) => { success(new FileTreeNodeDto(root)) }
    )
};

const fetchFiles = (parentFileId: number, success: (children: any) => void) => {
    return fetchData(
        `/files/${parentFileId}`, (children) => { success(children.map (file => new FileTreeNodeDto(file, parentFileId))) }
    )
};

class FileTreeContainer extends Component {

    constructor(props) {
        super(props);
        //todo read from ls
        this.state = { root: null, nodes: {}, nodesByParent: {} };
    }

    componentDidMount = () => {
        fetchRoot(
            (root) => {
                this.setState(() => {
                    let nodes = {};
                    nodes[root.file.id] = root;
                    return { root: root, nodes: nodes }
                })
            }
        );
    };

    onNodeClick = (node) => {
        let parentFileId = node.file.id;
        fetchFiles(
            parentFileId ,
            (data) => {
                this.setState((prevState) => {
                    let nodes = { parentFileId: data, ...prevState.nodes };
                    return { nodes: nodes }
                })
            }
        );
    };

    getChildren = (node) => {
        let parentFileId = node.file.id;
        return this.state.nodes[parentFileId];
    };

    render = () => <div>
        <div>FileTreeContainer</div>
        { this.state.root && <FileTree root={this.state.root} onNodeClick={this.onNodeClick} getChildren={this.getChildren}/> }
    </div>;
}

export default FileTreeContainer;