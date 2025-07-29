import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adddepartment',
  imports: [NavbarComponent, Toast, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './adddepartment.component.html',
  styleUrl: './adddepartment.component.css',
  providers:[MessageService]
})
export class AdddepartmentComponent {
  DepartmentForm: any = FormGroup;
  url: string = 'https://localhost:7206'; // Base URL of your API
  submitted: boolean = false;
  DepartmentID: number = 0;
  formSubmitted: boolean = false;
  get headerText(): string {
    return this.DepartmentID === 0 ? 'Add Department' : 'Update Department';
  }
  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.DepartmentForm = this.formbuilder.group({
      DepartmentName: ['', [Validators.required]],
      DepartmentID: [0],
      TenantId: [0]
    });

    this.route.params.subscribe(params => {
      const departmentID = params['departmentID'];
      this.DepartmentID = departmentID ? parseInt(departmentID) : 0; 
      this.DepartmentForm.patchValue({ DepartmentID: this.DepartmentID }); 
      if (this.DepartmentID !== 0) {
        this.FetchSingleDepartment(this.DepartmentID); 
      }
    });
  }

  OnSubmit() {
    this.formSubmitted = true;
    if (this.DepartmentForm.valid) {
      this.submitted = true;
      const data = {
        DepartmentName: this.DepartmentForm.get('DepartmentName').value,
        DepartmentID: this.DepartmentForm.get('DepartmentID').value,
        TenantId: this.DepartmentForm.get('TenantId').value
      };

      const observable = this.http.post(`${this.url}/api/DepartmentController/SaveUpdateDepartment`, data);
      observable.subscribe(
        (res: any) => {
          this.DepartmentForm.reset();
          this.formSubmitted = false;
          
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            })
            setTimeout(() => {
            this.router.navigateByUrl('/department');
          }, 1500);
        },
        (error) => {
          console.error('Error saving data:', error);
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error saving data. Please try again.'
            });
        }
      );
    }
  }

  FetchSingleDepartment(departmentID: number) {
    const observable = this.http.get(`${this.url}/api/DepartmentController/FetchSingleDepartment/${departmentID}`);
    observable.subscribe(
      (res: any) => {
        const departmentName = res.departmentName;
        this.DepartmentForm.patchValue({
          DepartmentName: departmentName
        });
      },
      (error) => {
        console.error('Error fetching Department details:', error);
        alert('Error fetching Department details. Please try again.');
      }
    );
  }
}
