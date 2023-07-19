import { Component, HostListener } from '@angular/core';
import { CommonService } from './service/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TMS';

  constructor(private service:CommonService){}

  ngOnInit(){
    if(localStorage.getItem("iconActiveIndex") === null){
      localStorage.setItem('iconActiveIndex' , JSON.stringify({index:0,name:'Dashboard'}))
    }

    this.service.setLanguage('en')

    const menuStatusList:any = localStorage.getItem("menuStatus")
    const menuStatus  = JSON.parse(menuStatusList)
    this.service.setValue(menuStatus)

    const iconActiveIndex:any = localStorage.getItem("iconActiveIndex")
    const iconactiveLinkIndex  = JSON.parse(iconActiveIndex)
    this.service.seticonActiveIndex(iconactiveLinkIndex)
     }

    //  @HostListener('window:beforeunload', ['$event'])
    //  handleBeforeUnload(event: Event) {
    //    localStorage.clear(); 
    //  }
}
