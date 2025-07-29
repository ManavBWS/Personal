import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bidder',
  imports: [ReactiveFormsModule, CommonModule, ToastModule, NavbarComponent, RouterLink],
  templateUrl: './add-bidder.component.html',
  styleUrl: './add-bidder.component.css',
  providers: [MessageService]
})
export class AddBidderComponent {
  BidderForm: any = FormGroup;
  url: string = 'http://localhost:51535'; // Base URL of your API
  submitted: boolean = false;
  BidderID: number = 0;
  formSubmitted: boolean = false;
  get headerText(): string {
    return this.BidderID === 0 ? 'Add Bidder' : 'Update Bidder';
  }
  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.BidderForm = this.formbuilder.group({
      BidderID: [0, [Validators.required]],
      BidderName: ['', [Validators.required]],
      //IsActive: [false, [Validators.required]]
    });

    this.route.params.subscribe(params => {
      debugger
      const bidderID = params['bidderID'];
      this.BidderID = bidderID ? parseInt(bidderID) : 0;
      this.BidderForm.patchValue({ BidderID: this.BidderID });
      if (this.BidderID !== 0) {
        this.FetchSingleBidder(this.BidderID);
      }
    });
  }

  OnSubmit() {
    debugger
    this.formSubmitted = true;
    if (this.BidderForm.valid) {
      this.submitted = true;
      const data = {
        BidderID: parseInt(this.BidderForm.get('BidderID').value),
        BidderName: this.BidderForm.get('BidderName').value,
        //IsActive: this.BidderForm.get('IsActive').value,
      };

      const observable = this.http.post(`${this.url}/api/BidderController/SaveBidder`, data);
      observable.subscribe(
        (res: any) => {
          debugger
          //if (res.Status == 1) {
          //  alert('Data saved successfully');
          //  this.DepartmentForm.reset();
          //}
          this.BidderForm.reset();
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

            this.router.navigateByUrl('/bidder');
          }, 1500);;
        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    }
  }

  FetchSingleBidder(bidderID: number) {
    debugger
    const observable = this.http.get(`${this.url}/api/BidderController/FetchSingleBidder/${bidderID}`);
    observable.subscribe(
      (res: any) => {
        const bidderName = res.bidderName;
        const isActive = res.isActive;
        const platformclientrefID = res.platformClientRefID
        this.BidderForm.patchValue({
          BidderName: bidderName,
          IsActive: isActive,
          PlatformClientRefID: platformclientrefID
        });
      },
      (error) => {
        console.error('Error fetching Department details:', error);
        alert('Error fetching Department details. Please try again.');
      }
    );
  }
}
