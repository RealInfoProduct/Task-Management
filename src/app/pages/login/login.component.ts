import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import * as moment from 'moment';
import { msgType } from 'src/assets/constant/message';
import { FirebaseService } from 'src/app/service/firebase.service';
import { EmaployeeList } from 'src/app/interface/AuthResponse';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword:boolean = false
  isLoading = false
  userList:any;
  employeeList:any;
  allCompanyEmployees  : any = [];
  matchedEmployee : any;

  constructor(private formBuilder: FormBuilder,
              private router:Router,
              private messageService: MessageService,
              private authService:AuthService,
              private firebaseService:FirebaseService
              ) { }

  ngOnInit(): void {
    this.buildForm()
    this.firebaseService.getAllCompanyList().subscribe((res: any) => {
      this.userList = res
    })

    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.employeeList = res
    })

  }

  buildForm():void{
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }


  submit() {

    if (this.employeeList.length > 0) {
      const employeeFind = this.employeeList.find((id:any) => id.emaployeeUserName === this.loginForm.value.email)
      this.isLoading = true
       if(employeeFind){
        if (employeeFind.emaployeeUserName === this.loginForm.value.email && employeeFind.emaployeePassword === this.loginForm.value.password && employeeFind.selectEmployeeStatus === "active") {
          this.allCompanyEmployees.push(employeeFind)
          const payload: EmaployeeList = {
            id: employeeFind.id,
            emaployeeName: employeeFind.emaployeeName,
            emaployeeMobile: employeeFind.emaployeeMobile,
            emaployeeEmail: employeeFind.emaployeeEmail,
            emaployeeUserName: employeeFind.emaployeeUserName,
            emaployeePassword: employeeFind.emaployeePassword,
            selectEmployeeRole: employeeFind.selectEmployeeRole,
            selectEmployeeTechnology: employeeFind.selectEmployeeTechnology,
            selectEmployeeStatus: employeeFind.selectEmployeeStatus,
            selectProject: employeeFind.selectProject,
            selectProjectRole: employeeFind.selectProjectRole,
            avatarName: employeeFind.avatarName,
            isActive: 'online'
          }

          this.firebaseService.updateEmaployeeList(employeeFind.id, payload).then((res: any) => {

          })
          localStorage.setItem('employeeId', employeeFind.id)
          this.router.navigate(['web/employee-admin'])
        }  
        else if (employeeFind.emaployeeUserName === this.loginForm.value.email && employeeFind.emaployeePassword === this.loginForm.value.password && employeeFind.selectEmployeeStatus === "inactive") {
          this.messageService.add({
            severity: msgType.error,
            summary: 'Error',
            detail: 'Account not activetd',
            life: 1500,
          });
        } 
       } else {
        this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe((res) => {
          if (res) {
            const setItem = this.userList.find((id: any) => id.email === this.loginForm.value.email)
            const date1 = moment(setItem.endDate);
            const date2 = moment();
            if (date2.isBefore(date1) && setItem.status === 'active' && setItem.userRole === 'user') {
              localStorage.setItem('companyId', setItem.id)
              this.router.navigate(['web/dashboard'])
            }
            else {
              this.messageService.add({
                severity: msgType.error,
                summary: 'Error',
                detail: 'Account not activetd',
                life: 1500,
              });
            }
            this.isLoading = false
          }
        }, (error) => {
          this.messageService.add({
            severity: msgType.error,
            summary: 'Error',
            detail: error.error.error.message,
            life: 1500,
          });
          this.isLoading = false
        })
       }
       this.isLoading = false
    }

  }

}
