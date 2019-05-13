
data class FileDto(val id: FileId, val name: String, val type:Type, val mayHaveChildren: Boolean) {
    enum class Type {
        Directory,
        Image,
        Archive,
        OpenableArchive,
        Other
    }
}