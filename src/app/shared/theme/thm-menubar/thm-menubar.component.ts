import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/service/common.service';


@Component({
  selector: 'app-thm-menubar',
  templateUrl: './thm-menubar.component.html',
  styleUrls: ['./thm-menubar.component.scss']
})
export class ThmMenubarComponent implements OnInit {
  
  menuList:any = [
    {
      // icon:'../../../../assets/menubarIcon/home.svg',
      icon:'ri-home-5-line ri-lg',
      name:'Dashboard',
      url:'/web/dashboard',
      children : [
        {
          name:'Dashboard',
          url:'/web/dashboard',
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/book.svg',
      icon:'ri-cpu-line ri-lg',
      name:'Technology',
      url:'/web/technology',
      children : [
        {
          name:'Technology',
          url:'/web/technology',
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/book.svg',
      icon:'ri-file-copy-2-line ri-lg',
      name:'Project Master',
      url:'/web/project-Master',
      children : [
        {
          name:'Project Master',
          url:'/web/project-Master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/users.svg',
      icon:'ri-user-add-line ri-lg',
      name:'Employee Master',
      url:'/web/employee-Master',
      children : [
        {
          name:'Employee Master',
          url:'/web/employee-Master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/command.svg',
      icon:'ri-stack-line ri-lg',
      name:'Role',
      url:'/web/role-master',
      children : [
        {
          name:'Role Master',
          url:'/web/role-master'
        },
      ],
    },
    {
      // icon:'../../../../assets/menubarIcon/package.svg',
      icon:'ri-profile-line ri-lg',
      name:'Task Master',
      url:'/web/task-master',
      children : [
        {
          name:'Task Master',
          url:'/web/task-master'
        },
      ],
    },
    // {
    //   // icon:'../../../../assets/menubarIcon/layers.svg',
    //   icon:'ri-file-copy-2-line ri-lg',
    //   name:'Invoice',
    //   url:'/web/invoice-master',
    //   children : [
    //     {
    //       name:'Invoice',
    //       url:'/web/invoice-master'
    //     },
    //     {
    //       name:'Invoice List',
    //       url:'/web/invoice-list'
    //     },
    //   ],
    // },
    // {
    //   // icon:'../../../../assets/menubarIcon/copy.svg',
    //   icon:'ri-user-add-line ri-lg',
    //   name:'Attendance',
    //   url:'/web/add-employee',
    //   children : [
    //     {
    //       name:'Add Employee',
    //       url:'/web/add-employee'
    //     },
    //     {
    //       name:'Bonus & Attendance List',
    //       url:'/web/bonus-attendance'
    //     },
    //     {
    //       name:'Report',
    //       url:'/web/report'
    //     },
    //   ],
    // },
    // {
    //   // icon:'../../../../assets/menubarIcon/file-text.svg',
    //   icon:'ri-bank-line ri-lg',
    //   name:'Account',
    //   url:'/web/company-account',
    //   children : [
    //     {
    //       name:'Company Account',
    //       url:'/web/company-account'
    //     },
    //     {
    //       name:'Expenses List',
    //       url:'/web/expenses-list'
    //     },
    //     {
    //       name:'Income List',
    //       url:'/web/income-list'
    //     },
    //     {
    //       name:'Passbook',
    //       url:'/web/passbook-list'
    //     },
    //   ],
    // },
    // {
    //   // icon:'../../../../assets/menubarIcon/map-pin.svg',
    //   icon:'ri-calculator-line ri-lg',
    //   name:'Daman Costing',
    //   url:'/web/daman-costing',
    //   children : [
    //     {
    //       name:'Daman Costing',
    //       url:'/web/daman-costing'
    //     },
    //     {
    //       name:'Maintenance Masters',
    //       url:'/web/maintenance-master'
    //     },
    //   ],
    // },
    {
      // icon:'../../../../assets/menubarIcon/share-2.svg',
      icon:'ri-logout-box-r-line ri-lg',
      name:'Logout',
      url:'#',
      children : [
        // {
        //   name:'Change Password',
        //   url:'#'
        // },
        {
          name:'Logout',
          url:'/login'
        },
      ],
    }
  ];

  menuIconList:any = []
  subMenuList:any = []

  menuListArr:any = []
  newMenuList:any = []
  activeLinkIndex:number = 0
  iconActiveIndex:number = 0
  isStatus : boolean  = true
  employeeId :any
  constructor( private service: CommonService ,private router: Router) {}
  
  ngOnInit(): void {
        this.service.iconActiveIconIndex$.subscribe((res) =>{
          const index = res?.index
          const name = res?.name
          this.isStatus = true
          this.iconActive(index,name)
        })
        this.service.language.subscribe((res)=>{
          if(res){
            // this.translateLan()
          }
        })
        this.employeeId = localStorage.getItem('employeeId');
          
        if(this.employeeId) {
          this.menuIconList.push(
            {
            icon:'ri-file-user-line ri-lg',
            name:'Employee Admin',
            url:'/web/employee-admin',
            children : [
              {
                name:'Employee Admin',
                url:'/web/employee-admin'
              },
            ],
          },
          {
            // icon:'../../../../assets/menubarIcon/share-2.svg',
            icon:'ri-logout-box-r-line ri-lg',
            name:'Logout',
            url:'#',
            children : [
              // {
              //   name:'Change Password',
              //   url:'#'
              // },
              {
                name:'Logout',
                url:'/login'
              },
            ],
          },    
          )
        } else {
          this.menuIconList = this.menuList;
        }
  }
 

  iconActive(index:any,item:any){
    this.iconActiveIndex = index
    const subMenu = this.menuIconList.find((id:any)=>id.name == item)
    this.subMenuList = subMenu?.children
    localStorage.setItem('iconActiveIndex' , JSON.stringify({index:this.iconActiveIndex , name:item}))
    if(this.isStatus){
      const menuStatusList:any = localStorage.getItem("menuStatus")
      const menuStatus  = JSON.parse(menuStatusList)
      this.service.setValue(menuStatus)
      this.isStatus = false
    }else{  
      this.service.setValue({status:false})
    }
  }

  logout(item:any){
    if(item.name === "Logout"){
      localStorage.clear()
      this.router.navigate(['/login'])
    }
  }

  }

