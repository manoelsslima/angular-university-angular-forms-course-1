import { Component, OnInit } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { createPasswordStrengthValidator } from "../validators/password-strength.validator";

@Component({
  selector: "login",
  templateUrl: "./login-reactive.component.html",
  styleUrls: ["./login-reactive.component.css"],
})
export class LoginReactiveComponent implements OnInit {
  form = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
      updateOn: "blur",
    }],
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        createPasswordStrengthValidator(),
      ],
    ],
  });

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {}

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  reset() {
    this.form.reset();
    console.log(this.form.value);
  }
}
