import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FirebaseService } from 'src/app/service/firebase.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  emaployeeList: any
  projectList: any
  technologyList: any
  isLoading : boolean = false

  constructor(private router: Router,
    private messageService: MessageService, private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getTechnologyList().subscribe((res: any) => {
      this.isLoading = true
      this.technologyList = res.length
    })

    this.firebaseService.getProjectList().subscribe((res: any) => {
      this.projectList = res.length
    })

    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.emaployeeList = res.length
      this.isLoading = false
    })


  }
}



