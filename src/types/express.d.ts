import { Role, User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: Role; // 👈 adapt this depending on your User model
    };
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: User & { roles?: string[] }; // adjust to your payload shape
  }
}
