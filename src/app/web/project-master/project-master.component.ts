import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectList } from 'src/app/interface/AuthResponse';
import { FirebaseService } from 'src/app/service/firebase.service';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent implements OnInit {

  projectList: any
  isEdit: any
  selectedTechnology: any
  technologyList: any
  pointOfContact: any
  projectName: any
  isLoading: boolean = false
  projectId:any
  technologyName:any

  constructor(private firebaseService: FirebaseService,
    private messageService:MessageService,
    private firebaseSerive:FirebaseService,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.getAllTechnology()
    this.getAllProjectList()   

  }

  addProject() {
    this.pointOfContact = ''
    this.projectName = ''
    this.selectedTechnology = ''
    this.projectId = ''
  }
  submit() {
    const payload : ProjectList = {
      id: this.projectId ? this.projectList : '',
      pointOfContact : this.pointOfContact,
      projectName : this.projectName,
      selectedTechnology : this.selectedTechnology,
      
    }
    if(!this.projectId){
      this.isLoading = true
      this.firebaseSerive.addProjectList(payload).then((res:any) => {
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data Add Successfully..',
          life: 1500,
        });
      this.isLoading = false
      })
    } else {
      this.firebaseSerive.updateProjectList(this.projectId,payload).then((res:any) => {
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
  editProject(item: any) {
    this.projectId = item.id
    this.pointOfContact = item.pointOfContact
    this.projectName = item.projectName
    this.selectedTechnology = item.selectedTechnology
  }

  deleteProject(item: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseSerive.deleteProjectList(item).then(res => {
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
      this.projectList.forEach((element:any) => {
          element['techStacks'] = element.selectedTechnology.map((id : any ) => id.technologyName).join(", ")
      });
      this.isLoading = false
    })
  }
}
