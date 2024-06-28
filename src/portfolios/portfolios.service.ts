import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosRepository } from './repositories/portfolios.repository';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class PortfoliosService {
  constructor(
    private portfoliosRepository: PortfoliosRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
    userId: string,
  ) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    const newPortfolio = await this.portfoliosRepository.createPortfolio({
      ...createPortfolioDto,
      user,
    });

    return newPortfolio;
  }

  async deletePortfolio(portfolioId: string, userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    const portfolio =
      await this.portfoliosRepository.findByIdAndUserRelation(portfolioId);

    if (user.id !== portfolio.user.id) {
      throw new ForbiddenException('You can not delete this portfolio');
    }

    await this.portfoliosRepository.deletePortfolioById(portfolioId);

    return { message: `Portfolio ${portfolioId} successfully deleted!` };
  }
}
