import com.fasterxml.jackson.databind.SerializationFeature
import file.service.FileService
import io.ktor.application.Application
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

    val fileService by inject<FileService>()
    val defaultRootPath = this.environment.config.property("ktor.application.defaultRootPath").getString();

    //todo not restful, as it's supposed that root request called by client before any children request.
    // may be fixed by pre-fetch and cache all the tree from root during initialization
    routing {
        get("/files/root") {
            val files = fileService.root(defaultRootPath)
            call.respond(HttpStatusCode.OK, files)
        }

        get("/files/{parentFileId}") {
            val parentFileId = call.parameters["parentFileId"]
            checkNotNull(parentFileId)
            checkNotNull(parentFileId.toIntOrNull()) { "invalid parentFileId format: $parentFileId" }

            val files = fileService.files(parentFileId.toInt())
            call.respond(HttpStatusCode.OK, files)
        }
    }
}