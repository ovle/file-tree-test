import React from "react";
import FileTreeNode from "./FileTreeNode";

const FileTree = ({files, onFileClick}) => (
    <div>
        <div>FileTree</div>
        {
            files.map((file, index) => (
                    <FileTreeNode file={file} onClick={onFileClick}/>
                )
            )
        }
    </div>
);

export default FileTree;