import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loggedInUser: string | null = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const loginDetails = JSON.parse(localStorage.getItem('LoginDetails') || '{}');
    this.loggedInUser = loginDetails && loginDetails.userDetails ? loginDetails.userDetails.userName : 'Guest';
  }

  navItems = [
  { label: 'Department', link: '/department' },
  { label: 'PlatformProfile', link: '/platformprofile' },
  { label: 'Project', link: '/projectdetail' },
  { label: 'Employee', link: '/employee' },
  { label: 'EmployeeSchedule', link: '/employeeschedule' },
  { label: 'ImportExcel', link: '/importexcel' },
  { label: 'Bidder', link: '/bidder' },
  { label: 'Client', link: '/client' },
  { label: 'TransactionLog', link: '/transaction-log' },
  { label: 'BonusIncentive', link: '/bonusincentive' },
  { label: 'DRS', link: '/drs' },
];


  logout() {
    localStorage.removeItem('LoginDetails');
    localStorage.removeItem('UserID');
    this.router.navigate(['/login']);
  }
}
