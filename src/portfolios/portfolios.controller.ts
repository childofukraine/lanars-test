import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';
import { AccessTokenGuard } from 'src/users/common/guards/accessToken.guard';
import { AccessTokenInRequest } from 'src/users/types/user.types';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @Req() req: AccessTokenInRequest,
  ) {
    try {
      return await this.portfoliosService.createPortfolio(
        createPortfolioDto,
        req.user.id,
      );
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/:portfolioId')
  @UseGuards(AccessTokenGuard)
  async deletePortfolio(
    @Param('portfolioId') portfolioId: string,
    @Req() req: AccessTokenInRequest,
  ) {
    try {
      return await this.portfoliosService.deletePortfolio(
        portfolioId,
        req.user.id,
      );
    } catch (err) {
      throw err;
    }
  }
}
