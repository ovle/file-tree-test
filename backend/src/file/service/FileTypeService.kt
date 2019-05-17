package file.service

import FileDto
import FileDto.FileType.*
import org.slf4j.LoggerFactory
import java.io.File
import javax.imageio.ImageIO

class FileTypeService(private val archiveService: ArchiveService) {

    fun type(file: File): FileDto.FileType {
        return when {
            file.isDirectory -> Directory
            isArchive(file) -> Archive
            isImage(file) -> Image
            else -> Other
        }
    }

    private fun isArchive(file: File) = archiveService.isArchive(file)

    private fun isImage(file: File) = ImageIO.read(file) != null

    companion object {
        private val logger = LoggerFactory.getLogger(FileTypeService::class.java)
    }
}