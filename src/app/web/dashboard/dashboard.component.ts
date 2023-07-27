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
import { FirebaseService } from 'src/app/service/firebase.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions
};

export type ChartOptionPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill
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
  data: any = ['ab', 'cd', 'ef'];
  emaployeeList: any
  projectList: any
  technologyList: any

  constructor(private router: Router,
    private messageService: MessageService, private firebaseService: FirebaseService) { }

  ngOnInit(): void {

    this.firebaseService.getTechnologyList().subscribe((res: any) => {
      this.technologyList = res.length
    })

    this.firebaseService.getProjectList().subscribe((res: any) => {
      this.projectList = res.length
    })

    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.emaployeeList = res.length
    })


  }
}



