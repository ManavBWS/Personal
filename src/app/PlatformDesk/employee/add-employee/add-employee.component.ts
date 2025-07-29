import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  imports: [NavbarComponent, Toast, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers: [MessageService]
})
export class AddEmployeeComponent {
  EmployeeForm: any = FormGroup;
  url: string = 'http://localhost:51535';
  submitted: boolean = false;
  EmployeeID: number = 0;
  formSubmitted: boolean = false;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  get headerText(): string {
    return this.EmployeeID === 0 ? 'Add Employee' : 'Update Employee';
  }
  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.EmployeeForm = this.formbuilder.group({
      EmployeeFirstName: ['', [Validators.required]],
      EmployeeLastName: ['', [Validators.required]],
      EmployeeEmailAddress: ['', [Validators.pattern(this.emailPattern)]],
      EmployeeID: [0, [Validators.required]],
      EmployeeMobileNumber: [0, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]

    });

    this.route.params.subscribe(params => {

      const employeeID = params['employeeID'];
      this.EmployeeID = employeeID ? parseInt(employeeID) : 0;
      this.EmployeeForm.patchValue({ EmployeeID: this.EmployeeID });
      if (this.EmployeeID !== 0) {
        this.FetchSingleEmployee(this.EmployeeID);
      }
    });
  }

  OnSubmit() {

    this.formSubmitted = true;
    if (this.EmployeeForm.valid) {
      this.submitted = true;
      const data = {
        EmployeeID: this.EmployeeForm.get('EmployeeID').value,
        EmployeeFirstName: this.EmployeeForm.get('EmployeeFirstName').value,
        EmployeeLastName: this.EmployeeForm.get('EmployeeLastName').value,
        EmployeeEmailAddress: this.EmployeeForm.get('EmployeeEmailAddress').value,
        EmployeeMobileNumber: this.EmployeeForm.get('EmployeeMobileNumber').value
      };

      const observable = this.http.post(`${this.url}/api/EmployeeController/SaveUpdateEmployee`, data);
      observable.subscribe(
        (res: any) => {
          this.EmployeeForm.reset();
          this.formSubmitted = false;
          if (res.Status == 1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            })
          }
          else if (res.Status == 2) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            })
          }
          else {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: res.message
            })
          }

          setTimeout(() => {

            this.router.navigateByUrl('/employee');
          }, 1200);;
        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    }
  }

  FetchSingleEmployee(employeeID: number) {

    const observable = this.http.get(`${this.url}/api/EmployeeController/FetchSingleEmployee/${employeeID}`);
    observable.subscribe(
      (res: any) => {
        const employeeFirstName = res.employeeFirstName;
        const employeeLastName = res.employeeLastName;
        const employeeEmailAddress = res.employeeEmailAddress;
        const employeeMobileNumber = res.employeeMobileNumber;

        this.EmployeeForm.patchValue({
          EmployeeFirstName: employeeFirstName,
          EmployeeLastName: employeeLastName,
          EmployeeEmailAddress: employeeEmailAddress,
          EmployeeMobileNumber: employeeMobileNumber
        });
      },
      (error) => {
        console.error('Error fetching Department details:', error);
        alert('Error fetching Department details. Please try again.');
      }
    );
  }
}
