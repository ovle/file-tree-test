package file.service

import net.lingala.zip4j.core.NativeStorage
import net.lingala.zip4j.core.ZipFile
import net.lingala.zip4j.model.FileHeader
import org.slf4j.LoggerFactory
import java.io.File

/**
 * todo name and feature
 * @author PasechnikMN, 06.05.2019 15:30
 */
class ArchiveService {
    //todo
    fun unpack(parentFile: File): File {
        val targetDir = createTempDir(prefix = parentFile.name, suffix = "")
        logger.info("targetDir: ${targetDir.absolutePath}")
        val zip = ZipFile(NativeStorage(parentFile))
        val fileHeaders = zip.fileHeaders.map { it as FileHeader }
        for (fileHeader in fileHeaders) {
            logger.info("zipped file: ${fileHeader.fileName}")
            val targetFile = createTempFile(prefix = fileHeader.fileName, suffix = "", directory = targetDir)
            logger.info("write to file: ${targetFile.absolutePath}")

            val inputStream = zip.getInputStream(fileHeader).use {
                targetFile.writeBytes(it.readBytes())
            }
        }

        return targetDir
//        return parentFile
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ArchiveService::class.java)
    }
}