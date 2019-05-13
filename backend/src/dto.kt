
data class FileTreeErrorDto(val type: ErrorType, val payload: Map<PayloadKey, Any>? = mapOf()) {
    
    enum class PayloadKey {
        FileId,
        FileName,
        ParentFileId,
        ParentFileName
    }

    enum class ErrorType {
        FileNotFound,
        FileNotReadable,
        FileCannotHaveChildren,
        ArchiveError,
        Other
    }
}