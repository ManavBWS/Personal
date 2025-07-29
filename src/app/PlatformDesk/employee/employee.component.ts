import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee',
  imports: [NavbarComponent, Toast, ConfirmDialog],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  providers: [MessageService, ConfirmationService]
})
export class EmployeeComponent {
  url: string = 'http://localhost:51535';
  EmployeeForm: any = FormGroup;
  UserID: number = -1;
  employeeData: any[] = [];
  EmployeeID: any;
  setMessage: any;
  employeescheduleData: any[] = [];
  selectedDate: Date;
  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { this.selectedDate = new Date(); }

  ngOnInit(): void {
    this.EmployeeForm = this.fb.group({
      EmployeeID: [0, [Validators.required]],
      EmployeeFirstName: ['', [Validators.required]],
      EmployeeLastName: ['', [Validators.required]],
      EmployeeEmailAddress: ['', [Validators.required]]
    })
    this.FetchEmployeeDetails(this.selectedDate, this.UserID);
  }


  FetchEmployeeDetails(SelectedDate: Date, UserID: number) {
    debugger

    let currentDay = SelectedDate.getDay();
    let currentDate = new Date(SelectedDate);


    let diff = (currentDay + 4) % 7;

    SelectedDate.setDate(currentDate.getDate() - diff);

    SelectedDate.setHours(0, 0, 0, 0);
    const formattedStartDate = SelectedDate.toISOString();

    var observable = this.http.get(`${this.url}/api/EmployeeController/FetchEmployeeDetails/${formattedStartDate}/${UserID}`);
    observable.subscribe(
      (res: any) => {

        console.log("Fetched employee details:", res);
        this.employeeData = res._employeedetails;
        this.employeescheduleData = res._empoloyeeschedule;
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  //FetchEmployeeDetails() {
  //  debugger
  //  var observable = this.http.get(`${this.url}/api/EmployeeController/FetchEmployeeDetails/${this.UserID}`);
  //  observable.subscribe(
  //    (res: any) => {
  //      debugger
  //      console.log("res", res);
  //      this.employeeData = res.employeeDetails;
  //    },
  //    (error) => {
  //      console.error('Error fetching platform details:', error);

  //    }

  //  );
  //}
  DeleteEmployee(employeeID: number) {

    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        var observable = this.http.get(`${this.url}/api/EmployeeController/DeleteEmployee/${employeeID}`);
        observable.subscribe(
          (res: any) => {


            console.log("res", res);
            /*this.platformdata = res.fetchPlatforms;*/
            this.messageService.add({
              severity: 'error',
              summary: 'Success',
              detail: res.message
            })
            setTimeout(() => {
              window.location.reload();
            }, 1200);

            /* window.location.reload();*/

          },
          (error) => {
            console.error('Error fetching platform details:', error);

          }

        );
      }
    });

  }

  editEmployeeform(employeeID: number) {
    this.router.navigate(['/addemployee', employeeID]);
  }
}
