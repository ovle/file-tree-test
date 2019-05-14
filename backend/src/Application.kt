import FileTreeErrorDto.ErrorType.Other
import FileTreeErrorDto.ErrorType.ArchiveError
import com.fasterxml.jackson.databind.SerializationFeature
import file.service.ArchiveService
import file.service.FileService
import file.service.FileTypeService
import io.ktor.application.Application
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.features.StatusPages
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.util.pipeline.PipelineContext
import net.lingala.zip4j.exception.ZipException
import org.koin.core.parameter.parametersOf
import org.koin.ktor.ext.Koin
import org.koin.ktor.ext.inject
import org.slf4j.LoggerFactory
import java.util.concurrent.ExecutionException

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CORS) {                                                                                                           
        anyHost()
    }

    install(StatusPages) {
        statusPagesConfig()
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    install(Koin) {
        modules(koinModule)
    }

    routing()
}


private fun Application.routing() {
    val config = this.environment.config
    //todo experimental api usage
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
            val parentIdIsCorrect = parentFileId!!.toIntOrNull() == null
            when {
                parentIdIsCorrect -> call.respond(
                    HttpStatusCode.BadRequest,
                    "invalid parentFileId format: $parentFileId"
                )
                else -> {
                    val files = fileService.children(parentFileId.toInt())
                    call.respond(HttpStatusCode.OK, files)
                }
            }
        }
    }
}

private fun StatusPages.Configuration.statusPagesConfig() {
    val logger = LoggerFactory.getLogger(this::class.java)

    suspend fun PipelineContext<Unit, ApplicationCall>.respondError(error: Any) {
        call.respond(HttpStatusCode.InternalServerError, mapOf("error" to error))
    }

    exception<FileTreeException> { cause ->
        respondError(cause.error)
    }
    exception<ExecutionException> { cause ->
        val error = when (cause.cause) {
            is FileTreeException -> (cause.cause as FileTreeException).error
            is ZipException -> FileTreeErrorDto(ArchiveError)
            else -> FileTreeErrorDto(Other)
        }
        respondError(error)
    }
    exception<ZipException> { _ ->
        respondError(FileTreeErrorDto(ArchiveError))
    }
    exception<Throwable> { cause ->
        logger.error("error: ", cause)
        respondError(FileTreeErrorDto(Other))
    }
}