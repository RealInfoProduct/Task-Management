import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRoutingModule } from './web-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SettingComponent } from './setting/setting.component';
import { WebMainComponent } from './web-main.component';
import { TechnologyComponent } from './technology/technology.component';
import { ProjectMasterComponent } from './project-master/project-master.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EmployeeAdminComponent } from './employee-admin/employee-admin.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { TaskMasterComponent } from './task-master/task-master.component';


@NgModule({
  declarations: [
    WebMainComponent,
    SettingComponent,
    TechnologyComponent,
    ProjectMasterComponent,
    EmployeeMasterComponent,
    EmployeeAdminComponent,
    RoleMasterComponent,
    TaskMasterComponent,
  ],
  imports: [
    CommonModule,
    WebRoutingModule,
    SharedModule,
  ]
})
export class WebModule { }
