import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { AccessTokenInRequest } from './types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      return this.usersService.signUp(signUpDto);
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.usersService.login(loginDto);
    } catch (err) {
      throw err;
    }
  }

  @Post('refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.usersService.refreshTokens(refreshToken);
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/account')
  @UseGuards(AccessTokenGuard)
  async deleteUserAccount(@Req() req: AccessTokenInRequest) {
    try {
      return await this.usersService.deleteUserAccount(req.user.id);
    } catch (err) {
      throw err;
    }
  }
}
