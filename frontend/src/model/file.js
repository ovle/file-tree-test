// @flow

export type FileDto = {
    id: number,
    name?: string,
    type: string
}

export class FileTreeNodeDto {
    file: FileDto;
    children: Array<FileTreeNodeDto> = [];
    isLoaded: boolean; //todo is client caching needed? how to evict ?

    constructor(file: FileDto) {
        this.file = file;
        this.isLoaded = false;
    }
}
