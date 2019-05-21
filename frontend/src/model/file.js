// @flow

type FileType = "Directory" | "Image" | "Archive" | "Other";

export type FileDto = {
    id: number,
    name?: string,
    type: FileType,
    mayHaveChildren: boolean
}