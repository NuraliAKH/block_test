import { Role } from '@/src/lib/enums/roles.enum';
import { IsExist } from '@/src/utils/validators/IsExist';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';

export class ConnectRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Role))
  roleName: string;

  @IsNumber()
  @Validate(IsExist, ['user', 'id'])
  userId: number;
}
