/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @ManyToOne((type) => User, (User) => User.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
