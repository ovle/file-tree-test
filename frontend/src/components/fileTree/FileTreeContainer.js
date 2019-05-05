import React from "react";
import FileTree from "./FileTree";
import {fetchData} from "../../api/httpClient";


const fetchFiles = (parentFileId?: number, success: (data: any) => void) => {
    return fetchData(
        `/files/${parentFileId || ''}`, success
    )
};

class FileTreeContainer extends React.Component {

    constructor() {
        super();
        this.state = {parentFileId: null, files: []};
    }

    componentDidMount = () => {
        fetchFiles(
            this.state.parentFileId,
            (data) => {
                this.setState(() => {
                    return { files: data }
                })
            }
        );
    };

    render = () => <div>
        <div>FileTreeContainer</div>
        <FileTree files={this.state.files} onFileClick={ (file) => { console.log(`click file: ${file.name}`) } }/>
    </div>;
}


export default FileTreeContainer;