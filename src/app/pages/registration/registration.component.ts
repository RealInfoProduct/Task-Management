import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { companyList } from 'src/app/interface/AuthResponse';
import { AuthService } from 'src/app/service/auth.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { msgType } from 'src/assets/constant/message';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Storage} from "@angular/fire/storage";
import * as moment from 'moment';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  showPassword:boolean = false
  isLoading = false
  endData:any
  progress: number = 0;
  progressDone : any;
  uploadImageURL : string = '';
  progressData :any


  constructor(private formBuilder: FormBuilder,
              private router:Router,
              private authService: AuthService,
              private messageService:MessageService,
              private storage: Storage,
              private firebaseService:FirebaseService
              ) { }

  ngOnInit(): void {
    this.buildForm()
    const currentDate = moment();
    const newDate = currentDate.add(3, 'months');
    const formattedDate = newDate.format('YYYY-MM-DD');
    this.endData = formattedDate;
  }

  buildForm():void{
    this.registrationForm = this.formBuilder.group({
      companyLogo : [],
      companyName : [],
      email: ['',[ Validators.email]],
      password: [''],
      confirmpassword: [''],
      monileNumber : [],
    })
  }


  submit() { 
    this.authService.signUp(this.registrationForm.value.email, this.registrationForm.value.password).subscribe(
      (res) => {
          this.storageInImageStore()
          this.messageService.add({
            severity: msgType.success,
            summary:'Success' ,
            detail: `Your Email: ${res.email} Register Successfully.. Go to Loginpage...`,
            life: 1500,
          });
        },
        err => {
          this.messageService.add({
            severity: msgType.error,
            summary:'Error' ,
            detail: err.error.error.message,
            life: 1500,
          });
        this.isLoading = false
      })


  }

  fileChange(event:any){
    this.registrationForm.controls['companyLogo'].setValue(event.target.files[0]);
  }

  
  storageInImageStore(){
    this.isLoading = true;
    const storageRef = ref(this.storage, `${this.registrationForm.value.companyName}/${this.registrationForm.value.companyLogo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, this.registrationForm.value.companyLogo);
    uploadTask.on('state_changed',
      (snapshot) => {
         this.progress = Number(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0));
         setInterval(this.progressData, 130);
        console.log('Upload is ' + this.progress + '% done');
      },
      (error)=>{
        console.log('error---', error);
        this.isLoading = false
      },
         () => {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if(downloadURL){
            this.uploadImageURL = downloadURL
            const payload: companyList = {
              id: '',
              companyName: this.registrationForm.value.companyName,
              companyLogo: this.uploadImageURL,
              email: this.registrationForm.value.email,
              password: this.registrationForm.value.password,
              mobileNumber: this.registrationForm.value.monileNumber,
              status: 'inactive',
              endDate: this.endData,
              userRole:'user',
            }            
            this.firebaseService.addCompanyData(payload).then((res: any) => {
              if (res) {
              }
            })
            this.router.navigate(['/login'])
            this.isLoading = false;
          }
        });
      }
    )
  }
}
