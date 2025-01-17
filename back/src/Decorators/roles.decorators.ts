import { SetMetadata } from "@nestjs/common";
import { Role } from "../modules/user/dto/roles.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)