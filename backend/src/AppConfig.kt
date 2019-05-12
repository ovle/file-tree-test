/**
 * Application config from application.conf
 *
 * @property defaultRootPath        file system root path which will be accessible to the client
 * @property fileCacheExpireTime    file caches expiration time, in seconds
 */
data class AppConfig(val defaultRootPath: String, val fileCacheExpireTime: Long)