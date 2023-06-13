import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { msgType } from 'src/assets/constant/message';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  isOpenSetting:boolean = false;
  fullscreen:boolean = false
  elem :any
  noOfMachine:any
  light:any
  bhadu:any
  checked:boolean = true
  accountYear:any
  yearBase = 2000;
  getAccountYear:any
  currentYear:any
  financialYear:any
  accountYearList:any = [];
  settingList :any
  settingId:any


  constructor( private service : SettingService,
               private messageService: MessageService) { }

  ngOnInit(): void {

    }


  
  clickedOutside(){
    this.isOpenSetting = false
  }

}
