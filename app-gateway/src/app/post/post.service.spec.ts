import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { of, throwError } from 'rxjs';
import { PostDto } from './dto/post.dto';

describe('PostService', () => {
  let service: PostService;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: 'POSTS_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of posts', async () => {
      const result = [{ id: 1, title: 'Test Post' }];
      mockClientProxy.send.mockReturnValue(of(result));

      expect(await service.getAll({ id: 1, login: 'test' }, 1)).toBe(result);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get_posts' },
        { client: { id: 1, login: 'test' }, userId: 1 },
      );
    });

    it('should handle errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Error fetching posts')),
      );

      await expect(service.getAll({ id: 1, login: 'test' }, 1)).rejects.toThrow(
        'Error fetching posts',
      );
    });
  });

  describe('getOne', () => {
    it('should return a single post', async () => {
      const result = { id: 1, title: 'Test Post' };
      mockClientProxy.send.mockReturnValue(of(result));

      expect(await service.getOne({ id: 1, login: 'test' }, 1, 1)).toBe(result);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get_post' },
        { id: 1, client: { id: 1, login: 'test' }, userId: 1 },
      );
    });

    it('should handle errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Error fetching post')),
      );

      await expect(
        service.getOne({ id: 1, login: 'test' }, 1, 1),
      ).rejects.toThrow('Error fetching post');
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const result = { id: 1, title: 'Updated Post' };
      const postDto: PostDto = {
        name: 'Updated Post',
        description: 'Updated Content',
      };
      mockClientProxy.send.mockReturnValue(of(result));

      expect(
        await service.update({ id: 1, login: 'test' }, 1, postDto, 1),
      ).toBe(result);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update_post' },
        { id: 1, client: { id: 1, login: 'test' }, data: postDto, userId: 1 },
      );
    });

    it('should handle errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Error updating post')),
      );

      await expect(
        service.update(
          { id: 1, login: 'test' },
          1,
          { name: 'Updated Post', description: 'Updated Content' },
          1,
        ),
      ).rejects.toThrow('Error updating post');
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const result = { id: 1, title: 'Deleted Post' };
      mockClientProxy.send.mockReturnValue(of(result));

      expect(await service.delete({ id: 1, login: 'test' }, 1, 1)).toBe(result);
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'delete_post' },
        { id: 1, client: { id: 1, login: 'test' }, userId: 1 },
      );
    });

    it('should handle errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Error deleting post')),
      );

      await expect(
        service.delete({ id: 1, login: 'test' }, 1, 1),
      ).rejects.toThrow('Error deleting post');
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      const result = { id: 1, title: 'New Post' };
      const postDto: PostDto = { name: 'New Post', description: 'New Content' };
      mockClientProxy.send.mockReturnValue(of(result));

      expect(await service.create({ id: 1, login: 'test' }, postDto)).toBe(
        result,
      );
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'create_post' },
        { client: { id: 1, login: 'test' }, data: postDto },
      );
    });

    it('should handle errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Error creating post')),
      );

      await expect(
        service.create(
          { id: 1, login: 'test' },
          { name: 'New Post', description: 'New Content' },
        ),
      ).rejects.toThrow('Error creating post');
    });
  });
});
