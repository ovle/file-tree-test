// @flow

export type FileDto = {
    id: number,
    name?: string,
    type: string
}

export type FileTreeNodeDto = {
    file: FileDto,
    opened: boolean,
    children: Array<FileTreeNodeDto>
}
