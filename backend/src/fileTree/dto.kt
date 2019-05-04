
data class FileDto(val id: FileId, val name: String, val type:Type) {
    enum class Type {
        Directory,
        Image,
        Archive,
        Other
    }
}