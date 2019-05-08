import React from "react";
import FileTree from "./FileTree";
import {fetchData} from "../../api/httpClient";
import {FileTreeNodeDto} from "../../model/file";


const fetchFiles = (parentFileId?: number, success: (data: any) => void) => {
    return fetchData(
        `/files/${parentFileId || ''}`, (data) => { success(data.map (file => new FileTreeNodeDto(file, parentFileId))) }
    )
};

class FileTreeContainer extends React.Component {

    constructor() {
        super();
        this.state = { root: null, childrenCache: {} };
    }

    componentDidMount = () => {
        fetchFiles(
            this.state.root ? this.state.root.file.id : "" ,
            (data) => {
                this.setState(() => {
                    return { root: data && data[0] }
                })
            }
        );
    };

    onFileClick = (node) => {
        let parentFileId = node.file.id;
        fetchFiles(
            parentFileId ,
            (data) => {
                this.setState(() => {
                    return { childrenCache: { parentFileId: data } }
                })
            }
        );
    };

    getChildren = (node) => {
        let parentFileId = node.file.id;
        return this.state.childrenCache[parentFileId];
    };

    render = () => <div>
        <div>FileTreeContainer</div>
        { this.state.root && <FileTree files={[this.state.root]} onFileClick={this.onFileClick} getChildren = {this.getChildren}/> }
    </div>;
}

export default FileTreeContainer;