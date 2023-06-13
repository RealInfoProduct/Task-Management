import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThmHeaderComponent } from './theme/thm-header/thm-header.component';
import { ThmMenubarComponent } from './theme/thm-menubar/thm-menubar.component';


/**************** Prime-NG Content Import Here ******************/

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import {ConfirmationService, MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {RadioButtonModule} from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ProgressBarModule} from 'primeng/progressbar'
import {InputSwitchModule} from 'primeng/inputswitch';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {DialogModule} from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import { SpinnerComponent } from '../pages/spinner/spinner.component';
import { DragulaModule } from 'ng2-dragula';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

const PRIME_NG = [
  CalendarModule,
  DropdownModule,
  TableModule,
  ToastModule,
  ConfirmDialogModule,
  MultiSelectModule,
  ButtonModule,
  TableModule,
  ProgressSpinnerModule,
  RadioButtonModule,
  AutoCompleteModule,
  SelectButtonModule,
  ProgressBarModule,
  InputSwitchModule,
  DialogModule,
  TabViewModule,
  DragulaModule.forRoot(),
  AvatarModule,
  AvatarGroupModule
  // ScrollPanelModule,
 
]


@NgModule({
  declarations: [
    ThmHeaderComponent,
    ThmMenubarComponent,
    SpinnerComponent
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule,
    PRIME_NG,
    TranslateModule,
  ],
  
  exports:[
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    ThmHeaderComponent,
    ThmMenubarComponent,
    SpinnerComponent,
    PRIME_NG,
    TranslateModule

  ],

  providers: [MessageService,PrimeNGConfig,ConfirmationService],
})
export class SharedModule { }
