package fileTree

import FileDto.Type.*
import org.slf4j.LoggerFactory
import java.io.BufferedInputStream
import java.io.DataInputStream
import java.io.File
import java.io.FileInputStream
import javax.imageio.ImageIO

/**
 * todo name and feature
 * @author PasechnikMN, 05.05.2019 18:50
 */
class FileTypeService {

    fun type(file: File): FileDto.Type {
        return when {
            file.isDirectory -> Directory
            isArchive(file) -> Archive
            isImage(file) -> Image
            else -> Other
        }
    }

    private fun isImage(file: File) = ImageIO.read(file) != null

    private fun isArchive(file: File) = testSignatures(file, ZIP_FILE_SIGNATURES) || testSignatures(file, RAR_FILE_SIGNATURES)

    private fun testSignatures(file: File, signatures: Array<ByteArray>) =
        DataInputStream(BufferedInputStream(FileInputStream(file))).use { inputStream ->
            val fileFirstBytes = ByteArray(MAX_SIGNATURE_LENGTH)
            val bytesRead = inputStream.read(fileFirstBytes)
            signatures.any {
                    signatureBytes ->
                if (bytesRead < signatureBytes.size) return false
                signatureBytes.zip(fileFirstBytes).all { it.first == it.second }
            }
        }

    companion object {
        private val logger = LoggerFactory.getLogger(FileTypeService::class.java)

        const val MAX_SIGNATURE_LENGTH = 8

        val ZIP_FILE_SIGNATURES = arrayOf(
            byteArrayOf(0x50, 0x4B, 0x03, 0x04),
            byteArrayOf(0x50, 0x4B, 0x05, 0x06),
            byteArrayOf(0x50, 0x4B, 0x07, 0x08)
        )
        
        val RAR_FILE_SIGNATURES = arrayOf(
            byteArrayOf(0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00),
            byteArrayOf(0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00)
        )
    }
}