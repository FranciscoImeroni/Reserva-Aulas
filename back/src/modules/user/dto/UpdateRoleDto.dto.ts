import { IsArray, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  role: string;
}
