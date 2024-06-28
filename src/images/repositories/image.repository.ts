import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { UploadImageDto } from '../dto/upload-image.dto';

export class ImagesRepository {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async createImage(uploadImageDto: UploadImageDto) {
    const image = this.imagesRepository.create({
      ...uploadImageDto,
    });

    return this.imagesRepository.save(image);
  }

  async findImagesWithPortfolioName() {
    return await this.imagesRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.portfolio', 'portfolio')
      .select([
        'image.id',
        'image.name',
        'image.description',
        'portfolio.name',
        'image.createdAt',
      ])
      .orderBy('image.createdAt', 'DESC')
      .getMany();
  }

  async findImageByIdAndPortfolioRelation(id: string) {
    return await this.imagesRepository.findOne({
      where: { id },
      relations: ['portfolio'],
    });
  }

  async deleteImageById(id: string) {
    return await this.imagesRepository.delete({ id });
  }

  async deleteImageByPortfolio(portfolioId: string) {
    return await this.imagesRepository.delete({
      portfolio: { id: portfolioId },
    });
  }
}
