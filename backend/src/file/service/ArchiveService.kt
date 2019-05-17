package file.service

import FileId
import FileTreeErrorDto.ErrorType.ArchiveTypeNotSupported
import fail
import failIfNotValid
import file.service.archive.*
import id
import org.slf4j.LoggerFactory
import search
import java.io.File


class ArchiveService() {

    //todo client tree may have larger lifetime (with local storage) than any backend cache in case of backend restart
    // while this is not an issue for the directories, it can cause troubles here because of temp files/random names
    //todo backend api is stateful because of this
    private val tempFiles: MutableMap<FileId, File> = mutableMapOf()

    //todo use di
    private val processors: Collection<ArchiveProcessor> = listOf(
        ZipArchiveProcessor(), RarArchiveProcessor()
    )

    
    fun unpack(file: File): File {
        require(isArchive(file)) { "file ${file.absolutePath} is not an archive of is unknown type of archive" }

        val targetDir = tempFiles[file.id()] ?: unpackIntr(file)
        return targetDir.run { failIfNotValid(this) }
    }

    fun file(fileId: FileId): File? {
        tempFiles.values.forEach { it.search(fileId)?.let { file -> return file } }
        return null
    }

    fun isArchive(file: File) = processors.any { it.supports(file) }

    private fun unpackIntr(file: File): File {
        val targetDir = createTempDir()

        processors.find { it.supports(file) }
            ?.unpack(file, targetDir)
            ?: fail(ArchiveTypeNotSupported)

        tempFiles[file.id()] = targetDir
        return targetDir
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ArchiveService::class.java)
    }
}