import file.service.ArchiveService
import file.service.FileService
import file.service.FileTypeService
import file.service.archive.ArchiveProcessor
import file.service.archive.RarArchiveProcessor
import file.service.archive.ZipArchiveProcessor
import org.koin.dsl.module
import org.koin.experimental.builder.single
import org.koin.experimental.builder.singleBy

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