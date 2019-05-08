// @flow

export type FileDto = {
    id: number,
    name?: string,
    type: string
}

export class FileTreeNodeDto {
    file: FileDto;
    opened: boolean = false;

    parentId: number;
    // children: Array<FileTreeNodeDto> = [];

    constructor(file: FileDto, parentId: number) {
        this.file = file;
        this.parentId = parentId;
    }
}
