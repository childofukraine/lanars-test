import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { PortfoliosModule } from 'src/portfolios/portfolios.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PortfoliosModule),
    forwardRef(() => ImagesModule),
  ],
  providers: [UsersService, UsersRepository, JwtService, AccessTokenStrategy],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule {}
