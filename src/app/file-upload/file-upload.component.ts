import { Component, Input } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { Observable, noop, of } from "rxjs";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input()
  requiredFileType: string;

  fileName: string = "";

  fileUploadError = false;

  fileUploadSuccess = false;

  uploadProgress: number;

  onChange = (fileName: string) => {};

  onToched = () => {};

  onValidatorChange = () => {};

  isDisabled: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) { // evita erro ao clicar em cancelar

      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      this.fileUploadError = false;

      this.http
        .post("/api/thumbnail-upload", formData, {
          reportProgress: true,
          observe: 'events'
        })
        .pipe(
          catchError((error) => {
            this.fileUploadError = true;
            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
        )
        .subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          } else if (event.type == HttpEventType.Response) {
            this.fileUploadSuccess = true;
            this.onChange(this.fileName);
            this.onValidatorChange();
          }
        });
    }
  }

  onClick(fileUpload: HTMLInputElement) {
    this.onToched();
    fileUpload.click();
  }

  writeValue(value: any): void {
    this.fileName = value;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onToched: any): void {
    this.onToched = onToched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(control: AbstractControl<any, any>): ValidationErrors {
    if (this.fileUploadSuccess) { // caso de sucesso
      return null;
    }
    let erros: any = {
      requiredFileType: this.requiredFileType // tipo de arquivo requerido
    }
    if (this.fileUploadError) { // falha no upload
      erros.uploadFailed = true;
    }
    return erros;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
