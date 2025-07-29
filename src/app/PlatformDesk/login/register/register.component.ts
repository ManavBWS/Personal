import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ToastModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  url: string = 'https://localhost:7206';
  registerForm: any = FormGroup;
  UserID: number = 0;
  ConfirmPassword: any;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  fieldTextType: boolean = false;
  formSubmitted: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      UserID: [0],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Email: ['', [Validators.pattern(this.emailPattern)]],
      CompanyName: ['', Validators.required],
      Address: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      Message: ['']
    }, {
      validator: this.mustMatch('Password', 'ConfirmPassword')
    }
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      var data = this.registerForm.value;
      this.registerForm.controls['MobileNumber'].setValue(parseInt(this.registerForm.controls['MobileNumber'].value, 10));
      delete data.ConfirmPassword;
      var observable = this.http.post(this.url + "/api/CredentialController/RegisterUser", data);
      observable.subscribe(
        (res: any) => {

          console.log("res", res);
          this.registerForm.reset();
          this.formSubmitted = false;
          if (res.status === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message
            });
            this.registerForm.reset();
          }
          else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            });
            this.registerForm.reset();
          }
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1500);
        }
      )

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data fields are invalid please check.' });
    }

  }
  oncancel() {
    this.router.navigate(['/login']);
  }

  mustMatch(controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return;
      }


      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
