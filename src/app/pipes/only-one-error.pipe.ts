import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'onlyOneError'
})
export class OnlyOneErrorPipe implements PipeTransform {
    transform(allErrors: any, errorsPriority: string[]) {

        // se nenhum erro for passado ao pipe
        if (!allErrors) {
            return null;
        }

        const onlyOneError: any = {};

        for (let error of errorsPriority) {
            // se o objeto allErrors contiver o erro da iteração
            if (allErrors[error]) {
                // vamos enviá-lo para saída
                // adicionamos o erro ao objeto onlyOneError
                onlyOneError[error] = allErrors[error];
                // analisamos apenas um erro por vez
                break;
            }
        }
        return onlyOneError;
    }

}