import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-bidder-profile',
  imports: [NavbarComponent, Toast, ConfirmDialog],
  templateUrl: './bidder-profile.component.html',
  styleUrl: './bidder-profile.component.css',
  providers: [MessageService, ConfirmationService]
})
export class BidderProfileComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'http://localhost:51535';
  BidderProfileForm: any = FormGroup;
  profileformdata: any[] = [];
  ProfileID: any;


  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.BidderProfileForm = this.fb.group({
      ProfileName: ['', [Validators.required]]
      /* 'UserID': ['', [Validators.required]]*/
    });
    this.FetchBidderProfileDetails();
  }




  FetchBidderProfileDetails() {
    var observable = this.http.get(`${this.url}/api/BidderProfileController/FetchBidderProfileDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {


        console.log("res", res);
        this.profileformdata = res.profileData;


      },
      (error) => {
        console.error('Error fetching profile details:', error);
        alert('Error fetching profile details. Please try again.');
      }
    );
  }

  DeleteBidderProfile(profileID: number) {

    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        var observable = this.http.get(`${this.url}/api/BidderProfileController/DeleteProfile/${profileID}`);
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


  onAddNewBidderProfile() {
    this.router.navigate(['/addbidderprofile']);
  }

  editBidderProfile(profileID: number) {

    this.router.navigate(['/addbidderprofile', profileID]);
  }
}
