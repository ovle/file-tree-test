// @flow

type ErrorType = "FileNotFound" | "FileNotReadable" | "FileCannotHaveChildren" | "ArchiveError" | "Other";

export type FileTreeErrorDto = {
    type: ErrorType
}
