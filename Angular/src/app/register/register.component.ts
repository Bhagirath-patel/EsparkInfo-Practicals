import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from './confirmed.validator';
import { APIService } from '../api_service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private services: APIService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirm_password: ['', [Validators.required, Validators.minLength(5)]]
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
  }

  get data() { return this.registerForm.controls; }

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    } else {

      let register_data = {
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      }
      this.services.doRegister(register_data).subscribe((data) => {
        this._snackBar.open('Register Successfully', '', {
          duration: 3000,
          panelClass: "success_snackbar"
        });
        this.router.navigate(['/login']);
      },
        (err) => {
          console.log(err);
          if (!err.error.status) {
            this._snackBar.open(err.error.error, '', {
              duration: 3000,
              panelClass: "danger_snackbar"
            });
          }
        })

    }
  }
}
