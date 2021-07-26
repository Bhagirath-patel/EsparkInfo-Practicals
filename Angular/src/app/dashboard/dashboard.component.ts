import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('user_login')) {
      this.router.navigate(['/login']);
    }
  }
  logout() {
    if (confirm("Are you sure you want to log out?")) {
      console.log('logout')
      localStorage.removeItem('user_login');
      this.router.navigate(['/login']);
    }
  }
}
