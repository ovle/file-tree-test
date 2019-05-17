// @flow

type FileType = "Directory" | "Image" | "Archive" | "Other";
type LoadingStatus = "NotLoaded" | "Loading" | "Loaded" | "LoadingError";

export type FileDto = {
    id: number,
    name?: string,
    type: FileType,
    mayHaveChildren: boolean
}

export class NodeDto {
    fileId: number;
    loadingStatus: LoadingStatus = "NotLoaded";
    isOpened: boolean = false;

    constructor(fileId: number) {
       this.fileId = fileId;
    }
}