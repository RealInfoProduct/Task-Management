import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-employee-admin',
  templateUrl: './employee-admin.component.html',
  styleUrls: ['./employee-admin.component.scss']
})
export class EmployeeAdminComponent implements OnInit {

  employeeList:any
  constructor( private firebaseService :FirebaseService) { }

  ngOnInit(): void {
  this.firebaseService.getEmaployeeList().subscribe((res: any) => {
    this.employeeList = res
    this.employeeList.forEach((elementEmployee:any) => {
      if(elementEmployee.id === localStorage.getItem('employeeId')){
         elementEmployee['selectEmployeeRoleEle'] = elementEmployee.selectEmployeeRole.roleName
         elementEmployee['selectEmployeeTechnologyEle'] = elementEmployee.selectEmployeeTechnology.map((id: any) => id.technologyName).join(", ")
         elementEmployee['selectProjectEle'] = elementEmployee.selectProject.map((id: any) => id.projectName).join(", ")
       }  
     })
  })
  
}


}
