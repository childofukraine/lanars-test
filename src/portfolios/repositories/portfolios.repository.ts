import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { User } from 'src/users/entities/user.entity';

export class PortfoliosRepository {
  constructor(
    @InjectRepository(Portfolio)
    private portfoliosRepository: Repository<Portfolio>,
  ) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    const portfolio = this.portfoliosRepository.create({
      ...createPortfolioDto,
    });
    return this.portfoliosRepository.save(portfolio);
  }

  async findByIdAndUserRelation(id: string) {
    return await this.portfoliosRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async deletePortfolioById(id: string) {
    return await this.portfoliosRepository.delete({ id });
  }

  async deletePortfolioByUser(user: User) {
    return await this.portfoliosRepository.delete({ user: user });
  }
}
