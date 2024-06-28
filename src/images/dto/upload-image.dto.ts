import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';

export class UploadImageDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  portfolioId: string;

  @IsOptional()
  portfolio?: Portfolio;
}
