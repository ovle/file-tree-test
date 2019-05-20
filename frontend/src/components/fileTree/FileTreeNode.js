import React, {Component} from "react";
import {Node, ErrorNode, OpenableNode} from "../styles.js";


const typeIconConfig = {
    Directory: "folder",
    Image: "portrait",
    Archive: "lock",
    Other: "insert_drive_file",
};

const openedTypeIconConfig = {
    Directory: "folder_open",
    Archive: "lock_open"
};


class FileTreeNode extends Component {

    render() {
        let {file, node} = this.props;
        let {type, mayHaveChildren} = file;
        let {openingStatus, loadingStatus} = node;
        let isLoading = loadingStatus === "Loading";
        let isError = loadingStatus === "LoadingError";
        let iconName = isLoading ? "access_time" :
            (openingStatus && this.openedTypeIcon(type)) || this.typeIcon(type);
        let NodeComponent =  isError ? ErrorNode : mayHaveChildren ? OpenableNode : Node;

        return (
            <NodeComponent>
                <i className="material-icons" style={{"verticalAlign":"middle"}}>{iconName}</i>
                <span>{file.name} </span>
            </NodeComponent>
        );
    }

    typeIcon = (type) => typeIconConfig[type];

    openedTypeIcon = (type) => openedTypeIconConfig[type];
}

export default FileTreeNode;