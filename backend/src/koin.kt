import file.service.ArchiveService
import file.service.FileService
import file.service.FileTypeService
import org.koin.dsl.module
import org.koin.experimental.builder.single

val koinModule = module(createdAtStart = true) {
    single { (fileTypeService: FileTypeService, archiveService: ArchiveService, config: AppConfig) ->
        FileService(
            fileTypeService,
            archiveService,
            config
        )
    }
    single<ArchiveService>()
    single<FileTypeService>()
}