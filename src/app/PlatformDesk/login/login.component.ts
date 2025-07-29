import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ToastModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  url: string = 'https://localhost:7206';
  loginForm:any= FormGroup;
  errorMsg: string = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    debugger
    if (this.loginForm.valid) {
      const username = this.loginForm.value.Username;
      const password = this.loginForm.value.Password;
      this.http.post(this.url + "/api/CredentialController/Login", { username, password })
        .subscribe(
          (res: any) => {
            if (res && res.token && res.userDetails.status == 1) {
              localStorage.setItem('LoginDetails', JSON.stringify(res));
              localStorage.setItem('UserID', res.userDetails.userId);
              this.router.navigate(['/platform']);
            } else {
              this.loginForm.reset();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid username or password.' });
            }
          },
          error => {
            console.error(error);
            this.errorMsg = 'Login failed! Please try again later.';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid username or password.' });
          }
        );
    } else {
      this.errorMsg = 'Please fill in all required fields.';
    }
  }
}
