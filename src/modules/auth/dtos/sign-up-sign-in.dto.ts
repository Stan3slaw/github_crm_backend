import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { MAX_EMAIL_CHARACTERS } from '../../user/constants';

export class SignUpSignInDto {
  @IsEmail()
  @MaxLength(MAX_EMAIL_CHARACTERS, {
    message: `email max length is ${MAX_EMAIL_CHARACTERS} characters`,
  })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
