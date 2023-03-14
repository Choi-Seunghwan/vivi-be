import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/types/auth';

export const Roles = (...roles: Role[]): any => SetMetadata('roles', roles);
