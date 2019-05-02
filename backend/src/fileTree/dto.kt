
data class FileTreeNode(val id: String, val name: String, val type:Type, val children: List<FileTreeNode> = listOf()) {
    enum class Type {
        Directory,
        Image,
        Archive,
        Other
    }
}