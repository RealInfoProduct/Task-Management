import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../web/dashboard/dashboard.component';
import { WebMainComponent } from './web-main.component';
import { TechnologyComponent } from './technology/technology.component';
import { ProjectMasterComponent } from './project-master/project-master.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EmployeeAdminComponent } from './employee-admin/employee-admin.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { TaskMasterComponent } from './task-master/task-master.component';

const routes: Routes = [{
  path: '',
  component: WebMainComponent,

  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'technology',
     component : TechnologyComponent
    },
    {
      path: 'project-Master',
     component : ProjectMasterComponent
    },
    {
      path: 'employee-Master',
     component : EmployeeMasterComponent
    },
    {
      path: 'employee-admin',
     component : EmployeeAdminComponent
    },
    {
      path: 'role-master',
     component : RoleMasterComponent
    },
    {
      path:'task-master',
      component:TaskMasterComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
