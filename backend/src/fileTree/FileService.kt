import FileDto.Type.Archive
import FileDto.Type.Directory
import fileTree.FileTypeService
import org.slf4j.LoggerFactory
import java.io.File

typealias FileId = Int

class FileService(private val fileTypeService: FileTypeService) {

    //todo concurrent/synchronized? eviction?
    private val filesById = mutableMapOf<FileId, File>()
    private val childrenByParentId = mutableMapOf<FileId, Collection<File>>()


    fun files(defaultParentPath: String, requestedParentFileId: FileId?): List<FileDto> {
        val parentFile = if (requestedParentFileId != null) cached(requestedParentFileId) else File(defaultParentPath)

        //todo error processing
        checkNotNull(parentFile)
        check(mayHaveChildren(parentFile)) { "file ${parentFile.name} cannot have children" }

        val parentFileId = requestedParentFileId ?: id(parentFile)
        cache(parentFile, parentFileId)

        val children = cachedChildren(parentFileId) ?: parentFile.listFiles().toList()
        cacheChildren(children, parentFileId)

        return children.map {
            val id = id(it)
            cache(it, id)
            FileDto(id, it.name, fileTypeService.type(it))
        }
    }

    private fun mayHaveChildren(parentFile: File): Boolean {
        return fileTypeService.type(parentFile) in setOf(Directory, Archive)  //todo only zip
    }

    private fun cache(file: File, fileId: FileId) {
        filesById[fileId] = file
    }

    private fun cacheChildren(children: Collection<File>, fileId: FileId) {
        childrenByParentId[fileId] = children
    }

    private fun cached(fileId: FileId?) = filesById[fileId]

    private fun cachedChildren(fileId: FileId?) = childrenByParentId[fileId]

    private fun id(file: File) = file.absolutePath.hashCode()

    companion object {
        private val logger = LoggerFactory.getLogger(FileService::class.java)
    }
}