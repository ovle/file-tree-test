// @flow

type ErrorType = "FileNotFound" | "FileNotReadable" | "FileCannotHaveChildren" | "ArchiveError" | "Other";
type PayloadKey = "FileId" | "FileName" | "ParentFileId" | "ParentFileName"

export type FileTreeErrorDto = {
    type: ErrorType,
    payload: Map<PayloadKey, any>
}
