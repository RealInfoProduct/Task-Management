import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  chalanData:any;
  invoiceData : any;


  constructor() { }

  //  For menu status and index manage 
  public menuStatusObservable$ = new BehaviorSubject<any>(false);

  setValue(value:any){
    this.menuStatusObservable$.next(value);
    localStorage.setItem('menuStatus',JSON.stringify(value))
  }

  public iconindex = new BehaviorSubject<any>('');
  iconActiveIconIndex$ = this.iconindex.asObservable();

  seticonActiveIndex(value:any){
    this.iconindex.next(value);
  }


  // For language Translate
  public language = new BehaviorSubject<any>('');

  setLanguage(value:any){
    this.language.next(value);
  }

  // Chalan Data transfer to chalan-master component to chalan-invoice component
  setChalanData(value : any){
    this.chalanData = value
  }

  getChalanData(){
    return this.chalanData
  }

  // Invoice Data transfer to invoice-master component to final-invoice component

  setInvoiceData(value : any){
    this.invoiceData = value
  }

  getInvoiceData(){
    return this.invoiceData
  }
}
