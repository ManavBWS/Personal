// import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
// import { NavbarComponent } from "../navbar/navbar.component";
// import { Toast } from "primeng/toast";
// import { CalendarModule } from "primeng/calendar";
// import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { DatePipe } from '@angular/common';
// import { AutoCompleteModule } from 'primeng/autocomplete';

// @Component({
//   selector: 'app-employee-schedule',
//   imports: [NavbarComponent, Toast, CalendarModule, AutoCompleteModule, FormsModule],
//   templateUrl: './employee-schedule.component.html',
//   styleUrl: './employee-schedule.component.css'
// })
// export class EmployeeScheduleComponent {
//   setMessage: any;
//   UserID: any = -1;
//   url: string = 'http://localhost:51535';
//   isDragging = false;
//   schedules = [ /* your schedule data */];
//   //weekdayList: any[] = [];
//   employeeData: any[] = [];
//   employeescheduleData: any[] = [];
//   scheduleDetails: any = {
//     //employeeID: 0,
//     //weekDayID: 0,
//     //weekstartdate: new Date(),
//     //weekDayName: ''
//   };

//   scheduleForm: any = FormGroup;
//   displayScheduleDialog: boolean = false;
//   dialogStyle: any = {};
//   shifts: any[] = [];
//   profileformdata: any[] = [];
//   projectdata: any[] = [];
//   selectedProfile: string = '';

//   InTime: string = '';
//   OutTime: string = '';
//   selectedDate: Date;
//   weekdays: string[] = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
//   // weekdayList: { weekDayID: number, weekDayName: string }[] = [
//   //   { weekDayID: 0, weekDayName: 'Wednesday' },
//   //   { weekDayID: 1, weekDayName: 'Thursday' },
//   //   { weekDayID: 2, weekDayName: 'Friday' },
//   //   { weekDayID: 3, weekDayName: 'Saturday' },
//   //   { weekDayID: 4, weekDayName: 'Sunday' },
//   //   { weekDayID: 5, weekDayName: 'Monday' },
//   //   { weekDayID: 6, weekDayName: 'Tuesday' }
//   // ];
//   weekdayList: any[] = [];

//   ShiftTimeList = ['12:00AM', '12:15AM', '12:30AM', '12:45AM', '1:00AM', '1:15AM', '1:30AM', '1:45AM', '2:00AM', '2:15AM', '2:30AM', '2:45AM',
//     '3:00AM', '3:15AM', '3:30AM', '3:45AM', '4:00AM', '4:15AM', '4:30AM', '4:45AM', '5:00AM', '5:15AM', '5:30AM', '5:45AM', '6:00AM', '6:15AM',
//     '6:30AM', '7:00AM', '7:15AM', '7:30AM', '7:45AM', '8:00AM', '8:15AM', '8:30AM', '8:45AM', '9:00AM', '9:15AM', '9:30AM', '9:45AM', '10:00AM',
//     '10:15AM', '10:30AM', '10:45AM', '11:00AM', '11:15AM', '11:30AM', '11:45AM',
//     '12:00PM', '12:15PM', '12:30PM', '12:45PM', '1:00PM', '1:15PM', '1:30PM', '1:45PM', '2:00PM', '2:15PM', '2:30PM', '2:45PM',
//     '3:00PM', '3:15PM', '3:30PM', '3:45PM', '4:00PM', '4:15PM', '4:30PM', '4:45PM', '5:00PM', '5:15PM', '5:30PM', '5:45PM', '6:00PM', '6:15PM',
//     '6:30PM', '7:00PM', '7:15PM', '7:30PM', '7:45PM', '8:00PM', '8:15PM', '8:30PM', '8:45PM', '9:00PM', '9:15PM', '9:30PM', '9:45PM', '10:00PM',
//     '10:15PM', '10:30PM', '10:45PM', '11:00PM', '11:15PM', '11:30PM', '11:45PM'];
//   filteredShiftList: string[] = [];
//   formSubmitted: boolean = false;
//   errorMessage: string = '';
//   submitted: boolean = false;
//   filterObject: FilterOptions = new FilterOptions();
//   validDates: Date[] = [];
//   disabledDates: Date[] = [];
//   ScheduleList: any[] = [];
//   ScheduleID: number = 0;
//   schedulesByCell: { [key: string]: any } = {};
//   scheduleData: any = {};
//   ScheduleDatas: any = {};
//   ProjectID: string = '';
//   IsShift: boolean = false;
//   scheduleList: Schedule[] = [];
//   days: Day[] = [];
//   constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private messageService: MessageService, private confirmationservice: ConfirmationService,
//     private eRef: ElementRef, private datePipe: DatePipe, private cdr: ChangeDetectorRef) { this.selectedDate = new Date(); }

//   ngOnInit(): void {

//     this.scheduleForm = this.fb.group({
//       ScheduleID: [0, Validators.required],
//       EmployeeID: [0, Validators.required],
//       WeekDayID: [0, Validators.required],
//       ProfileID: [0, Validators.required],
//       /*  ProfileName: ['', Validators.required],*/
//       ProjectID: [0, Validators.required],
//       IsShift: [false],
//       InTime: ['', Validators.required],
//       OutTime: ['', Validators.required],
//       WeekStartDate: ['', Validators.required]



//     });
//     /*    this.FetchDayList();*/
//     this.FetchEmployeeDetails(this.selectedDate, this.UserID);
//     this.FetchPlatformProfileDetails();
//     this.weekdayList = this.getWeekEndDate(this.selectedDate); // Ensure selectedDate is a Date object
//     this.setClosestWednesday(new Date());
//     this.selectedDate = this.validDates[0];
//     this.setWeekStartDates();
//     this.setClosestLastWeekStartDate(new Date());
//     /*  this.FetchSchedules();*/
//     /* this.FetchSingleSchedule(this.ScheduleID);*/
//   }

//   onDrop(event: CdkDragDrop<Schedule[]>) {
//     debugger
//     const draggedSchedule = event.item.data as Schedule;
//     const oldEmployeeId = draggedSchedule.employeeID;
//     const oldWeekDayID = draggedSchedule.weekDayID;

//     // Remove the item from its previous position
//     const previousIndex = this.scheduleList.findIndex(item => item.id === draggedSchedule.id);
//     if (previousIndex > -1) {
//       this.scheduleList.splice(previousIndex, 1);
//     }

//     // Determine the new cell details
//     const newCell = event.container.data;
//     //const newEmployeeId = newCell.employeeID;
//     /*const newWeekDayID = newCell.weekDayID;*/

//     // Insert the item into the new position
//     const newIndex = event.currentIndex;
//     this.scheduleList.splice(newIndex, 0, draggedSchedule);

//     // Call the update API
//     /*  this.updateScheduleApi(draggedSchedule.id, oldEmployeeId, oldWeekDayID, newEmployeeId, newWeekDayID);*/
//   }

//   private getScheduleIndex(schedule: Schedule, employeeId: number, weekDayID: number): number {
//     debugger
//     return this.scheduleList.findIndex(item => item.id === schedule.id);
//   }
//   //getEmployeeIdFromDrop(event: CdkDragDrop<Schedule[]>): number {
//   //  // Extract the new cell's employeeID
//   //  // Adjust this based on how you structure your cells and how you identify the new cell
//   //  const newCell = event.container.data;
//   // /* return newCell.employeeID;*/
//   //}

//   //getWeekDayIdFromDrop(event: CdkDragDrop<Schedule[]>): number {
//   //  // Extract the new cell's weekDayID
//   //  // Adjust this based on how you structure your cells and how you identify the new cell
//   //  const newCell = event.container.data;
//   //  /*return newCell.weekDayID;*/
//   //}
//   filteredSchedules(employeeID: number, weekDayID: number, weekStartDate: Date) {
//     return this.employeescheduleData.filter(
//       s => s.employeeID === employeeID && s.weekDayID === weekDayID &&
//         new Date(s.weekStartDate).toDateString() === weekStartDate.toDateString()
//     );
//   }

//   setClosestLastWeekStartDate(date: Date) {
//     debugger
//     let currentDay = date.getDay();
//     let diff = (currentDay + 7 - 3) % 7; // Calculate days to subtract to get the last Wednesday
//     this.selectedDate = new Date(date);
//     this.selectedDate.setDate(date.getDate() - diff);

//     // Format selectedDate as MM/dd/yyyy
//     this.scheduleForm.get('WeekStartDate').setValue(this.formatDate(this.selectedDate));
//   }

//   // Helper function to format date as MM/dd/yyyy
//   formatDate(date: Date): string {
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   }


//   setWeekStartDates() {
//     debugger
//     const start = new Date(2024, 0, 1); // Start from the beginning of the year or any specific date
//     const end = new Date(2024, 11, 31); // End date

//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       if (d.getDay() === 3) { // Wednesday
//         this.validDates.push(new Date(d));
//       } else {
//         this.disabledDates.push(new Date(d));
//       }
//     }
//   }

//   setClosestWednesday(date: Date) {
//     debugger
//     let currentDay = date.getDay();
//     let diff = (currentDay + 4) % 7;
//     this.selectedDate = new Date(date);
//     this.selectedDate.setDate(date.getDate() - diff);
//   }

//   FetchEmployeeDetails(SelectedDate: Date, UserID: number) {

//     let currentDay = SelectedDate.getDay();
//     let currentDate = new Date(SelectedDate);


//     let diff = (currentDay + 4) % 7;

//     SelectedDate.setDate(currentDate.getDate() - diff);

//     SelectedDate.setHours(0, 0, 0, 0);
//     const formattedStartDate = SelectedDate.toISOString();

//     var observable = this.http.get(`${this.url}/api/EmployeeController/FetchEmployeeDetails/${formattedStartDate}/${UserID}`);
//     observable.subscribe(
//       (res: any) => {
//         console.log("Fetched employee details:", res);
//         this.employeeData = res._employeedetails;
//         this.employeescheduleData = res._empoloyeeschedule;
//       },
//       (error) => {
//         console.error('Error fetching employee details:', error);
//       }
//     );
//   }
//   formatDateTime(dateTime: string | null | undefined): string {
//     if (!dateTime) return ''; // Handle null or undefined case
//     const formattedDate = new Date(dateTime);
//     if (isNaN(formattedDate.getTime())) {
//       // Invalid date string, return empty string or handle accordingly
//       return '';
//     }
//     return this.datePipe.transform(formattedDate, 'hh:mm a') || '';
//   }


//   id: any;
//   previousSchID: any;
//   showDialog(employeeID: number, weekDayID: number, weekDayName: string, selectedDate: Date, event: MouseEvent) {
//     debugger
//     console.log('showDialog called:', { employeeID, weekDayID, weekDayName, selectedDate });
//     //if (this.displayScheduleDialog == true) {
//     //  return
//     //}

//     const schedule = this.employeescheduleData.find(s => s.employeeID === employeeID && s.weekDayID === weekDayID);
//     if (!schedule) {
//       this.displayScheduleDialog = true;
//       this.selectedProfile = '';
//       this.InTime = '';
//       this.OutTime = '';
//       this.ProjectID = '';
//       this.IsShift = false;
//       this.ScheduleID = 0;
//       this.projectdata = [];
//     } else if (this.displayScheduleDialog === false && schedule.scheduleID > 0) {
//       this.fillScheduleDetails(schedule);
//     } else if (this.displayScheduleDialog === true && this.previousSchID === schedule.scheduleID) {
//       return;
//     } else {
//       this.fillScheduleDetails(schedule);
//     }
//     //if (schedule == undefined && schedule == null) {
//     //  this.displayScheduleDialog = true;
//     //  this.selectedProfile = '';
//     //  this.InTime = '';
//     //  this.OutTime = '';
//     //  this.ProjectID = '';
//     //  this.IsShift = false;
//     //  this.ScheduleID = 0;
//     //  this.projectdata = [];

//     //}
//     //else if (this.displayScheduleDialog == false && schedule.scheduleID > 0) {
//     //  this.InTime = this.formatDateTime(schedule.inTime);
//     //  this.OutTime = this.formatDateTime(schedule.outTime);
//     //  this.selectedProfile = schedule.profileID;
//     //  this.onProfileSelect(this.selectedProfile);
//     //  this.InTime = this.InTime;
//     //  this.OutTime = this.OutTime;
//     //  this.ProjectID = schedule.projectID;
//     //  this.IsShift = schedule.isShift;
//     //  this.ScheduleID = schedule.scheduleID;
//     //  this.previousSchID = this.ScheduleID;
//     //}
//     //else if (this.displayScheduleDialog == true && this.previousSchID == schedule.scheduleID) {
//     //  return;
//     //}
//     //else {
//     //this.InTime = this.formatDateTime(schedule.inTime);
//     //  this.OutTime = this.formatDateTime(schedule.outTime);
//     //  this.selectedProfile = schedule.profileID;
//     //  this.onProfileSelect(this.selectedProfile);
//     //  this.InTime = this.InTime;
//     //  this.OutTime = this.OutTime;
//     //  this.ProjectID = schedule.projectID;
//     //  this.IsShift = schedule.isShift;
//     //  this.ScheduleID = schedule.scheduleID;
//     //  this.previousSchID = this.ScheduleID;
//     //}

//     if (!weekDayName && this.weekdayList[weekDayID]) {
//       weekDayName = this.weekdayList[weekDayID].weekDayName;
//     }

//     this.scheduleDetails = {
//       employeeID: employeeID,
//       weekDayID: weekDayID,
//       weekstartdate: selectedDate,
//       weekDayName: weekDayName
//     };
//     console.log('scheduleDetails set:', this.scheduleDetails);
//     const dialogWidth = 300;
//     const addheight = 20;
//     let offsetX = '';
//     let offsetY = '';

//     const Totalwidth = window.innerWidth;
//     if (Totalwidth > 1024) {
//       if ((Totalwidth - event.clientX - (dialogWidth / 2)) > (dialogWidth / 2)) {
//         offsetX = (event.clientX - (dialogWidth / 2)) + 'px';
//       } else {
//         offsetX = (event.clientX - (dialogWidth / 2)) + 'px';
//       }
//       offsetY = (event.clientY + addheight) + 'px';
//     } else {
//       offsetX = (event.clientX - (dialogWidth / 2)) + 'px';
//       offsetY = (event.clientY + addheight) + 'px';
//     }

//     this.dialogStyle = {
//       top: offsetY,
//       left: offsetX
//     };

//   }
//   fillScheduleDetails(schedule: any) {
//     this.InTime = this.formatDateTime(schedule.inTime);
//     this.OutTime = this.formatDateTime(schedule.outTime);
//     this.selectedProfile = schedule.profileID;
//     this.onProfileSelect(this.selectedProfile);
//     this.ProjectID = schedule.projectID;
//     this.IsShift = schedule.isShift;
//     this.ScheduleID = schedule.scheduleID;
//   }
//   onProfileSelect(event: any) {
//     debugger
//     const selectElement = event.target as HTMLSelectElement;
//     if (selectElement == undefined) {
//       const profileID = this.selectedProfile;
//       console.log("Selected Profile ID:", profileID);
//       this.displayScheduleDialog = false;
//       var observable = this.http.get(`${this.url}/api/EmployeeScheduleController/GetProjects/${profileID}`);
//       observable.subscribe(
//         (res: any) => {
//           console.log("Response:", res);
//           this.projectdata = res.projectList;
//           this.displayScheduleDialog = true;
//           //this.ProjectID = '';
//           //this.ProjectID = this.id;
//           if (this.projectdata.length === 1) {
//             this.ProjectID = this.projectdata[0].projectID;
//           }

//         },
//         (error) => {
//           console.error('Error fetching data:', error);

//         }
//       );
//     }
//     if (selectElement) {
//       const profileID = selectElement.value;
//       console.log("Selected Profile ID:", profileID);

//       var observable = this.http.get(`${this.url}/api/EmployeeScheduleController/GetProjects/${profileID}`);
//       observable.subscribe(
//         (res: any) => {

//           console.log("Response:", res);
//           this.projectdata = res.projectList;
//           if (this.projectdata.length === 1) {
//             this.ProjectID = this.projectdata[0].projectID;
//           }

//         },
//         (error) => {
//           console.error('Error fetching data:', error);

//         }
//       );
//     }

//     else {
//       console.error("Select element not found in event target.");
//     }
//   }


//   closeDialog() {
//     this.displayScheduleDialog = false;
//     this.scheduleDetails = {};
//   }



//   deleteShift(index: number) {

//     this.shifts.splice(index, 1);
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const targetElement = event.target as HTMLElement;
//     if (this.displayScheduleDialog && !this.eRef.nativeElement.contains(targetElement)) {
//       this.closeDialog();
//     }
//   }
//   FetchPlatformProfileDetails() {


//     var observable = this.http.get(`${this.url}/api/PlatformProfileController/FetchPlatformProfileDetails/${this.UserID}`);
//     observable.subscribe(
//       (res: any) => {


//         console.log("res", res);
//         this.profileformdata = res.profileData;


//       },
//       (error) => {
//         console.error('Error fetching profile details:', error);
//         alert('Error fetching profile details. Please try again.');
//       }
//     );
//   }

//   filterDayShiftTime(event: any) {
//     const query = event.query.toLowerCase();
//     this.filteredShiftList = this.ShiftTimeList.filter(time => time.toLowerCase().includes(query));
//   }

//   saveSchedule(selectedDate: Date) {
//     debugger
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     const seconds = now.getSeconds();
//     let currentDay = selectedDate.getDay();
//     let currentDate = new Date(selectedDate);


//     let diff = (currentDay + 4) % 7;

//     selectedDate.setDate(currentDate.getDate() - diff);
//     selectedDate.setHours(hours, minutes, seconds, 0);
//     selectedDate.getDate();


//     this.formSubmitted = true;
//     if (!this.IsShift) {
//       this.errorMessage = 'Cannot save schedule: Employee is marked as unavailable to work.';
//       this.formSubmitted = false;
//       setTimeout(() => {
//         window.location.reload();
//       }, 1800);
//       return;

//     }
//     const isShift = this.scheduleForm.get('IsShift').value ? 1 : 0;
//     const data = {
//       ScheduleID: this.ScheduleID,
//       EmployeeID: this.scheduleDetails.employeeID,
//       WeekDayID: this.scheduleDetails.weekDayID,
//       ProfileID: parseInt(this.selectedProfile),
//       ProjectID: parseInt(this.ProjectID),
//       IsShift: this.IsShift ? 1 : 0,
//       InTime: this.InTime,
//       OutTime: this.OutTime,
//       WeekStartDate: selectedDate.toISOString()
//     };

//     var observable = this.http.post(`${this.url}/api/EmployeeScheduleController/SaveUpdateSchedule`, data);
//     observable.subscribe(
//       (res: any) => {
//         debugger
//         this.ScheduleID = res.scheduleID;

//         this.formSubmitted = false;

//         if (res.status === 1) {
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: res.message
//           });
//         } else if (res.status === 2) {
//           this.messageService.add({
//             severity: 'info',
//             summary: 'Updated',
//             detail: res.message
//           });
//         } else {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: res.message
//           });
//         }

//         this.FetchEmployeeDetails(this.selectedDate, this.UserID);
//         setTimeout(() => {
//           window.location.reload();
//         }, 1800);
//       },
//       (error) => {
//         console.error('Error saving schedule:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'An error occurred while saving the schedule.'
//         });
//         this.formSubmitted = false;
//       }
//     );

//     this.closeDialog();
//   }


//   onDateSelect(selectedDate: Date) {

//     if (!this.validDates.some(date => date.getTime() === selectedDate.getTime())) {
//       alert("Please select a valid week start date (Wednesday).");
//       this.selectedDate = this.validDates[1];
//     } else {
//       this.selectedDate = selectedDate;
//       this.weekdayList = this.getWeekEndDate(this.selectedDate);
//       this.scheduleForm.get('WeekStartDate').setValue(this.formatDate(this.selectedDate));
//     }

//     this.FetchEmployeeDetails(this.selectedDate, this.UserID);
//   }

//   getWeekEndDate(date: Date): any[] {

//     if (!date || isNaN(date.getTime())) {
//       console.error('Invalid date provided:', date);
//       return [];
//     }

//     let weekdays = [];
//     let currentDay = date.getDay();
//     let currentDate = new Date(date);

//     // Calculate the difference to get the previous Wednesday
//     let diff = (currentDay + 4) % 7;
//     currentDate.setDate(currentDate.getDate() - diff);

//     // Add the weekdays from Wednesday to the next Tuesday
//     for (let i = 0; i < 7; i++) {
//       let day = new Date(currentDate);
//       day.setDate(currentDate.getDate() + i);
//       weekdays.push({ date: day, weekDayID: i, weekDayName: this.weekdays[i] });
//     }
//     return weekdays;
//   }

//   DeleteSchedule(ScheduleID: number) {

//     var observable = this.http.get(`${this.url}/api/EmployeeScheduleController/DeleteSchedule/${this.ScheduleID}`);
//     observable.subscribe(
//       (res: any) => {

//         console.log("res", res);
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: res.message
//         })
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);

//       },
//       (error) => {
//         console.error('Error', error);
//         alert('Error. Please try again.');
//       }
//     );
//   }
// }
