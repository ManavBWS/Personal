import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-department',
  imports: [NavbarComponent, Toast, ConfirmDialog, CommonModule, ButtonModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
  providers: [MessageService, ConfirmationService]
})
export class DepartmentComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'https://localhost:7206';
  DepartmentForm: any = FormGroup;
  departmentdata: any[] = [];
  DepartmentID: any;


  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.DepartmentForm = this.fb.group({
      DepartmentName: ['', [Validators.required]]
    });
    this.FetchDepartmentDetails();
  }


  FetchDepartmentDetails() {
    var observable = this.http.get(`${this.url}/api/DepartmentController/FetchAllDepartment`);
    observable.subscribe(
      (res: any) => {
        console.log("res", res);
        this.departmentdata = res.departments;
      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }

  DeleteDepartment(departmentID: number) {
    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        var observable = this.http.delete(`${this.url}/api/DepartmentController/DeleteDepartment/${departmentID}`);
        observable.subscribe(
          (res: any) => {
            console.log("res", res);
            this.messageService.add({
              severity: 'error',
              summary: 'Success',
              detail: res.message
            })
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          },
          (error) => {
            console.error('Error fetching Department details:', error);
            alert('Error fetching Department details. Please try again.');
          }
        );
      }
    });
  }

  onAddNewDepartment() {
    this.router.navigate(['/adddepartment']);
  }

  editDepartmentform(departmentID: number) {
    this.router.navigate(['/adddepartment', departmentID]);
  }
}
