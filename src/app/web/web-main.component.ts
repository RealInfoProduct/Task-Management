import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-web-main',
  templateUrl: './web-main.component.html',
  styleUrls: ['./web-main.component.scss']
})
export class WebMainComponent implements OnInit {

  sideNavStatus:boolean = false

  constructor( private service:CommonService ) { }

  ngOnInit(): void {
    
    this.service.menuStatusObservable$.subscribe((res) => {
      if(res){
        this.sideNavStatus = res.status
      }
  })

  }

}
