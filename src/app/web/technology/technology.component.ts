import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TechnologyList } from 'src/app/interface/AuthResponse';
import { FirebaseService } from 'src/app/service/firebase.service';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {



  isEdit: boolean = false
  isLoading: boolean = false
  technology :any
  technologyId :any

  technologyList = []

  constructor(private firebaseSerive:FirebaseService,
    private messageService : MessageService,
    private confirmationService :ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData(){
    this.isLoading = true
    this.firebaseSerive.getTechnologyList().subscribe((res:any) => {
      this.technologyList = res
      this.isLoading = false

    })
  }

  submit() : void {
    const payload : TechnologyList = {
      id: this.technologyId ? this.technologyId :'',
      technologyName: this.technology
    }
    if(!this.technologyId){
      this.isLoading = true
      this.firebaseSerive.addTechnologyList(payload).then((res:any) => {
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data Add Successfully..',
          life: 1500,
        });
      this.isLoading = false
      })
    } else {
      this.firebaseSerive.updateTechnologyList(this.technologyId,payload).then((res:any) => {
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

  addTechnology() : void {
    this.technology = ''
    this.technologyId = ''
    this.isEdit = false
  }

  editTechnology(item:any) : void {
    this.isEdit = true
    this.technology = item.technologyName
    this.technologyId = item.id 
  }

  deleteTechnology(item:any) : void { 
    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseSerive.deleteTechnologyList(item).then(res => {
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
