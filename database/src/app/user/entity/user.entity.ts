import { Client } from 'src/app/client/entity/client.entity';
import { Post } from 'src/app/post/entity/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ unique: true })
  name: string;

  @Column()
  age: number;

  @ManyToOne(() => Client, (client) => client.users)
  client: Client;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
