
data class FileTreeErrorDto(val type: ErrorType) {
    enum class ErrorType {
        FileNotFound,
        FileNotReadable,
        FileCannotHaveChildren,
        ArchiveError,
        Other
    }
}