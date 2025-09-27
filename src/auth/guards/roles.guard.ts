import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('Required roles:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    console.log('role', requiredRoles);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('user', user);

    if (!user || !user.role) {
      return false;
    }

    // Ensure it's comparing correctly
    return requiredRoles.includes(user.role);
  }
}
