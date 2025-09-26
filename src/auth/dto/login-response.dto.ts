import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  pic?: string | null;

  @ApiProperty()
  access_token: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
