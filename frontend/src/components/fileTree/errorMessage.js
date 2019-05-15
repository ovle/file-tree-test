import messages from "../../utils/messages";
import type {FileDto} from "../../model/file";


export const errorMessage = (error, file: FileDto) => {
    //todo not sure how to make this check better
    if (error === "Network Error") {
        error = messages.error.serverUnavailable;
    }
    if ((typeof error == "string") || !file) return error;

    let errorText = messages.error[error.type] || error;
    let fileInfo = `${messages.file} ${file.name}`;
    return `${errorText}; ${fileInfo}`;
};