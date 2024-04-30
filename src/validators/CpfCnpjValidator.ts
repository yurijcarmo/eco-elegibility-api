import { 
  cpf, 
  cnpj 
} from 'cpf-cnpj-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'cpfCnpj', async: false })
export class CpfCnpjValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    return cpf.isValid(value) || cnpj.isValid(value)
  }

  defaultMessage() {
    return 'The document number must be a valid CPF with 11 digits '
    + 'or a valid CNPJ with 14 digits';
  }
}
