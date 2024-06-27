import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// função factory que retorna o validador
export function createPasswordStrengthValidator(): ValidatorFn {

    // função de validação propriamente dita
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // se não há valor, não há erro
        if (!value) { 
            return null;
        }

        // se há letras maiúsculas
        const hasUpperCase = /[A-Z]+/.test(value);

        // se há letras minúsculas
        const hasLowerCase = /[a-z]+/.test(value);

        // se há números
        const hasNumeric = /[0-9]+/.test(value);

        // só é válido se todos forem válidos
        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        // se o password não for válido, retorna um objeto de erro com valor true
        return !passwordValid ? {passwordStrength: true} : null;
    }
}