import { Component, Input } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from "@angular/forms";
import { Observable, noop, of } from "rxjs";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input()
  requiredFileType: string;

  fileName: string = "";

  fileUploadError = false;

  uploadProgress: number;

  onChange = (fileName: string) => {};

  onToched = () => {};

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
            this.onChange(this.fileName);
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
}
