import { plainToClass } from 'class-transformer';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { 
    PipeTransform, 
    Injectable, 
    BadRequestException 
} from '@nestjs/common';
import { 
    validate, 
    IsString, 
    IsNotEmpty, 
    ValidationError 
} from 'class-validator';

class DocNumValidation {
    @IsString()
    @IsNotEmpty({ message: 'The document number must not be empty' })
    documentNumber: string;
}

@Injectable()
export class ValidateDocNumPipe implements PipeTransform<string> {
    async transform(value: string): Promise<string> {
        const object = plainToClass(DocNumValidation, { documentNumber: value });

        const errors: ValidationError[] = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(
                'Validation failed: Document number must not be empty'
            );
        }

        if (!(cpf.isValid(value) || cnpj.isValid(value))) {
            throw new BadRequestException(
                'The document number must be a valid CPF with 11 digits or a '
                + 'valid CNPJ with 14 digits'
            );
        }

        return value;
    }
}
