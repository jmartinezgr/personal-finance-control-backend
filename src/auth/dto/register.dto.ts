import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
  Matches,
} from 'class-validator';

// Custom validator
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidBirthDate', async: false })
export class IsValidBirthDate implements ValidatorConstraintInterface {
  validate(value: string) {
    // Validar formato DD-MM-YYYY
    const regex = /^([0-2]\d|3[0-1])-(0\d|1[0-2])-(19\d{2}|20\d{2}|3000)$/;
    if (!regex.test(value)) return false;

    const [day, month, year] = value.split('-').map(Number);

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ); // verifica fecha real
  }

  defaultMessage() {
    return 'La fecha de nacimiento debe ser válida y en formato DD-MM-YYYY';
  }
}

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'La contraseña debe tener mínimo 8 caracteres e incluir mayúscula, minúscula, número y símbolo',
  })
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsString({ message: 'La fecha de nacimiento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @Validate(IsValidBirthDate)
  birthDate: string;
}
