import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
    console.log('JwtStrategy initialized ✅'); 
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    console.log('JWT payload:', payload);
    // 👇 whatever you return here becomes `request.user`
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
