import com.fasterxml.jackson.databind.SerializationFeature
import file.service.ArchiveService
import file.service.FileService
import file.service.FileTypeService
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.features.StatusPages
import io.ktor.http.HttpStatusCode
import io.ktor.http.parametersOf
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.routing
import org.koin.core.parameter.parametersOf
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CORS) {
        anyHost()
    }

    install(StatusPages) {
        exception<Throwable> { cause ->
            call.respond(mapOf("error" to ErrorDto(cause.localizedMessage)))
        }
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    install(Koin) {
        modules(koinModule)
    }

    //todo experimental api usage
    val config = this.environment.config
    val appConfig = AppConfig(
        defaultRootPath = config.property("ktor.application.defaultRootPath").getString(),
        fileCacheExpireTime = config.property("ktor.application.fileCacheExpireTime").getString().toLong()
    )
    val fileTypeService by inject<FileTypeService>()
    val archiveService by inject<ArchiveService>()
    val fileService by inject<FileService> { parametersOf(fileTypeService, archiveService, appConfig) }

    routing {
        get("/files/root") {
            val files = fileService.root()
            call.respond(HttpStatusCode.OK, files)
        }

        get("/files/{parentFileId}") {
            val parentFileId = call.parameters["parentFileId"]
            requireNotNull(parentFileId)
            requireNotNull(parentFileId.toIntOrNull()) { "invalid parentFileId format: $parentFileId" }

            val files = fileService.files(parentFileId.toInt())
            call.respond(HttpStatusCode.OK, files)
        }
    }
}