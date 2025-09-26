// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';

// export const GetUser = createParamDecorator(
//   (data: string | undefined, ctx: ExecutionContext) => {
//     const request: Request = ctx.switchToHttp().getRequest();
//     console.log('decorator', request.cookies);
//     const user = request.user;

//     if (!user) {
//       throw new Error('User not found in request');
//     }

//     return data ? user[data] : user;
//   },
// );
