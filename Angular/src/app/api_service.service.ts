import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class APIService {


  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) {
  }

  doRegister(user_data) {
    return this.http.post(this.url + 'api/users/register', user_data)
  }


  doLogin(email, password) {
    return this.http.post(this.url + 'api/users/login', {
      email: email,
      password: password,
    })
  }
}
