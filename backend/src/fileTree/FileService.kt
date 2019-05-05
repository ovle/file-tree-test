import FileDto.Type.*
import org.slf4j.LoggerFactory
import java.io.*
import javax.imageio.ImageIO

typealias FileId = Int

class FileService {

    //todo concurrent/synchronized? eviction?
    private val filesById = mutableMapOf<FileId, File>()
    private val childrenByParentId = mutableMapOf<FileId, Collection<File>>()


    fun files(defaultParentPath: String, requestedParentFileId: FileId?): List<FileDto> {
        val parentFile = if (requestedParentFileId != null) cached(requestedParentFileId) else File(defaultParentPath)

        //todo error processing
        checkNotNull(parentFile)
        check(mayHaveChildren(parentFile)) { "file ${parentFile.name} cannot have children" }

        val parentFileId = requestedParentFileId ?: id(parentFile)
        cache(parentFile, parentFileId)

        val children = cachedChildren(parentFileId) ?: parentFile.listFiles().toList()
        cacheChildren(children, parentFileId)
        
        val filesData = children.map {
                val id = id(it)
                cache(it, id)

                FileDto(id, it.name, type(it))
            }
        return filesData
    }

    private fun mayHaveChildren(parentFile: File): Boolean {
        return type(parentFile) in setOf(Directory, Archive)  //todo only zip
    }

    private fun cache(file: File, fileId: FileId) { filesById[fileId] = file }
    private fun cacheChildren(children: Collection<File>, fileId: FileId) { childrenByParentId[fileId] = children }
    private fun cached(fileId: FileId?) = filesById[fileId]
    private fun cachedChildren(fileId: FileId?) = childrenByParentId[fileId]

    private fun id(file: File) = file.absolutePath.hashCode()

    private fun type(file: File): FileDto.Type {
        return when {
            file.isDirectory -> Directory
            isArchive(file) -> Archive
            isImage(file) -> Image
            else -> Other
        }
    }

    private fun isImage(file: File) = ImageIO.read(file) != null

    private fun isArchive(file: File) = when {
        file.isDirectory -> false
        testFileSignature(file, ZIP_FILE_SIGNATURES) -> true
        testFileSignature(file, RAR_FILE_SIGNATURES) -> true
        else -> false
    }

    private fun testFileSignature(file: File, signatures: Array<Signature>) =
        DataInputStream(BufferedInputStream(FileInputStream(file))).use {
            inputStream ->
            signatures.any {
                //todo implement
                false
            }
        }


    companion object {
        private val logger = LoggerFactory.getLogger(FileService::class.java)

        data class Signature(val value: Number, val bytesUsed: Int = 4)
        val ZIP_FILE_SIGNATURES = arrayOf(Signature(0x504B0304), Signature(0x504B0506), Signature(0x504B0708))
        val RAR_FILE_SIGNATURES = arrayOf(Signature(0x526172211A070100, bytesUsed = 8), Signature(0x526172211A0700, bytesUsed = 7))
    }
}