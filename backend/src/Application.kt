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
    val defaultRootPath = this.environment.config.property("ktor.application.defaultRootPath").getString();

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

    routing {
        get("/files/{rootFileId?}") {
            val rootFileId = call.parameters["rootFileId"]
            val files = fileService.files(defaultRootPath, rootFileId?.toInt())
            call.respond(HttpStatusCode.OK, files)
        }
    }
}