import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addplatform',
  imports: [NavbarComponent, Toast, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './addplatform.component.html',
  styleUrl: './addplatform.component.css',
  providers: [MessageService]
})
export class AddplatformComponent {
  PlatformForm!: FormGroup;
  PlatformID: number = 0;
  formSubmitted: boolean = false;
  submitted: boolean = false;
  url: string = 'https://localhost:7206';

  get headerText(): string {
    return this.PlatformID === 0 ? 'Add Platform' : 'Update Platform';
  }
  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.PlatformForm = this.formbuilder.group({
      ProfileName: ['', [Validators.required]],
      PlatformID: [0]
    });

    this.route.paramMap.subscribe(params => {
      const platformID = params.get('platformID');
      if (platformID) {
        this.PlatformID = +platformID;
        this.PlatformForm.patchValue({ PlatformID: this.PlatformID });
        this.FetchSinglePlatform(this.PlatformID);
      }
    });
  }

  OnSubmit() {
    debugger
    this.formSubmitted = true;
    if (this.PlatformForm.valid) {
      this.submitted = true;

      const userString = localStorage.getItem('LoginDetails');
      // console.log('LoginDetails : ', userString);
      if (!userString) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User information not found. Please login again.'
        });
        return;
      }

      const us = JSON.parse(userString);
      const user = us.userDetails;
      if (!user || !user.tenantId || !user.userId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Incomplete user information. Please login again.'
        });
        return;
      }

      const data = {
        PlatformID: this.PlatformForm.get('PlatformID')?.value,
        PlatformName: this.PlatformForm.get('ProfileName')?.value,
        TenantId: user.tenantId,
        ActionBy: user.userId
      };

      this.http.post(`${this.url}/api/PlatformController/SavePlatform`, data)
        .subscribe(
          (res: any) => {
            this.PlatformForm.reset();
            this.formSubmitted = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            });
            setTimeout(() => {
              this.router.navigateByUrl('/platform');
            }, 1000);
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

  FetchSinglePlatform(platformID: number) {
    this.http.get(`${this.url}/api/PlatformController/FetchSinglePlatform/${platformID}`)
      .subscribe(
        (res: any) => {
          if (res && res.platformName) {
            this.PlatformForm.patchValue({
              ProfileName: res.platformName
            });
          }
        },
        (error) => {
          console.error('Error fetching platform details:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching platform details. Please try again.'
          });
        }
      );
  }
}
