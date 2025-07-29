import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-platform',
  imports: [NavbarComponent, ToastModule, ConfirmDialogModule, CommonModule, ButtonModule],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css',
  providers: [MessageService, ConfirmationService]
})
export class PlatformComponent {
  setMessage: any;
  UserID: any;
  url: string = 'https://localhost:7206';
  PlatformForm: any = FormGroup;
  platformdata: any[] = [];
  PlatformID: any;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder, 
    private router: Router, 
    private messageService: MessageService, 
    private confirmationservice: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.PlatformForm = this.fb.group({
      ProfileName: ['', [Validators.required]]
    });
    this.FetchPlatformDetails();
  }

  FetchPlatformDetails() {
    var observable = this.http.get(`${this.url}/api/PlatformController/FetchAllPlatform?pageNumber=1&pageSize=10&sortColumn=PlatformName&sortDirection=ASC`);
    observable.subscribe(
      (res: any) => {

        // console.log("res", res);
        this.platformdata = res.fetchPlatforms;


      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }

  DeletePlatform(platformID: number) {
    this.confirmationservice.confirm({
      message: 'Do you Really want to Delete data!!!??',
      accept: () => {
        this.http.delete(`${this.url}/api/PlatformController/DeletePlatform/${platformID}`)
        .subscribe(
          (res: any) => {
            // console.log("res", res);
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
            console.error('Error fetching platform details:', error);
            alert('Error fetching platform details. Please try again.');
          }

        );
      }
    });
  }

  onAddNewPlatform() {
    this.router.navigate(['/addplatform']);
  }

  editPlatform(platformID: number) {
    this.router.navigate(['/addplatform', platformID]);
  }
}
