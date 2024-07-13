import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  fullname: string;

  /**
   * 1 = Super admin
   * 2 = Admin
   */
  @Column({ default: 2 })
  role: number;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, default: null })
  updatedAt?: Date;
}
