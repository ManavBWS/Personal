import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-bidder',
  imports: [FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, NavbarComponent, CommonModule],
  templateUrl: './bidder.component.html',
  styleUrl: './bidder.component.css',
  providers: [ConfirmationService, MessageService]
})
export class BidderComponent {
  setMessage: any;
  UserID: any = -1;
  url: string = 'http://localhost:51535';
  BidderForm!: FormGroup;
  bidderdata: any[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService) { }

  ngOnInit(): void {
    this.FetchBidderDetails();
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
  DeleteBidder(bidderID: number) {
    debugger
    this.confirmationservice.confirm({
      message: 'Are you sure you want to delete this client?',
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.http.get(`${this.url}/api/BidderController/DeleteBidder/${bidderID}`).subscribe(
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


  onAddNewBidder() {
    this.router.navigate(['/add-bidder']);
  }

  editBidderform(bidderID: number) {
    debugger
    this.router.navigate(['/add-bidder', bidderID]);
  }
}
