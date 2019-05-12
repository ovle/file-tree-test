package file.service

import AppConfig
import FileDto
import FileDto.Type.Directory
import FileDto.Type.OpenableArchive
import cache
import org.slf4j.LoggerFactory
import java.io.File

typealias FileId = Int


class FileService(
    private val fileTypeService: FileTypeService,
    private val archiveService: ArchiveService,
    private val config: AppConfig
) {

    private val filesById = cache<FileId, File?>(config.fileCacheExpireTime) {
            fileId -> file(fileId!!).also { logger.info("read file from FS: ${it!!.name}") }
    }

    private val childrenByParentId = cache<File, Collection<File>?>(config.fileCacheExpireTime) {
            file -> childrenFiles(file!!).also { logger.info("read children from FS, parent: ${file.name}") }
    }

    
    fun root() = File(config.defaultRootPath).run { this.toDto() }

    fun files(parentFileId: FileId) = childrenFiles(parentFileId).map { it.toDto() }


    private fun file(fileId: FileId) = File(config.defaultRootPath).walkTopDown().find { id(it) == fileId }

    private fun childrenFiles(parentFileId: FileId): Collection<File> {
        val parentFile = cachedFile(parentFileId)

        //todo normal case if the file was deleted!
        checkNotNull(parentFile) { "file with id $parentFileId was not found" }
        check(mayHaveChildren(parentFile)) { "file ${parentFile.name} cannot have children" }

        return cachedChildren(parentFile) ?: listOf()
    }

    private fun childrenFiles(parentFile: File): List<File> {
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

    private fun cachedFile(fileId: FileId) = filesById.get(fileId)

    private fun cachedChildren(file: File) = childrenByParentId[file]

    private fun id(file: File) = file.hashCode()

    private fun File.toDto() = FileDto(id(this), this.name, fileTypeService.type(this), mayHaveChildren(this))


    companion object {
        private val logger = LoggerFactory.getLogger(FileService::class.java)
    }
}