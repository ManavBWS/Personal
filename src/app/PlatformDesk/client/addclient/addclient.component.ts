import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addclient',
  imports: [NavbarComponent, Toast, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './addclient.component.html',
  styleUrl: './addclient.component.css',
  providers:[MessageService]
})
export class AddclientComponent {
  ClientForm: any = FormGroup;
  url: string = 'http://localhost:51535'; // Base URL of your API
  submitted: boolean = false;
  ClientID: number = 0;
  formSubmitted: boolean = false;
  get headerText(): string {
    return this.ClientID === 0 ? 'Add Client' : 'Update Client';
  }
  constructor(
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.ClientForm = this.formbuilder.group({
      ClientID: [0, [Validators.required]],
      ClientName: ['', [Validators.required]],
      DisplayName: ['', [Validators.required]],
      PlatformClientRefID: [0, [Validators.required]]

    });

    this.route.params.subscribe(params => {
      debugger
      const clientID = params['clientID'];
      this.ClientID = clientID ? parseInt(clientID) : 0;
      this.ClientForm.patchValue({ ClientID: this.ClientID });
      if (this.ClientID !== 0) {
        this.FetchSingleClient(this.ClientID);
      }
    });
  }

  OnSubmit() {
    debugger
    this.formSubmitted = true;
    if (this.ClientForm.valid) {
      this.submitted = true;
      const data = {
        ClientID: parseInt(this.ClientForm.get('ClientID').value),
        ClientName: this.ClientForm.get('ClientName').value,
        DisplayName: this.ClientForm.get('DisplayName').value,
        PlatformClientRefID: this.ClientForm.get('PlatformClientRefID').value
      };

      const observable = this.http.post(`${this.url}/api/ClientController/SaveClient`, data);
      observable.subscribe(
        (res: any) => {
          //if (res.Status == 1) {
          //  alert('Data saved successfully');
          //  this.DepartmentForm.reset();
          //}
          this.ClientForm.reset();
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

            this.router.navigateByUrl('/client');
          }, 1500);;
        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Error saving data. Please try again.');
        }
      );
    }
  }

  FetchSingleClient(clientID: number) {
    debugger
    const observable = this.http.get(`${this.url}/api/ClientController/FetchSingleClient/${clientID}`);
    observable.subscribe(
      (res: any) => {
        const clientName = res.clientName;
        const displayName = res.displayName;
        const platformclientrefID = res.platformClientRefID
        this.ClientForm.patchValue({
          ClientName: clientName,
          DisplayName: displayName,
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
