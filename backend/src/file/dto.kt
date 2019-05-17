
data class FileDto(val id: FileId, val name: String, val type: FileType, val mayHaveChildren: Boolean) {
    enum class FileType {
        Directory,
        Image,
        Archive,
        Other
    }
}