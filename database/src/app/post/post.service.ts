import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async find(data: { client: { id: number; login: string }; userId: number }) {
    return await this.postRepository.find({
      where: { user: { id: data.userId, client: { id: data.client.id } } },
    });
  }

  async findOneBy(data: {
    id: number;
    client: { id: number; login: string };
    userId: number;
  }) {
    return await this.postRepository.findOneBy({
      id: data.id,
      user: { id: data.userId, client: { id: data.client.id } },
    });
  }

  async update(data: {
    post: Post;
    data: { name: string; description: string };
  }) {
    data.post.description = data.data.description;
    data.post.name = data.data.name;

    await this.postRepository.save(data.post);

    return { message: true };
  }

  async create(data: {
    client: { id: number; login: string };
    data: { name: string; description: string; userId: number };
  }) {
    const newPost = this.postRepository.create({
      name: data.data.name,
      description: data.data.description,
      user: { id: data.data.userId, client: { id: data.client.id } },
    });

    await this.postRepository.save(newPost, { reload: true });

    return newPost;
  }

  async delete(post: Post) {
    await this.postRepository.remove(post);

    return { message: true };
  }
}
