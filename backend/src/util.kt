import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import java.util.concurrent.TimeUnit

fun <K, V> cache(expireSeconds: Long, loader: (K?) -> V) =
    CacheBuilder.newBuilder()
        .expireAfterWrite(expireSeconds, TimeUnit.SECONDS)
        .build(CacheLoader.from(loader))