import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import * as moment from 'moment';
import { UserList } from 'src/app/interface/AuthResponse';
import { MessageService } from 'primeng/api';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  companyList: any;
  totalCompanyInactive: any;
  totalCompanyActive: any;
  totalCompany: any;
  isLoading: boolean = false
  recodeStaus: any
  editUserItem: any
  editUserList: any;
  date: any;

  constructor(private firebaseService: FirebaseService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getCompanyList()
  }

  getCompanyList() {
    this.firebaseService.getAllCompanyList().subscribe((res: any) => {
      this.isLoading = true
      this.companyList = res
      this.totalCompany = this.companyList.length
      this.totalCompanyActive = this.companyList.filter((id: any) => id.status === 'active').length
      this.totalCompanyInactive = this.companyList.filter((id: any) => id.status !== 'active').length
      this.companyList.forEach((ele: any, index: number) => {
        ele['boolean'] = ele.status == 'active' ? true : false
      })
      
    })
      this.isLoading = false
  }
  editUserData(item: any) {
    this.editUserItem = item?.boolean
    this.editUserList = item;
    this.date = moment(item.endDate).toDate()
  }

  recodeStausChange(event: any) {
    this.recodeStaus = event.checked
  }



  submit() {
    this.isLoading = true
    const newdate = moment(this.date).format('YYYY-MM-DD')
    const payload: UserList = {
      id: this.editUserList.id,
      companyName: this.editUserList.companyName,
      companyLogo: this.editUserList.companyLogo,
      email: this.editUserList.email,
      password: this.editUserList.password,
      mobileNumber: this.editUserList.mobileNumber,
      status: this.recodeStaus ? 'active' : 'inactive',
      endDate: newdate,
      userRole: 'user',
    }
    this.firebaseService.updateCompanyData(this.editUserList?.id, payload).then((res: any) => {
      this.messageService.add({
        severity: msgType.success,
        summary: 'Success',
        detail: `User Update Successfully..`,
        life: 1500,
      });
      this.isLoading = false
    })
  }
}
