package file.service

import FileDto
import FileDto.Type.*
import org.slf4j.LoggerFactory
import java.io.File
import java.lang.IllegalArgumentException

typealias FileId = Int

class FileService(private val fileTypeService: FileTypeService, private  val archiveService: ArchiveService) {

    //todo concurrent/synchronized? eviction?
    private val filesById = mutableMapOf<FileId, File>()
    private val childrenByParentId = mutableMapOf<FileId, Collection<File>>()


    fun files(defaultParentPath: String, requestedParentFileId: FileId?): List<FileDto> {
        val parentFile = if (requestedParentFileId != null) cached(requestedParentFileId) else File(defaultParentPath)

        //todo error processing
        checkNotNull(parentFile) { "file with id $requestedParentFileId was not found" }
        check(mayHaveChildren(parentFile)) { "file ${parentFile.name} cannot have children" }

        val parentFileId = requestedParentFileId ?: id(parentFile)
        cache(parentFile, parentFileId)

        val children = cachedChildren(parentFileId) ?: children(parentFile)
        cacheChildren(children, parentFileId)

        return children.map {
            val id = id(it)
            cache(it, id)
            FileDto(id, it.name, fileTypeService.type(it), mayHaveChildren(it))
        }
    }

    private fun children(parentFile: File): List<File> {
        val parentType = fileTypeService.type(parentFile)
        return when (parentType) {
            Directory -> parentFile
            OpenableArchive -> archiveService.unpack(parentFile)
            else -> throw IllegalArgumentException("get children not supported for type $parentType")
        }.listFiles().toList()
    }

    private fun mayHaveChildren(parentFile: File): Boolean {
        return fileTypeService.type(parentFile) in setOf(Directory, OpenableArchive)
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