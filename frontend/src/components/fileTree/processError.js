import messages from "../../utils/messages";
import type {FileDto} from "../../model/file";
import {NodeDto} from "../../model/file";


function errorInfo(error, file) {
    let errorText = messages.error[error.type] || error;
    let fileInfo = `${messages.file} ${file.name}`;
    return `${errorText}; ${fileInfo}`;
}

//todo process tree state depending on errors
//FileNotFound - remove file from tree
//FileCannotHaveChildren - set mayHaveChildren=false
//ArchiveError - set mayHaveChildren=false
export const processError = (prevState, error, node: NodeDto, file: FileDto) => {
    //todo not sure how to make this check better
    if (error === "Network Error") {
        error = messages.error.serverUnavailable;
    }
    if ((typeof error == "string") || !node) return error;

    return {
        error: errorInfo(error, file)
    };
};