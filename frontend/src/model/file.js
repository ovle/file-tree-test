// @flow

type FileType = "Directory" | "Image" | "Archive" | "OpenableArchive" | "Other";
type LoadingStatus = "NotLoaded" | "Loading" | "Loaded";

export type FileDto = {
    id: number,
    name?: string,
    type: FileType,
    mayHaveChildren: boolean
}

export class NodeDto {
    fileId: number;
    loadingStatus: LoadingStatus = "NotLoaded"; //todo is client caching needed? how to evict ?
    isOpened: boolean = false;

    constructor(fileId: number) {
       this.fileId = fileId;
    }
}