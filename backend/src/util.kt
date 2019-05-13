import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import java.util.concurrent.TimeUnit


typealias FileId = Int

fun <K, V> cache(expireSeconds: Long, loader: (K?) -> V) =
    CacheBuilder.newBuilder()
        .expireAfterWrite(expireSeconds, TimeUnit.SECONDS)
        .build(CacheLoader.from(loader))


fun failIfNot(check: Boolean, errorType: FileTreeErrorDto.ErrorType, payload: Map<FileTreeErrorDto.PayloadKey, Any> = mapOf()) =
    failIf(!check, errorType, payload)

fun failIf(check: Boolean, errorType: FileTreeErrorDto.ErrorType, payload: Map<FileTreeErrorDto.PayloadKey, Any> = mapOf()) {
    if (check) throw FileTreeException(FileTreeErrorDto(errorType, payload))
}

class FileTreeException(val error: FileTreeErrorDto): Exception()