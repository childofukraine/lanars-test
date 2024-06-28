import { Module, forwardRef } from '@nestjs/common';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { Portfolio } from './entities/portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosRepository } from './repositories/portfolios.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, PortfoliosRepository],
  exports: [PortfoliosRepository],
})
export class PortfoliosModule {}
