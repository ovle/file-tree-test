package file.service.archive

import net.lingala.zip4j.core.NativeStorage
import net.lingala.zip4j.core.ZipFile
import java.io.File

class ZipArchiveProcessor: ArchiveProcessor() {

    override fun signatures(): Array<ByteArray> = FILE_SIGNATURES

    override fun unpack(file: File, targetDir: File) {
        val zip = ZipFile(NativeStorage(file))
        zip.extractAll(targetDir.absolutePath)
    }

    companion object {
        val FILE_SIGNATURES = arrayOf(
            byteArrayOf(0x50, 0x4B, 0x03, 0x04),
            byteArrayOf(0x50, 0x4B, 0x05, 0x06),
            byteArrayOf(0x50, 0x4B, 0x07, 0x08)
        )
    }
}