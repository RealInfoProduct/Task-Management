import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexAnnotations,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexFill,
} from "ng-apexcharts";
import { MessageService } from 'primeng/api';
import { from, mergeMap, of } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions:ApexPlotOptions
};

export type ChartOptionPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  fill:ApexFill
};
export type ChartOptionCandle = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public chartOptions: Partial<ChartOptions> | any;
  public ChartOptionPie: Partial<ChartOptionPie> | any;
  public ChartOptionCandle: Partial<ChartOptionCandle> | any;
  data:any = ['ab' ,'cd' , 'ef'];

  constructor(private router:Router, 
              private messageService: MessageService,)  {}

  ngOnInit(): void {
    // const arr = from([
    //   {
    //     name: 'Manish',
    //     Age: 24
    //   },
    //   {
    //     name: 'Sahil',
    //     Age: 23
    //   },
    //   {
    //     name: 'keval',
    //     Age: 50
    //   }
    // ])

    // arr.pipe(
    //   mergeMap((res,index) => this.getAllData(res,index))
    // ).subscribe(response => {
    //   console.log('sds----',response);
    // });
  }

  getAllData(res:any,index:number){
    // return of({...res , surname : 'Savaliya', dummy: this.data[index]})
  }

}



 