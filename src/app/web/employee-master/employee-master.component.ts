import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmaployeeList } from 'src/app/interface/AuthResponse';
import { FirebaseService } from 'src/app/service/firebase.service';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {

  isEdit: any
  isLoading: boolean = false
  employeeList: any
  selectedTechnology: any
  technologyList: any
  projectList: any
  emaployeeForm: any = FormGroup;
  employeeId: any

  projectRoleList: any

  roleList: any = [
    {
      roleName: 'frontend',

    },
    {
      roleName: 'backend',

    }
  ]

  statusList: any = [
    {
      status: 'active'

    },
    {
      status: 'inactive'

    }
  ]

  constructor(private firebaseService: FirebaseService,
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.buildForm()
    this.getAllTechnology()
    this.getAllProjectList()
    this.getAllEmployeeList()
    this.getPeojectRole()
  }

  buildForm(): void {
    this.emaployeeForm = this.formbuilder.group({
      emaployeeName: [''],
      emaployeeMobile: [''],
      emaployeeEmail: [''],
      emaployeeUserName: [''],
      emaployeePassword: [''],
      selectEmployeeRole: [''],
      selectEmployeeTechnology: [''],
      selectEmployeeStatus: [''],
      selectProject: [''],
      selectProjectRole: [''],
    })
  }

  submit() {
    const payload: EmaployeeList = {
      id: this.employeeId ? this.employeeId : '',
      emaployeeName: this.emaployeeForm.value.emaployeeName,
      emaployeeMobile: this.emaployeeForm.value.emaployeeMobile,
      emaployeeEmail: this.emaployeeForm.value.emaployeeEmail,
      emaployeeUserName: this.emaployeeForm.value.emaployeeUserName,
      emaployeePassword: this.emaployeeForm.value.emaployeePassword,
      selectEmployeeRole: this.emaployeeForm.value.selectEmployeeRole.roleName,
      selectEmployeeTechnology: this.emaployeeForm.value.selectEmployeeTechnology,
      selectEmployeeStatus: this.emaployeeForm.value.selectEmployeeStatus.status,
      selectProject: this.emaployeeForm.value.selectProject,
      selectProjectRole: this.emaployeeForm.value.selectProjectRole,
    }

    if (!this.employeeId) {
      this.isLoading = true
      this.firebaseService.addEmaployeeList(payload).then((res: any) => {
        this.messageService.add({
          severity: msgType.success,
          summary: 'Sucess',
          detail: 'Data Add Successfully..',
          life: 1500,
        });
        this.isLoading = false
      })
    } else {
      this.firebaseService.updateEmaployeeList(this.employeeId, payload).then((res: any) => {
        this.isLoading = true
        this.messageService.add({
          severity: msgType.success,
          summary: 'Sucess',
          detail: 'Data Update Successfully..',
          life: 1500,
        });
        this.isLoading = false
      })
    }

  }

  addEmployee() {
    this.emaployeeForm.reset()
  }

  editEmployee(item: any) {
    this.employeeId = item.id
    this.emaployeeForm.controls.emaployeeName.setValue(item.emaployeeName)
    this.emaployeeForm.controls.emaployeeMobile.setValue(item.emaployeeMobile)
    this.emaployeeForm.controls.emaployeeEmail.setValue(item.emaployeeEmail)
    this.emaployeeForm.controls.emaployeeUserName.setValue(item.emaployeeUserName)
    this.emaployeeForm.controls.emaployeePassword.setValue(item.emaployeePassword)
    this.emaployeeForm.controls.selectEmployeeRole.setValue(item.selectEmployeeRole)
    this.emaployeeForm.controls.selectEmployeeStatus.setValue(item.selectEmployeeStatus)
    this.emaployeeForm.controls.selectProjectRole.setValue(item.selectProjectRole)
    this.emaployeeForm.controls.selectEmployeeTechnology.setValue(item.selectEmployeeTechnology)
    this.emaployeeForm.controls.selectProject.setValue(item.selectProject)

  }

  deleteEmployee(item: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseService.deleteProjectList(item).then(res => {
          this.messageService.add({
            severity: msgType.success,
            summary: 'Sucess',
            detail: 'Data Delete Successfully..',
            life: 1500,
          });
          this.isLoading = false
        })
      }
    })
  }
  getAllTechnology() {
    this.isLoading = true
    this.firebaseService.getTechnologyList().subscribe((res: any) => {
      this.technologyList = res
      this.isLoading = false
    })
  }

  getAllProjectList() {
    this.isLoading = true
    this.firebaseService.getProjectList().subscribe((res: any) => {
      this.projectList = res
      this.isLoading = false
    })
  }

  getAllEmployeeList() {
    this.isLoading = true
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.employeeList = res
      this.employeeList.forEach((element: any) => {
        element['selectProjectRoleEle'] = element.selectProjectRole.ProjectRoleName
        element['selectEmployeeTechnologyEle'] = element.selectEmployeeTechnology.map((id: any) => id.technologyName).join(", ")
        element['selectProjectEle'] = element.selectProject.map((id: any) => id.projectName).join(", ")

      });
      this.isLoading = false
    })
  }

  getPeojectRole() {
    this.isLoading = true
    this.firebaseService.getProjectRoleList().subscribe( res => {
      this.projectRoleList = res
      this.isLoading = false
    })
  }

}
