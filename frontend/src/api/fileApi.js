import {fetchData} from "./fetchData";

export const fetchFiles = (parentFileId?: number) => {
    return fetchData(
        `/files/${parentFileId || ''}`,
        (response) => {
            console.log(JSON.stringify(response));
        }
    )
};