import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addprofile',
  imports: [NavbarComponent, Toast, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './addprofile.component.html',
  styleUrl: './addprofile.component.css',
  providers: [MessageService]
})
export class AddprofileComponent {
  BidderProfileForm: any = FormGroup;
  url: string = 'http://localhost:51535';
  submitted: boolean = false;
  ProfileID: number = 0;
  platformList: any[] = [];
  UserID: any = -1;
  formSubmitted: boolean = false;
  /*  profiledatanew: any[] = [];*/
  get headerText(): string {
    return this.ProfileID === 0 ? 'Add Profile' : 'Update Profile';
  }

  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.BidderProfileForm = this.formbuilder.group({
      ProfileName: ['', [Validators.required]],
      PlatformID: ['', [Validators.required]],
      ProfileID: [0, [Validators.required]],
      IsGSTCharged: ['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      const profileID = params['profileID'];
      this.ProfileID = profileID ? parseInt(profileID) : 0;
      this.BidderProfileForm.patchValue({ ProfileID: this.ProfileID });
      if (this.ProfileID !== 0) {
        this.FetchSingleBidderProfile(this.ProfileID);
      }
    });
    this.FetchPlatformList();
  }

  FetchPlatformList() {

    const observable = this.http.get(`${this.url}/api/PlatformController/FetchAllPlatform/${this.UserID}`);
    observable.subscribe(
      (res: any) => {

        this.platformList = res.fetchPlatforms; // Assuming platformList is part of the response
      },
      (error) => {
        console.error('Error fetching platform names:', error);
        alert('Error fetching platform names. Please try again.');
      }
    );
  }

  OnSubmit() {
    this.formSubmitted = true;
    if (this.BidderProfileForm.valid) {
      this.submitted = true;
      const data = {

        ProfileName: this.BidderProfileForm.get('ProfileName').value,
        ProfileID: this.BidderProfileForm.get('ProfileID').value,
        PlatformID: parseInt(this.BidderProfileForm.get('PlatformID').value),
        IsGSTCharged: this.BidderProfileForm.get('IsGSTCharged').value

      };

      const observable = this.http.post(`${this.url}/api/BidderProfileController/AddBidderProfile`, data);
      observable.subscribe(
        (res: any) => {
          this.BidderProfileForm.reset();
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

            this.router.navigateByUrl('/bidderprofile');
          }, 1500);

        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    }
  }

  FetchSingleBidderProfile(profileID: number) {
    const observable = this.http.get(`${this.url}/api/BidderProfileController/FetchSingleBidderProfile/${profileID}`);
    observable.subscribe(
      (res: any) => {
        debugger
        const profileName = res.profileName;
        const platformID = res.platformID;
        const isGSTcharged = res.isGSTCharged;
        this.BidderProfileForm.patchValue({
          ProfileName: profileName,
          PlatformID: platformID,
          IsGSTCharged: isGSTcharged
        });
      },
      (error) => {
        console.error('Error fetching profileName details:', error);
        alert('Error fetching profileName details. Please try again.');
      }
    );
  }
}
