import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { MAX_EMAIL_CHARACTERS } from '../constants';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: `email max length is ${MAX_EMAIL_CHARACTERS} characters`,
  })
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
