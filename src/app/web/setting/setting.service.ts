import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

  addSetting(payload:any){ 
    // return this.apiService.post(Apiconstants.CREATE_SETTING, payload)
  }

  getSetting(){
    // return this.apiService.get(Apiconstants.GET_SETTING)
  }
}
