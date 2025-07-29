import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-client',
  imports: [NavbarComponent, Toast, ConfirmDialog],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ClientComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'http://localhost:51535';
  ClientForm: any = FormGroup;
  clientdata: any[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.ClientForm = this.fb.group({
      ClientName: ['', [Validators.required]]
      /* 'UserID': ['', [Validators.required]]*/
    });
    this.FetchClientDetails();
  }


  FetchClientDetails() {
    debugger

    var observable = this.http.get(`${this.url}/api/ClientController/FetchClientDetails/${this.UserID}`);
    observable.subscribe(
      (res: any) => {


        console.log("res", res);
        this.clientdata = res.clientData;


      },
      (error) => {
        console.error('Error fetching platform details:', error);
        alert('Error fetching platform details. Please try again.');
      }
    );
  }
  DeleteClient(clientID: number) {
    this.confirmationservice.confirm({
      message: 'Are you sure you want to delete this client?',
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger', // Custom style for confirm button
      rejectButtonStyleClass: 'p-button-secondary', // Custom style for cancel button
      accept: () => {
        this.http.get(`${this.url}/api/ClientController/DeleteClient/${clientID}`).subscribe(
          (res: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
            setTimeout(() => window.location.reload(), 1200);
          },
          (error) => {
            console.error('Error deleting client:', error);
            alert('Error deleting client. Please try again.');
          }
        );
      }
    });
  }


  onAddNewClient() {
    this.router.navigate(['/add-client']);
  }

  editClientform(clientID: number) {
    debugger
    this.router.navigate(['/add-client', clientID]);
  }
}
