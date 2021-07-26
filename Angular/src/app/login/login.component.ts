import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../api_service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  isLoading: Subject<boolean> = this.loader.isLoading;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private services: APIService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    if (localStorage.getItem("user_login")) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', Validators.required]
    });
  }

  get data() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.services.doLogin(this.data.email.value, this.data.password.value).subscribe((data: any) => {
        console.log(data);
        this._snackBar.open("Login Successfully.", '', {
          duration: 3000,
          panelClass: "danger_snackbar"
        });
        localStorage.setItem('user_login', data.token)
        this.router.navigate(['/dashboard']);
      },
        (err) => {
          if (!err.error.status) {
            this._snackBar.open(err.error.error, '', {
              duration: 3000,
              panelClass: "danger_snackbar"
            });
          }
          else {
            this.submitted = true;
          }
        })
    }
  }
}
