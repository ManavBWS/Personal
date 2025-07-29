import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bonusincentive',
  imports: [NavbarComponent, Toast, CommonModule, CalendarModule, FormsModule],
  templateUrl: './bonusincentive.component.html',
  styleUrl: './bonusincentive.component.css'
})
export class BonusincentiveComponent {
  url: string = 'http://localhost:51535';
  incentivedata: any[] = [];
  searchTerm: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  filteredIncentives: any[] = [];
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.FetchIncentiveDetails(this.startDate, this.endDate);
    this.setDefaultDate();
  }
  FetchIncentiveDetails(startDate: Date | null, endDate: Date | null) {
    debugger
    const formattedStartDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    var observable =
      this.http.get(`${this.url}/api/TransactionLog/FetchAllIncentive?startDate=${encodeURIComponent(formattedStartDate || '')}&endDate=${encodeURIComponent(formattedEndDate || '')}`);
    observable.subscribe(
      (res: any) => {
        debugger
        console.log("res", res);
        this.incentivedata = res.incentives;
        this.filteredIncentives = this.incentivedata;
      },
      (error) => {
        console.error('Error fetching incentive details:', error);
        alert('Error fetching incentive details. Please try again.');
      }
    );
  }
  onKeyUp(event: any) {
    debugger
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredIncentives = this.incentivedata.filter(p => p.bidderName.toLowerCase().includes(this.searchTerm));
    //this.incentivedata = this.incentivedata.filter(p => p.bidderName.toLowerCase() == this.searchTerm)
    //this.FetchIncentiveDetails(this.searchTerm, this.startDate, this.endDate);
  }
  dateFilter() {
    debugger
    this.FetchIncentiveDetails(this.startDate, this.endDate);
  }
  setDefaultDate() {
    const today = new Date();
    this.startDate = today;
    this.endDate = today;
  }
}
