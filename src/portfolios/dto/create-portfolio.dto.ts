import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  user?: User;
}
