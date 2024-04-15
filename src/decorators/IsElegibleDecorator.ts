import {
    SetMetadata,
    applyDecorators
} from '@nestjs/common';
import {
    IsEnum,
    ValidationOptions
} from 'class-validator';

export const IsElegible = (
    enumType: object, validationOptions?: ValidationOptions
) => applyDecorators(
    SetMetadata('eligibilityField', true),
    IsEnum(enumType, validationOptions)
);
