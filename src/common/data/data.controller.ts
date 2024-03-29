import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DataService } from './data.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ResUploadImageToS3 } from './dto/res-upload-image-to-s3.dto';

@Controller('')
@ApiTags('common | data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload Image To S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: ResUploadImageToS3 })
  async uploadImageToS3(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResUploadImageToS3> {
    const result = await this.dataService.uploadImageToS3(file);
    return plainToInstance(ResUploadImageToS3, result);
  }
}
