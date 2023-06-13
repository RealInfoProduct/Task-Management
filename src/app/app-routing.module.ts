import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AuthGuard } from './auth-gaurd/auth.guard';
import { AuthGuardService } from './service/auth-guard.service';
import { TaskMasterComponent } from './web/task-master/task-master.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent,
  },
  {
    path:'registration',
    component:RegistrationComponent,
  }, 
  {
    path:'admin-panel',
    component:AdminPanelComponent
  },
  {
    path: 'web',
    loadChildren: () => import('./web/web.module').then(m => m.WebModule),
    // canActivate: [ AuthGuardService ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
