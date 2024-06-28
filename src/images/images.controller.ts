import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { AccessTokenInRequest } from 'src/users/types/user.types';
import { AccessTokenGuard } from 'src/users/common/guards/accessToken.guard';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async uploadImage(
    @Body() uploadImageDto: UploadImageDto,
    @Req() req: AccessTokenInRequest,
  ) {
    try {
      return await this.imagesService.uploadImage(uploadImageDto, req.user.id);
    } catch (err) {
      throw err;
    }
  }

  @Get('feed')
  async imageFeed() {
    try {
      return await this.imagesService.imageFeed();
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/:imageId')
  @UseGuards(AccessTokenGuard)
  async deleteImage(
    @Param('imageId') imageId: string,
    @Req() req: AccessTokenInRequest,
  ) {
    try {
      return await this.imagesService.deleteImage(imageId, req.user.id);
    } catch (err) {
      throw err;
    }
  }
}
