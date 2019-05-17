// @flow

type ErrorType = "FileNotFound" | "FileNotReadable" | "FileCannotHaveChildren" | "ArchiveError" | "ArchiveTypeNotSupported" | "Other";

export type FileTreeErrorDto = {
    type: ErrorType
}
