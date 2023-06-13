import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import * as moment from 'moment';
import { msgType } from 'src/assets/constant/message';
import { FirebaseService } from 'src/app/service/firebase.service';


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
  CompanyLogin : boolean = false

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
    
    // this.isLoading = true
    // this.firebaseService.getAllCompanyList().subscribe(res => {
    //   this.isLoading = true
    //   res?.forEach((element:any) => {
    //     this.firebaseService.getEmaployeeLoginList(element.id).subscribe((emaployeeRes => {
    //     if(emaployeeRes.length > 0){
    //       this.allCompanyEmployees.push(emaployeeRes)
    //       this.isLoading = false
    //      }
    //    }))
    //   })
    // })
  }

  buildForm():void{
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }


  submit() { 
    this.isLoading = true

    if(this.employeeList.length > 0){
        this.employeeList.forEach((element:any) => {
          if(element.emaployeeUserName === this.loginForm.value.email && element.emaployeePassword === this.loginForm.value.password && element.selectEmployeeStatus.status === "active" ) {
            this.allCompanyEmployees.push(element)
            localStorage.setItem('employeeId' ,element.id)
            this.router.navigate(['web/employee-admin'])
            this.CompanyLogin = true
          }
        })
    }

    if(!this.CompanyLogin){
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe((res) => {
        if(res){
            const setItem = this.userList.find((id: any) => id.email === this.loginForm.value.email)
            const date1 = moment(setItem.endDate);
            const date2 = moment();
            if(date2.isBefore(date1) && setItem.status === 'active' && setItem.userRole === 'user'){
              localStorage.setItem('companyId', setItem.id)
              this.router.navigate(['web/dashboard'])
            }
            else {
              this.messageService.add({
                severity: msgType.error,
                summary:'Error' ,
                detail: 'Account not activetd',
                life: 1500,
              });
            }
            this.isLoading = false
          }
        }, (error) => {
          this.messageService.add({
            severity: msgType.error,
            summary:'Error' ,
            detail: error.error.error.message,
            life: 1500,
          });
          this.isLoading = false
        })
    }

      this.isLoading = false
  }

}
