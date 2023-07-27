import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EmaployeeList } from 'src/app/interface/AuthResponse';
import { CommonService } from 'src/app/service/common.service';
import { FirebaseService } from 'src/app/service/firebase.service';


@Component({
  selector: 'app-thm-menubar',
  templateUrl: './thm-menubar.component.html',
  styleUrls: ['./thm-menubar.component.scss']
})
export class ThmMenubarComponent implements OnInit {

  menuList: any = [
    {
      // icon:'../../../../assets/menubarIcon/home.svg',
      icon: 'ri-home-5-line ri-lg',
      name: 'Dashboard',
      url: '/web/dashboard',
      index: 1,
      children: [
        {
          name: 'Dashboard',
          url: '/web/dashboard',
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/book.svg',
      icon: 'ri-cpu-line ri-lg',
      name: 'Technology',
      url: '/web/technology',
      index: 2,
      children: [
        {
          name: 'Technology',
          url: '/web/technology',
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/book.svg',
      icon: 'ri-file-copy-2-line ri-lg',
      name: 'Project Master',
      url: '/web/project-Master',
      index: 3,
      children: [
        {
          name: 'Project Master',
          url: '/web/project-Master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/users.svg',
      icon: 'ri-user-add-line ri-lg',
      name: 'Employee Master',
      url: '/web/employee-Master',
      index: 4,
      children: [
        {
          name: 'Employee Master',
          url: '/web/employee-Master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/command.svg',
      icon: 'ri-stack-line ri-lg',
      name: 'Role',
      url: '/web/role-master',
      index: 5,
      children: [
        {
          name: 'Role Master',
          url: '/web/role-master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/package.svg',
      icon: 'ri-profile-line ri-lg',
      name: 'Task Master',
      url: '/web/task-master',
      index: 6,
      children: [
        {
          name: 'Task Master',
          url: '/web/task-master'
        },
      ],
    }
    // {
    //   // icon:'../../../../assets/menubarIcon/share-2.svg',
    //   icon: 'ri-logout-box-r-line ri-lg',
    //   name: 'Logout',
    //   url: '/login',
    // }
  ];

  subscription: any = []
  menuIconList: any = []
  subMenuList: any = []

  menuListArr: any = []
  newMenuList: any = []
  activeLinkIndex: number = 0
  iconActiveIndex: number = 0
  isStatus: boolean = true
  employeeId: any
  employeeIdFind : any;
  isLoading : boolean = false
  companyName :any
  companyLogo :any


  constructor(private service: CommonService, private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.service.iconActiveIconIndex$.subscribe((res) => {
      const index = res?.index
      const name = res?.name
      this.isStatus = true
      this.iconActive(index, name)
    })
    this.service.language.subscribe((res) => {
      if (res) {
        // this.translateLan()
      }
    })
    this.employeeId = localStorage.getItem('employeeId');
    this.isLoading = true
    if (this.employeeId) {
        const employeeDataFind = this.firebaseService.getEmaployeeList().subscribe((res:any) => {
          const findData = res.find((id:any) => id.id == this.employeeId)
          this.companyName = findData.emaployeeName.split(' ')[0]
          this.companyLogo = findData.avatarName
        })
      this.menuIconList.push(
        {
          icon: 'ri-file-user-line ri-lg',
          name: 'Employee Admin',
          url: '/web/employee-admin',
          index : 1,
          children: [
            {
              name: 'Employee Admin',
              url: '/web/employee-admin'
            },
          ],
        },
        {
          // icon:'../../../../assets/menubarIcon/package.svg',
          icon: 'ri-profile-line ri-lg',
          name: 'Task Master',
          url: '/web/task-master',
          index: 6,
          children: [
            {
              name: 'Task Master',
              url: '/web/task-master'
            },
          ],
        }
      )
    } else {
      const companyDataFind = this.firebaseService.getAllCompanyList().subscribe((res:any) => {
        this.isLoading = true
      const findData = res.find((id:any) => id.id == localStorage.getItem('companyId') )
      this.companyName = findData.companyName.split(' ')[0]
      this.companyLogo = findData.companyLogo
      this.isLoading = false

      })
      this.menuIconList = this.menuList;
    }
    this.isLoading = false


  }


  iconActive(index: any, item: any) {
    this.iconActiveIndex = index
    const subMenu = this.menuIconList.find((id: any) => id.name == item)
    this.subMenuList = subMenu?.children
    localStorage.setItem('iconActiveIndex', JSON.stringify({ index: this.iconActiveIndex, name: item }))
    if (this.isStatus) {
      const menuStatusList: any = localStorage.getItem("menuStatus")
      const menuStatus = JSON.parse(menuStatusList)
      this.service.setValue(menuStatus)
      this.isStatus = false
    } else {
      this.service.setValue({ status: false })
    }

    if (item === "Logout" && index == 0) {
      this.isLoading = true
      const employeeId = localStorage.getItem('employeeId')
      if (employeeId) {
        this.firebaseService.getEmaployeeList().subscribe((res: any) => {
          if (res && res.length > 0) {
            this.employeeIdFind = res.find((id: any) => id.id == employeeId)
          }
        })
        setTimeout(() => {
          if (this.employeeIdFind) {
            this.logOutClicked(this.employeeIdFind)
          }
        }, 100);
      } else {
        localStorage.clear()
        this.router.navigate(['/'])
      }
    }
  }

  logOutClicked(employeeDetails: any) {
    this.isLoading = true
    const payload: EmaployeeList = {
      id: employeeDetails.id,
      emaployeeName: employeeDetails.emaployeeName,
      emaployeeMobile: employeeDetails.emaployeeMobile,
      emaployeeEmail: employeeDetails.emaployeeEmail,
      emaployeeUserName: employeeDetails.emaployeeUserName,
      emaployeePassword: employeeDetails.emaployeePassword,
      selectEmployeeRole: employeeDetails.selectEmployeeRole,
      selectEmployeeTechnology: employeeDetails.selectEmployeeTechnology,
      selectEmployeeStatus: employeeDetails.selectEmployeeStatus,
      selectProject: employeeDetails.selectProject,
      selectProjectRole: employeeDetails.selectProjectRole,
      avatarName: employeeDetails.avatarName,
      isActive: 'offline'
    }
    this.firebaseService.updateEmaployeeList(employeeDetails.id, payload).then((res: any) => {
    })
    localStorage.clear()
    this.isLoading = false
    this.router.navigate(['/'])
  }
}

