import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  newPassword: string;
}
