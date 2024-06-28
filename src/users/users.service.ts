import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PortfoliosRepository } from 'src/portfolios/repositories/portfolios.repository';
import { ImagesRepository } from 'src/images/repositories/image.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private portfoliosRepository: PortfoliosRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const isUserAlreadyExists = await this.usersRepository.findByEmail(
      signUpDto.email.toLowerCase(),
    );

    if (isUserAlreadyExists) {
      throw new ConflictException('User with this email already exists!');
    }

    const password = await this.hashData(signUpDto.password);

    const newUser = await this.usersRepository.createUser({
      ...signUpDto,
      password,
    });

    const tokens = await this.getTokens(newUser.id);

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  hashData(data: string) {
    return hash(data);
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersRepository.updateRefreshToken(userId, hashedRefreshToken);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(
      loginDto.email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    const passwordMatches = await verify(user.password, loginDto.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    const { id }: { id: string } = await this.jwtService.decode(refreshToken);

    const user = await this.usersRepository.findById(id);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async deleteUserAccount(userId: string) {
    const user =
      await this.usersRepository.findUserByIdAndPortfolioRelation(userId);

    if (!user) {
      throw new NotFoundException('User does not exists!');
    }

    for (const portfolio of user.portfolios) {
      await this.imagesRepository.deleteImageByPortfolio(portfolio.id);
    }

    await Promise.allSettled([
      this.portfoliosRepository.deletePortfolioByUser(user),
      this.usersRepository.deleteUserById(user.id),
    ]);

    return { message: `Account successfully deleted!` };
  }
}
