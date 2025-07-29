import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-details',
  imports: [NavbarComponent, Toast, ConfirmDialog],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ProjectDetailsComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'http://localhost:51535';
  ProjectDetailForm: any = FormGroup;
  projectData: any[] = [];
  displayMilestoneDialog: boolean = false;
  milestone: any = { amount: null, startDate: '', endDate: '' };
  submitted: boolean = false;
  PaymentDetailID: any;
  /*  ProfileID: any;*/
  formSubmitted: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.ProjectDetailForm = this.fb.group({
      ProjectName: ['', [Validators.required]],
      PlatformName: ['', [Validators.required]],
      ProfileName: ['', [Validators.required]],
      DepartmentName: ['', [Validators.required]],
      ProjectType: ['', [Validators.required]]


      /* 'UserID': ['', [Validators.required]]*/
    });
    this.FetchProjectDetails();
  }

  FetchProjectDetails() {
    var observable = this.http.get(`${this.url}/api/ProjectController/FetchProjectDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {

        console.log("res", res);
        this.projectData = res.projectDetails;

      },
      (error) => {
        console.error('Error fetching profile details:', error);
        alert('Error fetching profile details. Please try again.');
      }
    );
  }

  DeleteProject(projectID: number) {

    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        var observable = this.http.get(`${this.url}/api/ProjectController/DeleteProject/${projectID}`);
        observable.subscribe(
          (res: any) => {

            console.log("res", res);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message
            })
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


  onAddProject() {
    this.router.navigate(['/project']);
  }

  editProject(projectID: number) {
    this.router.navigate(['/project', projectID]);
  }
}
