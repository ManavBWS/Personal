import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-platform-profile',
  imports: [NavbarComponent, Toast, ConfirmDialog, CommonModule],
  templateUrl: './platform-profile.component.html',
  styleUrl: './platform-profile.component.css',
  providers: [MessageService, ConfirmationService]
})
export class PlatformProfileComponent {
  setMessage: any;
  UserID: any;
  url: string = 'https://localhost:7206';
  PlatformProfileForm: any = FormGroup;
  profileformdata: any[] = [];
  ProfileID: any;


  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.PlatformProfileForm = this.fb.group({
      ProfileName: ['', [Validators.required]]
      /* 'UserID': ['', [Validators.required]]*/
    });
    this.FetchPlatformProfileDetails();
  }

  FetchPlatformProfileDetails() {
    var observable = this.http.get(`${this.url}/api/PlatformProfileController/FetchPlatformProfileDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {
        debugger


        console.log("res", res);
        this.profileformdata = res.profileData;


      },
      (error) => {
        console.error('Error fetching profile details:', error);
        alert('Error fetching profile details. Please try again.');
      }
    );
  }

  DeletePlatformProfile(profileID: number) {

    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        var observable = this.http.get(`${this.url}/api/PlatformProfileController/DeleteProfile/${profileID}`);
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
            console.error('Error fetching profile details:', error);
            alert('Error fetching profile details. Please try again.');
          }
        );
      }
    });
  }


  onAddNewPlatformProfile() {
    this.router.navigate(['/addplatformprofile']);
  }

  editPlatformProfile(profileID: number) {

    this.router.navigate(['/addplatformprofile', profileID]);
  }
}
