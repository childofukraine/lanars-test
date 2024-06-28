import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignUpDto } from '../dto/sign-up.dto';

export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(signUpDto: SignUpDto) {
    const user = this.usersRepository.create({ ...signUpDto });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.usersRepository.update(userId, { refreshToken });
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findUserByIdAndPortfolioRelation(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['portfolios'],
    });
  }

  async deleteUserById(id: string) {
    return await this.usersRepository.delete({ id });
  }
}
