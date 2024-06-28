import { Module, forwardRef } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ImagesRepository } from './repositories/image.repository';
import { PortfoliosModule } from 'src/portfolios/portfolios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    forwardRef(() => UsersModule),
    PortfoliosModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesRepository],
})
export class ImagesModule {}
