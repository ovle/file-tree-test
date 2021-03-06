package file.service

import AppConfig
import FileTreeErrorDto.*
import FileDto
import FileDto.FileType.*
import FileId
import cache
import failIf
import failIfNot
import failIfNotValid
import id
import org.slf4j.LoggerFactory
import search
import java.io.File


class FileService(
    private val fileTypeService: FileTypeService,
    private val archiveService: ArchiveService,
    private val config: AppConfig
) {

    private val filesById = cache<FileId, File?>(config.fileCacheExpireTime) { fileId ->
        file(fileId!!)
    }

    private val childrenByParentId = cache<File, Collection<File>?>(config.fileCacheExpireTime) { file ->
        childrenFiles(file!!)
    }

    /**
     * Path to rhe root of the file tree
     */
    fun root() = rootFile().run { this.toDto() }

    /**
     * List of the children files
     * Result depends on parent's type, @see [mayHaveChildren]
     * @param parentFileId  id of the parent file
     */
    fun children(parentFileId: FileId) = childrenFiles(parentFileId).map { it.toDto() }


    private fun file(fileId: FileId) = (rootFile().search(fileId) ?: archiveService.file(fileId)).run { failIfNotValid(this) }

    private fun rootFile() = File(config.defaultRootPath).also {
        check(it.exists()) { "root file is not exists. path = ${config.defaultRootPath}" }

        failIfNot(it.canRead(), ErrorType.FileNotReadable)
    }

    private fun childrenFiles(parentFileId: FileId): Collection<File> {
        val parentFile = cachedFile(parentFileId)

        failIf(parentFile == null, ErrorType.FileNotFound)
        failIfNot(mayHaveChildren(parentFile!!), ErrorType.FileCannotHaveChildren)

        return cachedChildrenFiles(parentFile) ?: listOf()
    }

    private fun childrenFiles(parentFile: File): List<File> {
        val parentType = fileTypeService.type(parentFile)
        return when (parentType) {
            Directory -> parentFile
            Archive -> archiveService.unpack(parentFile)
            else -> throw IllegalArgumentException("get children not supported for type $parentType")
        }.listFiles().filter { it.canRead() }.toList()
    }

    private fun mayHaveChildren(parentFile: File): Boolean {
        return fileTypeService.type(parentFile) in FILE_TYPES_WITH_CHILDREN
    }

    private fun cachedFile(fileId: FileId) = filesById.get(fileId)

    private fun cachedChildrenFiles(parentFile: File) = childrenByParentId[parentFile]

    private fun File.toDto() = FileDto(this.id(), this.name, fileTypeService.type(this), mayHaveChildren(this))


    companion object {
        private val logger = LoggerFactory.getLogger(FileService::class.java)
        private val FILE_TYPES_WITH_CHILDREN = setOf(Directory, Archive)
    }
}