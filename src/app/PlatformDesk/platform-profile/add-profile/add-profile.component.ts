import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-profile',
  imports: [NavbarComponent, Toast, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-profile.component.html',
  styleUrl: './add-profile.component.css',
  providers:[MessageService]
})
export class AddProfileComponent {
  PlatformProfileForm: any = FormGroup;
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
    this.PlatformProfileForm = this.formbuilder.group({
      ProfileName: ['', [Validators.required]],
      PlatformID: ['', [Validators.required]],
      ProfileID: [0, [Validators.required]],
      IsGSTApplied: ['', [Validators.required]],
      ProfileUserName:['', [Validators.required]],
      PlatformProfileRefId:['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      const profileID = params['profileID'];
      this.ProfileID = profileID ? parseInt(profileID) : 0; 
      this.PlatformProfileForm.patchValue({ ProfileID: this.ProfileID });
      if (this.ProfileID !== 0) {
        this.FetchSinglePlatformProfile(this.ProfileID);
      }
    });
    this.FetchPlatformList();
  }



  FetchPlatformList() {debugger
  
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
    if (this.PlatformProfileForm.valid) {
      this.submitted = true;
      const data = {
       
        ProfileName: this.PlatformProfileForm.get('ProfileName').value,
        ProfileID: this.PlatformProfileForm.get('ProfileID').value,
        PlatformID: parseInt(this.PlatformProfileForm.get('PlatformID').value),
        IsGSTApplied: this.PlatformProfileForm.get('IsGSTApplied').value,
        ProfileUserName: this.PlatformProfileForm.get('ProfileUserName').value,
        PlatformProfileRefId: this.PlatformProfileForm.get('PlatformProfileRefId').value,

      };

      const observable = this.http.post(`${this.url}/api/PlatformProfileController/AddPlatformProfile`,data);
      observable.subscribe(
        (res: any) => {
          //if (res.Status == 1) {
          //  alert('Data saved successfully');
          //  this.BidderProfileForm.reload();
          //}
          this.PlatformProfileForm.reset();
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

            this.router.navigateByUrl('/platformprofile');
          }, 1500);

        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    }
  }

  FetchSinglePlatformProfile(profileID: number) {debugger
    const observable = this.http.get(`${this.url}/api/PlatformProfileController/FetchSinglePlatformProfile/${profileID}`);
    observable.subscribe(
      (res: any) => {
        debugger
        const profileName = res.profileName;
        const platformID = res.platformID;
        const isGSTapplied = res.isGSTApplied;
        const profileUserName = res.profileUserName;
        const platformProfileRefId = res.platformProfileRefId;
        this.PlatformProfileForm.patchValue({
          ProfileName: profileName,
          PlatformID: platformID,
          IsGSTApplied: isGSTapplied,
          ProfileUserName: profileUserName,
          PlatformProfileRefId:platformProfileRefId
        });
      },
      (error) => {
        console.error('Error fetching profileName details:', error);
        alert('Error fetching profileName details. Please try again.');
      }
    );
  }
}
