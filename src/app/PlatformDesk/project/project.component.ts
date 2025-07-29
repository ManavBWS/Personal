import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Dialog } from "primeng/dialog";

@Component({
  selector: 'app-project',
  imports: [NavbarComponent, Toast, ConfirmDialog, ReactiveFormsModule, CommonModule, RouterLink, Dialog, SharedModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ProjectComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'http://localhost:51535';
  DataForm: any = FormGroup;
  projecttype: any[] = [];
  platformdata: any[] = [];
  departmentdata: any[] = [];
  profiledatas: any[] = [];
  submitted: boolean = false;
  ProjectID: number = 0;
  PaymentDetailID: number = 0;
  formSubmitted: boolean = false;
  ProjectDetailForm: any = FormGroup;
  milestones: any[] = [];
  isEdited: boolean = false;
  milestone: any = { type: 'fixed', amount: null, startDate: '', endDate: '', hours: null };
  selectedProjectType: string = '';
  displayMilestoneDialog: boolean = false;
  projectDetails: any = {}; // Initialize as an empty object
  milestoneForm: any = FormGroup;
  projectTypeID: any;
  bidderdata: any[] = [];
  clientdata: any[] = [];
  get headerText(): string {
    return this.ProjectID === 0 ? 'Add Project' : 'Update Project';
  }



  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private messageService: MessageService, private confirmationservice: ConfirmationService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.DataForm = this.fb.group({
      ProjectName: ['', [Validators.required]],
      ProjectID: [0, [Validators.required]],
      PlatformID: ['', [Validators.required]],
      ProfileID: ['', [Validators.required]],
      DepartmentID: ['', [Validators.required]],
      ProjectTypeID: ['', [Validators.required]],
      PaymentDetailD: [0, [Validators.required]],
      BidderID: ['', [Validators.required]],
      ClientID: ['', [Validators.required]],
      Skills: ['', [Validators.required]],
      PlatformContractID: ['', [Validators.required]],
      Amount: [null],
      StartDate: [null],
      EndDate: [null],
      Hours: [null]

      /* projectType: ['', [Validators.required]] */
    });
    this.milestoneForm = this.fb.group({
      ProjectID: [null, Validators.required],
      ProjectTypeID: [null, Validators.required],
      Amount: [null, Validators.required],
      Hours: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      HourlyTypeID: [null, Validators.required],
      FixedTypeID: [null, Validators.required],

    });


    this.route.params.subscribe(params => {
      const projectID = params['projectID'];
      this.ProjectID = projectID ? parseInt(projectID) : 0;
      this.DataForm.patchValue({ ProjectID: this.ProjectID });
      if (this.ProjectID !== 0) {
        this.FetchSingleProject(this.ProjectID);
        this.FetchMileStone(this.ProjectID);
      }
    });
    this.FetchProjectType();
    this.FetchPlatformDetails();
    this.FetchDepartmentDetails();
    this.FetchPlatformProfileDetails();
    this.FetchBidderDetails();
    this.FetchClientDetails();
    this.FetchMileStone(this.ProjectID);
  }


  initializeForm() {
    this.milestoneForm = this.fb.group({
      ProjectID: ['', Validators.required],
      ProjectTypeID: ['', Validators.required],
      Amount: ['', Validators.required],
      Hours: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    });
  }

  FetchProjectType() {

    var observable = this.http.get(`${this.url}/api/ProjectController/FetchProjectType/${this.UserID}`)
    observable.subscribe(
      (res: any) => {
        debugger

        this.projecttype = res.projectTypes;
      },
      (error) => {
        console.error('Error fetching projecttype names:', error);
        alert('Error fetching projecttype names. Please try again.');
      }
    )


  }
  FetchPlatformDetails() {
    // Fetch platform details from the API

    var observable = this.http.get(`${this.url}/api/PlatformController/FetchAllPlatform/${this.UserID}`);
    observable.subscribe(
      (res: any) => {


        console.log("res", res);
        this.platformdata = res.fetchPlatforms;


      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }

  FetchDepartmentDetails() {


    var observable = this.http.get(`${this.url}/api/DepartmentController/FetchAllDepartment/${this.UserID}`);
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
  FetchPlatformProfileDetails() {


    var observable = this.http.get(`${this.url}/api/PlatformProfileController/FetchPlatformProfileDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {


        console.log("res", res);
        this.profiledatas = res.profileData;


      },
      (error) => {
        console.error('Error fetching profile details:', error);
        alert('Error fetching profile details. Please try again.');
      }
    );
  }

  FetchBidderDetails() {
    debugger

    var observable = this.http.get(`${this.url}/api/BidderController/FetchBidderDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {
        debugger

        console.log("res", res);
        this.bidderdata = res.bidderData;


      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }

  FetchClientDetails() {
    debugger

    var observable = this.http.get(`${this.url}/api/ClientController/FetchClientDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {
        debugger

        console.log("res", res);
        this.clientdata = res.clientData;


      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }

  OnSubmit() {
    debugger
    this.formSubmitted = true;
    if (this.DataForm.valid) {
      this.submitted = true;
      const commonData = {
        ProjectName: this.DataForm.get('ProjectName').value,
        ProjectID: this.DataForm.get('ProjectID').value,
        PlatformID: parseInt(this.DataForm.get('PlatformID').value),
        DepartmentID: parseInt(this.DataForm.get('DepartmentID').value),
        ProjectTypeID: parseInt(this.DataForm.get('ProjectTypeID').value),
        ProfileID: parseInt(this.DataForm.get('ProfileID').value),
        BidderID: parseInt(this.DataForm.get('BidderID').value),
        ClientID: parseInt(this.DataForm.get('ClientID').value),
        Skills: this.DataForm.get('Skills').value,
        PlatformContractID: parseInt(this.DataForm.get('PlatformContractID').value)
      };

      let data: any = {};

      // Conditional logic based on selected project type
      if (commonData.ProjectTypeID === 1) {
        data = {
          ...commonData,
          Amount: this.DataForm.get('Amount').value,
          StartDate: this.DataForm.get('StartDate').value,
          EndDate: this.DataForm.get('EndDate').value,
        };
      } else if (commonData.ProjectTypeID === 2) {
        data = {
          ...commonData,
          Amount: this.DataForm.get('Amount').value,
          Hours: this.DataForm.get('Hours').value,
          StartDate: this.DataForm.get('StartDate').value,
        };
      }

      const observable = this.http.post(`${this.url}/api/ProjectController/SaveUpdateProject`, data);
      observable.subscribe(
        (res: any) => {
          debugger
          this.DataForm.reset();
          this.formSubmitted = false;
          console.log('Success status detected. Message:', res.message);
          if (res.status === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message
            });
          }
          else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            });
          }

          //console.log('Error status detected. Message:', res.message);
          //this.messageService.add({
          //  severity: 'success',
          //  summary: 'Error',
          //  detail: res.message
          //});

          setTimeout(() => {
            this.router.navigateByUrl('/projectdetail');
          }, 1500);
        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    } else {
      console.error('Form is invalid:', this.DataForm);
    }
  }

  ProjectTypeID: any;
  FetchSingleProject(projectID: number) {
    /*   this.isEdited = true;*/
    const observable = this.http.get(`${this.url}/api/ProjectController/FetchSingleProject/${projectID}`);
    observable.subscribe(
      (res: any) => {

        this.projectDetails = res;
        console.log("res", res);
        /*  const projectName = res.projectName;*/
        const projectID = res.projectID;
        const platformID = res.platformID;
        const departmentID = res.departmentID;
        const profileID = res.profileID;
        const projectTypeID = res.projectTypeID;
        this.ProjectTypeID = res.projectTypeID;
        const bidderID = res.bidderID;
        const clientID = res.clientID;
        const skills = res.skills;
        const platformContractID = res.platformContractID;
        /*const paymentDetailID = res.paymentDetailID;*/
        const amount = res.amount;
        const hours = res.hours;
        const startDate = new Date(res.startDate).toISOString().split('T')[0];
        const endDate = new Date(res.endDate).toISOString().split('T')[0];


        this.DataForm.patchValue({
          ProjectName: this.projectDetails.projectName,
          /*     ProjectName: projectName,*/
          ProjectID: projectID,
          PlatformID: platformID,
          DepartmentID: departmentID,
          ProfileID: profileID,
          ProjectTypeID: projectTypeID,
          BidderID: bidderID,
          ClientID: clientID,
          Skills: skills,
          PlatformContractID: platformContractID,
          /*PaymentDetailID: paymentDetailID,*/
          Amount: amount,
          Hours: hours,
          StartDate: startDate,
          EndDate: endDate

        });
        this.disableEditing();
      },
      (error) => {
        console.error('Error fetching Project details:', error);
        alert('Error fetching Project details. Please try again.');
      }
    );
  }
  disableEditing() {
    this.DataForm.get('Amount').disable();
    this.DataForm.get('StartDate').disable();
    this.DataForm.get('EndDate').disable();
    this.DataForm.get('Hours').disable();
    this.isEdited = true; // control for UI or logic
  }

  onProjectTypeChange() {
    this.selectedProjectType = this.DataForm.get('ProjectTypeID').value;
    this.updateFormValidators();
  }
  updateFormValidators() {
    const amountControl = this.DataForm.get('Amount');
    const startDateControl = this.DataForm.get('StartDate');
    const endDateControl = this.DataForm.get('EndDate');
    const hoursControl = this.DataForm.get('Hours');

    amountControl.clearValidators();
    startDateControl.clearValidators();
    endDateControl.clearValidators();
    hoursControl.clearValidators();

    if (this.selectedProjectType === '1') {
      amountControl.setValidators([Validators.required]);
      startDateControl.setValidators([Validators.required]);
      endDateControl.setValidators([Validators.required]);
    } else if (this.selectedProjectType === '2') {
      amountControl.setValidators([Validators.required]);
      hoursControl.setValidators([Validators.required]);
      startDateControl.setValidators([Validators.required]);
    }

    amountControl.updateValueAndValidity();
    startDateControl.updateValueAndValidity();
    endDateControl.updateValueAndValidity();
    hoursControl.updateValueAndValidity();
  }

  HourlyTypeID: any;
  FixedTypeID: any;
  typeProjectID: any;

  FetchMileStone(ProjectID: number) {
    debugger
    const observable = this.http.get(`${this.url}/api/ProjectController/FetchMileStone/${ProjectID}`);
    observable.subscribe(
      (res: any) => {
        debugger
        this.milestone = res.mileStones;
        this.typeProjectID = res.typeProjectID;
        // this.HourlyTypeID = res.hourlyTypeID;
        //this.FixedTypeID = res.fixedTypeID; 
        console.log("res", res);

        /*   localStorage.setItem("PaymentDetailID",this.milestones[0].PaymentDetailID)*/
      },
      (error) => {
        console.error('Error fetching MileStone details:', error);
        /*        alert('Error fetching MileStone details. Please try again.');*/
      }
    );
  }
  DeleteMilestone(typeProjectID: number) {
    debugger
    this.confirmationservice.confirm({
      message: 'Do you really want to delete this milestone?',
      accept: () => {
        debugger
        const observable = this.http.get(`${this.url}/api/ProjectController/DeleteMilestone`, {

          params: {
            TypeProjectID: typeProjectID.toString(),
            //FixedTypeID: fixedTypeID.toString(),
            //HourlyTypeID: hourlyTypeID.toString(),
            ProjectTypeID: this.ProjectTypeID.toString(),
            ProjectID: this.ProjectID.toString()
          }
        });
        observable.subscribe(
          (res: any) => {
            console.log("DeleteMilestone Response:", res);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          },
          (error) => {
            console.error('Error', error);
            alert('Error. Please try again.');
          }
        );
      }
    });
  }


  showMilestoneDialog(projectTypeID: number) {
    if (this.projectDetails) {
      this.milestoneForm.patchValue({
        ProjectID: this.projectDetails.projectID,
        ProjectTypeID: this.projectDetails.projectTypeID
      });
      this.displayMilestoneDialog = true; // Display the milestone dialog
    }
  }





  //showMilestoneDialog(ProjectID: number) {
  //  debugger

  //  this.displayMilestoneDialog = true;
  //}
  saveMilestone() {

    this.formSubmitted = true;
    this.submitted = true;
    let milestoneData: any = {
      ProjectID: this.milestoneForm.get('ProjectID').value,
      ProjectTypeID: this.milestoneForm.get('ProjectTypeID').value,
      StartDate: this.milestoneForm.get('StartDate').value,
    };

    if (this.milestoneForm.get('ProjectTypeID').value == 1) {

      milestoneData.Amount = this.milestoneForm.get('Amount').value;
      milestoneData.EndDate = this.milestoneForm.get('EndDate').value;
    } else if (this.milestoneForm.get('ProjectTypeID').value == 2) {

      milestoneData.Amount = this.milestoneForm.get('Amount').value;
      milestoneData.Hours = this.milestoneForm.get('Hours').value;
    }
    //const milestoneData = {
    //  ProjectID: this.milestoneForm.get('ProjectID').value,
    //  ProjectTypeID: this.milestoneForm.get('ProjectTypeID').value,
    //  Amount: this.milestoneForm.get('Amount').value,
    //  Hours: this.milestoneForm.get('Hours').value,
    //  StartDate: this.milestoneForm.get('StartDate').value,
    //  EndDate: this.milestoneForm.get('EndDate').value
    //};


    const observable = this.http.post(`${this.url}/api/ProjectController/SaveMilestoneData`, milestoneData);

    observable.subscribe(
      (res: any) => {
        console.log("res", res);
        this.milestoneForm.reset(); // Reset form values after successful save
        this.displayMilestoneDialog = false; // Close the milestone dialog

        if (res.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message
          });

          // Add new milestone data to the existing array without overwriting
          this.milestones = [...this.milestones, milestoneData];
          //this.FetchMileStone(this.ProjectID);
        }
        setTimeout(() => {
          // Reload data or navigate to another page if needed
          window.location.reload();
        }, 1800);
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getTime() >= new Date('1753-01-01').getTime() && date.getTime() <= new Date('9999-12-31').getTime();
  }
}
