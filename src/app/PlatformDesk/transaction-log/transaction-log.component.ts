import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Toast } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-log',
  imports: [NavbarComponent, Toast, CalendarModule, CommonModule, FormsModule],
  templateUrl: './transaction-log.component.html',
  styleUrl: './transaction-log.component.css'
})
export class TransactionLogComponent {
  url: string = 'http://localhost:51535';
  transactiondata: any[] = [];
  startDate: string = "";
  endDate: string = "";
  validDates: Date[] = [];
  disabledDates: Date[] = [];
  validWeekendDates: Date[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  disabledStartDates: Date[] = [];
  disabledEndDates: Date[] = [];
  constructor(private http: HttpClient,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.setDefaultDate();
    this.FetchTransactionLogDetails(this.selectedStartDate, this.selectedEndDate);
    this.setWeekStartDates(); 
    this.setWeekendDates();
  }
  FetchTransactionLogDetails(startDate:Date | null,endDate:Date | null) {
    debugger
    const formattedStartDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    const urlWithParams = `${this.url}/api/TransactionLog/FetchAllTransactions?startDate=${encodeURIComponent(formattedStartDate || '')}&endDate=${encodeURIComponent(formattedEndDate || '')}`;
    var observable = this.http.get(urlWithParams);
    observable.subscribe(
      (res: any) => {
        debugger
        console.log("res", res);
        this.transactiondata = res.transactions;
      },
      (error) => {
        console.error('Error fetching transaction log details:', error);
        alert('Error fetching transaction log details. Please try again.');
      }
    );
  } 
  filterDate() {debugger  
    this.FetchTransactionLogDetails(this.selectedStartDate, this.selectedEndDate);
  }

  setDefaultDate() {debugger
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const weekStartOffset = (dayOfWeek >= 3) ? (dayOfWeek - 3) : (dayOfWeek + 4); 
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - weekStartOffset);
    this.selectedStartDate = firstDayOfWeek;
    this.selectedEndDate = new Date(firstDayOfWeek);
    this.selectedEndDate.setDate(firstDayOfWeek.getDate() + 6);
  }

  setWeekStartDates() {
    const startYear = 1900;
    const endYear = 2100;
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1); 
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= lastDayOfMonth; day++) {
          date.setDate(day);
          if (date.getDay() === 3) { 
          } else {
            this.disabledStartDates.push(new Date(date)); 
          }
        }
      }
    }
  }

  setWeekendDates() {
    const startYear = 1900;
    const endYear = 2100;
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1); 
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate(); 
        for (let day = 1; day <= lastDayOfMonth; day++) {
          date.setDate(day);
          if (date.getDay() === 2) { 
          } else {
            this.disabledEndDates.push(new Date(date)); 
          }
        }
      }
    }
  }
}
