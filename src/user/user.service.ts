import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(query: { page: number; limit: number }) {
    const page = query.page || 1;
    const limit = query.limit || 3;
    return await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async create(user: User) {
    return await this.userRepository.save(user);
  }

  async update(user: User, id: number) {
    return await this.userRepository.update({ id }, user);
  }
}
