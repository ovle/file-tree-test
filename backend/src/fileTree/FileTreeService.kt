
import org.slf4j.LoggerFactory


class FileTreeService {
    private val logger = LoggerFactory.getLogger(FileTreeService::class.java)

    fun fileTree(rootFileId: String?): Map<String, FileTreeNode> {
        logger.info("request for rootFileId: $rootFileId")

        //todo
        return mapOf("files" to FileTreeNode("1", "name", FileTreeNode.Type.Directory))
    }
}