import { Routes } from '@angular/router';
import { BidderComponent } from './PlatformDesk/bidder/bidder.component';
import { LoginComponent } from './PlatformDesk/login/login.component';
import { RegisterComponent } from './PlatformDesk/login/register/register.component';
import { AddBidderComponent } from './PlatformDesk/bidder/add-bidder/add-bidder.component';
import { BonusincentiveComponent } from './PlatformDesk/bonusincentive/bonusincentive.component';
import { ClientComponent } from './PlatformDesk/client/client.component';
import { AddclientComponent } from './PlatformDesk/client/addclient/addclient.component';
import { DepartmentComponent } from './PlatformDesk/department/department.component';
import { AdddepartmentComponent } from './PlatformDesk/department/adddepartment/adddepartment.component';
import { DrsComponent } from './PlatformDesk/drs/drs.component';
import { EmployeeComponent } from './PlatformDesk/employee/employee.component';
import { AddEmployeeComponent } from './PlatformDesk/employee/add-employee/add-employee.component';
import { PlatformComponent } from './PlatformDesk/platform/platform.component';
import { AddplatformComponent } from './PlatformDesk/platform/addplatform/addplatform.component';
import { PlatformProfileComponent } from './PlatformDesk/platform-profile/platform-profile.component';
import { ProjectComponent } from './PlatformDesk/project/project.component';
import { ProjectDetailsComponent } from './PlatformDesk/project-details/project-details.component';
import { AddProfileComponent } from './PlatformDesk/platform-profile/add-profile/add-profile.component';
import { AddprofileComponent } from './PlatformDesk/bidder-profile/addprofile/addprofile.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'bidder',
        component: BidderComponent
    },
    {
        path: 'add-bidder',
        component: AddBidderComponent
    },
    {
        path: 'add-bidder/:bidderID',
        component: AddBidderComponent
    },
    {
        path: 'client',
        component: ClientComponent
    },
    {
        path: 'add-client',
        component: AddclientComponent
    },
    {
        path: 'add-client/:clientID',
        component: AddclientComponent
    },
    {
        path: 'bonusincentive',
        component: BonusincentiveComponent
    },
    {
    path: 'department',
    component: DepartmentComponent
  },
  {
    path: 'adddepartment',
    component: AdddepartmentComponent
  },
  {
    path: 'adddepartment/:departmentID',
    component: AdddepartmentComponent
  },
  {
    path: 'drs',
    component: DrsComponent
  },
  {
    path: 'employee',
    component: EmployeeComponent
  },
  {
    path: 'addemployee',
    component: AddEmployeeComponent
  },
  {
    path: 'addemployee/:employeeID',
    component: AddEmployeeComponent
  },
  {
    path: 'platform',
    component: PlatformComponent
  },
  {
    path: 'addplatform',
    component: AddplatformComponent
  },
  {
    path: 'platformprofile',
    component: PlatformProfileComponent
  },
  {
    path: 'addplatformprofile',
    component: AddProfileComponent
  },
  {
    path: 'addplatform/:platformID',
    component: AddplatformComponent
  },
  {
    path: 'addplatformprofile/:profileID',
    component: AddProfileComponent
  },
  {
    path: 'project',
    component: ProjectComponent
  },
  {
    path: 'projectdetail',
    component: ProjectDetailsComponent
  },
    {
      path: 'project/:projectID',
      component: ProjectComponent
  },
];
