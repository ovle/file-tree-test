import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import java.io.File
import java.util.concurrent.TimeUnit


typealias FileId = Int

fun File.id(): FileId = this.hashCode()

fun File.search(childId: FileId ): File? =
    walkTopDown().find { it.id() == childId }

fun <K, V> cache(expireSeconds: Long, loader: (K?) -> V) =
    CacheBuilder.newBuilder()
        .expireAfterWrite(expireSeconds, TimeUnit.SECONDS)
        .build(CacheLoader.from(loader))


fun failIfNotValid(file: File?): File {
    failIf(file == null, FileTreeErrorDto.ErrorType.FileNotFound)
    failIfNot(file!!.canRead(), FileTreeErrorDto.ErrorType.FileNotReadable)
    return file
}

fun failIfNot(check: Boolean, errorType: FileTreeErrorDto.ErrorType) =
    failIf(!check, errorType)

fun failIf(check: Boolean, errorType: FileTreeErrorDto.ErrorType) {
    if (check) fail(errorType)
}

fun fail(errorType: FileTreeErrorDto.ErrorType) {
    throw FileTreeException(FileTreeErrorDto(errorType))
}

class FileTreeException(val error: FileTreeErrorDto): Exception()