import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectRoleList } from 'src/app/interface/AuthResponse';
import { FirebaseService } from 'src/app/service/firebase.service';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.scss']
})
export class RoleMasterComponent implements OnInit {

  isEdit: boolean = false
  isLoading: boolean = false
  ProjectRole :any
  ProjectRoleId :any

  ProjectRoleList = []

  constructor(private firebaseSerive:FirebaseService,
    private messageService : MessageService,
    private confirmationService :ConfirmationService,) { }

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData(){
    this.isLoading = true
    this.firebaseSerive.getProjectRoleList().subscribe((res:any) => {
      this.ProjectRoleList = res
      this.isLoading = false

    })
  }

  submit() : void {
    const payload : ProjectRoleList = {
      id: this.ProjectRoleId ? this.ProjectRoleId :'',
      ProjectRoleName: this.ProjectRole
    }
    if(!this.ProjectRoleId){
      this.isLoading = true
      this.firebaseSerive.addProjectRoleList(payload).then((res:any) => {
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data Add Successfully..',
          life: 1500,
        });
      this.isLoading = false
      })
    } else {
      this.firebaseSerive.updateProjectRoleList(this.ProjectRoleId,payload).then((res:any) => {
        this.isLoading = true
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data Update Successfully..',
          life: 1500,
        });
        this.isLoading = false
      })
    }

  }

  addProjectRole() : void {
    this.ProjectRole = ''
    this.ProjectRoleId = ''
    this.isEdit = false
  }

  editProjectRole(item:any) : void {
    this.isEdit = true
    this.ProjectRole = item.ProjectRoleName
    this.ProjectRoleId = item.id 
  }

  deleteProjectRole(item:any) : void { 
    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseSerive.deleteProjectRoleList(item).then(res => {
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

}
