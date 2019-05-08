package file.service

import net.lingala.zip4j.core.NativeStorage
import net.lingala.zip4j.core.ZipFile
import net.lingala.zip4j.model.FileHeader
import org.slf4j.LoggerFactory
import java.io.File


class ArchiveService {

    fun unpack(parentFile: File): File {
        val targetDir = createTempDir(prefix = parentFile.name, suffix = "")
        val zip = ZipFile(NativeStorage(parentFile))
        val fileHeaders = zip.fileHeaders.map { it as FileHeader }
        for (fileHeader in fileHeaders) {
            val targetFile = createTempFile(prefix = fileHeader.fileName, suffix = "", directory = targetDir)

            zip.getInputStream(fileHeader).use {
                targetFile.writeBytes(it.readBytes())
            }
        }

        return targetDir
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ArchiveService::class.java)
    }
}