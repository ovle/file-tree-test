package file.service.archive

import FileTreeErrorDto.ErrorType.ArchiveTypeNotSupported
import fail
import java.io.File


class RarArchiveProcessor: ArchiveProcessor() {

    override fun signatures(): Array<ByteArray> = FILE_SIGNATURES

    override fun unpack(file: File, targetDir: File) {
        fail(ArchiveTypeNotSupported)
    }

    companion object {
        val FILE_SIGNATURES = arrayOf(
            byteArrayOf(0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00),
            byteArrayOf(0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00)
        )
    }
}