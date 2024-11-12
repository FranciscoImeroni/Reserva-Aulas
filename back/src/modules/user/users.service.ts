import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) // Inyecta el repositorio de User
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user; // Return user if password matches
    }
    return null; // Return null if user not found or password does not match
  }

  async createUser(createUserDto: Partial<CreateUserDto> & { verificationToken?: string }): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } }) || undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } }) || undefined;
  }

  async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isVerified: true });
  }

  async verifyUser(token: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (user) {
      user.isVerified = true;
      user.verificationToken = null; // Elimina el token una vez verificado
      await this.userRepository.save(user);
      return user;
    }
    return undefined;
  }

  
}
