// @flow

type FileType = "Directory" | "Image" | "Archive" | "Other";
type LoadingStatus = "NotLoaded" | "Loading" | "Loaded" | "LoadingError";

export type FileDto = {
    id: number,
    name?: string,
    type: FileType,
    mayHaveChildren: boolean
}

export type NodeDto = {
    fileId: number,
    loadingStatus: LoadingStatus,
    openingStatus: boolean
}