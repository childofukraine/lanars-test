import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  comment: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images)
  portfolio: Portfolio;

  @CreateDateColumn()
  createdAt: Date;
}
