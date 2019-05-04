import org.koin.dsl.module
import org.koin.experimental.builder.single

val koinModule = module(createdAtStart = true) {
    single<FileService>()
}