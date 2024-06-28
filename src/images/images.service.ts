import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { ImagesRepository } from './repositories/image.repository';
import { PortfoliosRepository } from 'src/portfolios/repositories/portfolios.repository';

@Injectable()
export class ImagesService {
  constructor(
    private usersRepository: UsersRepository,
    private imagesRepository: ImagesRepository,
    private portfoliosRepository: PortfoliosRepository,
  ) {}

  async uploadImage(uploadImageDto: UploadImageDto, userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    const portfolio = await this.portfoliosRepository.findByIdAndUserRelation(
      uploadImageDto.portfolioId,
    );

    if (!portfolio) {
      throw new NotFoundException('Portfolio does not exists');
    }

    if (portfolio.user.id !== userId) {
      throw new ForbiddenException(
        'You can not upload image to this portfolio',
      );
    }

    const newImage = await this.imagesRepository.createImage({
      ...uploadImageDto,
      portfolio,
    });

    return newImage;
  }

  async imageFeed() {
    const images = await this.imagesRepository.findImagesWithPortfolioName();

    return images.map((image) => ({
      id: image.id,
      name: image.name,
      description: image.description,
      portfolioName: image.portfolio.name,
      createdAt: image.createdAt,
    }));
  }

  async deleteImage(imageId: string, userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    const image =
      await this.imagesRepository.findImageByIdAndPortfolioRelation(imageId);

    if (!image) {
      throw new NotFoundException('Image does not exists!');
    }

    const portfolio = await this.portfoliosRepository.findByIdAndUserRelation(
      image.portfolio.id,
    );

    if (user.id !== portfolio.user.id) {
      throw new ForbiddenException('You can not delete this image');
    }

    await this.imagesRepository.deleteImageById(imageId);

    return { message: `Image ${imageId} successfully deleted!` };
  }
}
