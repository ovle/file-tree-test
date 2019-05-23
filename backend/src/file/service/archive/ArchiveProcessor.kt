package file.service.archive

import java.io.BufferedInputStream
import java.io.DataInputStream
import java.io.File
import java.io.FileInputStream


abstract class ArchiveProcessor {

    fun supports(file: File) = testSignatures(file, signatures())

    abstract fun signatures(): Array<ByteArray>

    abstract fun unpack(file: File, targetDir: File)

    private fun testSignatures(file: File, signatures: Array<ByteArray>) =
        DataInputStream(BufferedInputStream(FileInputStream(file))).use { inputStream ->
            val fileFirstBytes = ByteArray(MAX_SIGNATURE_LENGTH)
            val bytesRead = inputStream.read(fileFirstBytes)
            signatures.any { signatureBytes ->
                if (bytesRead < signatureBytes.size) return false
                val fileFirstBytesCropped = fileFirstBytes.take(signatureBytes.size).toByteArray()
                signatureBytes.contentEquals(fileFirstBytesCropped)
            }
        }

    companion object {
        const val MAX_SIGNATURE_LENGTH = 8
    }
}