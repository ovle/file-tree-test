// @flow

type FileType = "Directory" | "Image" | "Archive" | "OpenableArchive" | "Other";

export type FileDto = {
    id: number,
    name?: string,
    type: FileType,
    mayHaveChildren: boolean
}

export class FileTreeNodeDto {
    file: FileDto;
    children: Array<FileTreeNodeDto> = [];
    isLoaded: boolean; //todo is client caching needed? how to evict ?
    isOpened: boolean;

    constructor(file: FileDto) {
        this.file = file;
        this.isLoaded = false;
        this.isOpened = false;
    }
}