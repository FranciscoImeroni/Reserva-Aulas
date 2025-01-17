import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; 
import { UpdateRoleDto } from './dto/UpdateRoleDto.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { 
      return null; 
    }
  
    return user; 
  }
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
  
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    const user = this.userRepository.create({
      ...createUserDto, 
      role: 'Unverified',
      password: hashedPassword, 
    });
  
    return await this.userRepository.save(user);
  }
/* 
  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Actualizamos el rol del usuario
    user.role = updateRoleDto.role; // Suponiendo que roles es un array de strings
    await this.userRepository.save(user);

    return user;
  } */
  
    async updateRoleAndGenerateToken(userId: string, updateRoleDto: UpdateRoleDto): Promise<{ newToken: string, user: User }> {
      // Buscar el usuario
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
  
      // Actualizar el rol del usuario
      user.role = updateRoleDto.role;
      await this.userRepository.save(user);
  
      // Generar un nuevo token JWT con el rol actualizado
      const payload = { sub: user.id, roles: user.role };
      const newToken = this.jwtService.sign(payload);
  
      return { newToken, user };
    }

  async updatePasswords() {
    const users = await this.findAll();
    
    for (let user of users) {
      if (!user.password.startsWith('$2b$')) { 
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await this.update(user.id, { password: hashedPassword });
      }}}


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

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  
  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } }) || undefined;
  }


/*   async findByVerificationToken(token: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (!user) {
      throw new NotFoundException('Token de verificación inválido o expirado');
    }
    return user;
  } */
  
    async findByVerificationToken(verificationToken: string): Promise<User> {
      const user = await this.userRepository.findOne({ where: { verificationToken } });
      
      if (!user) {
        throw new NotFoundException('User with verification token not found');
      }
      
      return user;
    }
    
    
    async save(user: User): Promise<User> {
      return this.userRepository.save(user);
    }
    
  
  async updateUserRole(userId: string, newRole: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    user.role = newRole;
    user.verificationToken = null;
    await this.userRepository.save(user);
  }
  

/*   async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isVerified: true });
  }

  async verifyUser(token: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (user) {
      user.isVerified = true;
      user.verificationToken = null; 
      await this.userRepository.save(user);
      return user;
    }
    return undefined;
  } */

  
}
