package file.service

import FileId
import failIfNotValid
import id
import net.lingala.zip4j.core.NativeStorage
import net.lingala.zip4j.core.ZipFile
import org.slf4j.LoggerFactory
import search
import java.io.File


class ArchiveService {

    private val tempFiles: MutableMap<FileId, File> = mutableMapOf()

    fun unpack(file: File): File {
        val targetDir = tempFiles[file.id()] ?: unpackIntr(file)
        return targetDir.run { failIfNotValid(this) }
    }

    fun file(fileId: FileId): File? {
        tempFiles.values.forEach { it.search(fileId)?.let { file -> return file } }
        return null
    }

    private fun unpackIntr(file: File): File {
        val targetDir = createTempDir()
        val zip = ZipFile(NativeStorage(file))
        zip.extractAll(targetDir.absolutePath)

        tempFiles[file.id()] = targetDir
        return targetDir
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ArchiveService::class.java)
    }
}