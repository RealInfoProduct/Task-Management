import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { FirebaseService } from 'src/app/service/firebase.service';
import * as moment from 'moment';
import { TaskList } from 'src/app/interface/AuthResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { msgType } from 'src/assets/constant/message';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
  styleUrls: ['./task-master.component.scss']
})
export class TaskMasterComponent implements OnInit {

  isEdit: boolean = false
  isLoading: boolean = false
  taskForm! : FormGroup
  taskReady :any = []
  taskInProgress :any = []
  taskTesting :any = []
  taskDone :any = []
  filterInfluencerList:any = []
  employeeAvtars :any = []
  projectWiseEmployees :any = [];
  selectedIndex:any;
  public groups:Array<any> = [];
  taskTypeList :any = [
    {taskName:"Backend"},
    {taskName:"Frontend"},
    {taskName:"UX Designer"},
    {taskName:"UI Designer"},
  ]
  projectList: any
  employeeList: any;
  projectId: any
  employeeProjectList: any = []
  taskList :any;
  isUpdate = false; 
  selectProjectItem:any
  selectProjectId:any
  isSelectProjectFilter :boolean = false
  mainArry:any = []
  keyValue:any
  taskListLength :number = 0
  taskListTaskReadyLength :number = 0
  taskListInProgressLength :number = 0
  taskListTestingLength :number = 0
  taskListDoneLength :number = 0
  getProjectName :any
  employeeListArr :any
  taskEditId:any
  taskStatus:any


  constructor( private _ds : DragulaService, 
    private formbuilder :FormBuilder,
    private firebaseService:FirebaseService,
    private messageService :MessageService,
    private cdr : ChangeDetectorRef ,
    private confirmationService : ConfirmationService) { 
  }

   ngOnInit(): void {

    const name = 'MS';
    const randomColor = this.generateColor(name);
    const existingGroup = this._ds.find('COLUMNS');
    if (!existingGroup) {
      this._ds.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle:any) => handle.className === "group-handle"
      });
    }

    this._ds.dropModel().subscribe(async (args:any) => {
      this.isLoading = true
      let data = args.targetModel.filter((el:any) => Object.keys(el).length);
      const payload: TaskList = {
        id: args.item.id,
        taskDesc : args.item.taskDesc,
        employeeId : args.item.employeeId,
        taskTitle :args.item.taskTitle,
        taskType : args.item.taskType,
        taskStatus : data[0].taskStatus,
        taskProjectId : args.item.taskProjectId,
        taskDate : args.item.taskDate
      }

      this.firebaseService.updateTaskList(args.item.id,payload).then(res => {
        this.isUpdate = true;
        // this.cdr.detectChanges()
        setTimeout(() => {
         this.applyFilter(this.keyValue);  
        }, 100);
        // this.messageService.add({
        //   severity: msgType.success,
        //   summary:'Sucess',
        //   detail: 'Data UpDate Successfully..',
        //   life: 1500,
        // });
        this.isLoading = false
      })
    });
    
    this.buildForm()
    this.getAllProjectList();
    this.getAllEmployeeList();

    setTimeout(() => {
      if(!this.isUpdate){
        this.getAllTaskList()
      }
    }, 2000);
  }

  generateColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const minLightness = 80;
    const maxLightness = 90;
  
    const hue = Math.floor(Math.sin(hash++) * 360);
    const saturation = Math.floor(Math.sin(hash++) * 101);
    const lightness = Math.floor(Math.sin(hash++) * (maxLightness - minLightness + 1) + minLightness);
  
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    return color;
  }

  getAllProjectList() {
    this.isLoading = true
    this.firebaseService.getProjectList().subscribe((res: any) => {
      this.projectList = res;
      setTimeout(() => {
        this.selectProjectItem =  this.projectList[0]
        this.getEmployeesByProject(this.projectList[0].id)
        this.getAllTaskList()
      }, 150);
      this.isLoading = false;
    })
  }

  getAllEmployeeList() {
    this.isLoading = true
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.employeeListArr = res 
      this.employeeList = res 
      this.employeeProjectList = []
      res.forEach((element:any) => {
        element.selectProject.forEach((ele:any) => {
          if(ele.id === this.projectId) {
              this.employeeProjectList.push(element)
            }
        })
      });
      this.employeeList = this.employeeProjectList
      this.isLoading = false
    })
  }

  getAllTaskList() {
    this.isLoading = true
    let itemsIds
    this.firebaseService.getTaskList().subscribe((res: any) => {
      if(!this.isSelectProjectFilter){
        this.groups = [
          {
            name: 'Task Ready',
            items: [
              {taskStatus: "Task Ready"}
            ]
          },
          {
            name: 'In Progress',
            items: [
              {taskStatus: "In Progress"}
            ]
          },
          {
            name: 'Testing',
            items: [
              {taskStatus: "Testing"}
            ]
          },
          {
            name: 'Done',
            items: [
              {taskStatus: "Done"}
            ]
          }
        ];
        this.taskList = res.filter((id:any) => id.taskProjectId === this.projectList[0].id);
      } else {
        this.groups = [
          {
            name: 'Task Ready',
            items: [
              {taskStatus: "Task Ready"}
            ]
          },
          {
            name: 'In Progress',
            items: [
              {taskStatus: "In Progress"}
            ]
          },
          {
            name: 'Testing',
            items: [
              {taskStatus: "Testing"}
            ]
          },
          {
            name: 'Done',
            items: [
              {taskStatus: "Done"}
            ]
          }
        ];
        this.taskList = res.filter((id:any) => id.taskProjectId === this.selectProjectId);
      }    
      
      this.taskList.forEach((ele:any) => {
        let index = this.groups.findIndex(id => id.name === ele.taskStatus);
        itemsIds = this.groups[index].items.map((id:any) => id.id);
        if(index > -1 && !itemsIds.includes(ele.id)){
          this.groups[index]?.items.push(ele);
          const data = ele.employeeId.map((element:any) => {
             return this.employeeListArr?.find((id:any) => id.id === element).emaployeeName
          })
          ele['employeeName'] = data
        }
      })
      this.groups.forEach(ele => {
        ele.items?.forEach((element:any) => {
          if(JSON.stringify(element) != '{}' && element?.employeeName?.length > 0 ) {
            element.avatarName = []
             element?.employeeName.forEach((ele:any)=>{
                const data = ele.split(' ').map((ele:any) => ele?.charAt(0));
                if(data != undefined) {
                  element.avatarName.push([]?.concat(...data).join().replace(',','')) 
                }
            })
          }
        })
      })

      this.taskListLength = this.taskList.length
      this.taskListTaskReadyLength  = this.taskList.filter((id:any) => id.taskStatus === "Task Ready").length
      this.taskListInProgressLength  = this.taskList.filter((id:any) => id.taskStatus === "In Progress").length
      this.taskListTestingLength  = this.taskList.filter((id:any) => id.taskStatus === "Testing").length
      this.taskListDoneLength  = this.taskList.filter((id:any) => id.taskStatus === "Done").length
      this.isLoading = false
    })    
  }

  selectProject(event:any, id?: any){
    this.projectId = event.value ? event.value.id : id
    this.getAllEmployeeList()
 }

 
  buildForm(): void {
    this.taskForm = this.formbuilder.group({
      taskName: [''],
      taskDescription: [''],
      taskType: [''],
      taskProject: [''],
      taskEmployee: [''],
      taskDate: [moment().format('YYYY-MM-DD') ],
  })
}

  taskBorder(groupName:any){
    switch (groupName) {
      case 'Task Ready':
        return { 'border-bottom': '3px solid #000' };
        
      case 'In Progress':
        return { 'border-bottom': '3px solid #306bff' };

      case 'Testing':
        return { 'border-bottom': '3px solid #ffb57f' };

      case 'Done':
        return { 'border-bottom': '3px solid #78c552' };

      default:
        return {};
    }
  }

  taskTypes(type: any) {
    switch (type) {
      case 'Backend':
        return {
          'background': '#f0faff',
          'color': '#33bfff'
        }
      case 'Frontend':
        return {
          'background': '#f7f0ff',
          'color': '#bf87ff'
        }
      case 'UX Designer':
        return {
          'background': '#f0f4ff',
          'color': '#306bff'
        }
      case 'UI Designer':
        return {
          'background': '#fff6f0',
          'color': '#ffb680'
        }
      default:
       return {};
    }
  }

  submit() {
    const payload: TaskList = {
      id: this.taskEditId ? this.taskEditId : "",
      taskDesc : this.taskForm.value.taskDescription,
      employeeId : this.taskForm.value.taskEmployee.map((id:any) => id.id),
      taskTitle :this.taskForm.value.taskName,
      taskType : this.taskForm.value.taskType.taskName,
      taskProjectId: this.taskForm.value.taskProject.id,
      taskStatus : this.taskEditId? this.taskStatus : "Task Ready",
      taskDate : moment(this.taskForm.value.taskDate).format("YYYY-MM-DD")
    }
    debugger
    this.isLoading = true
    if(!this.taskEditId){
      this.firebaseService.addTaskList(payload).then(res => {
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data Add Successfully..',
          life: 1500,
        });
        this.getAllTaskList()
        this.isLoading = false
      })
    } else {
      this.firebaseService.updateTaskList(this.taskEditId ,payload).then(res => {
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess' ,
          detail: 'Data UpDate Successfully..',
          life: 1500,
        });
        this.getAllTaskList()
        this.isLoading = false
      })
    }
  }
  
  selectProjectFilter(event:any) {
    this.selectedIndex = null
    this.selectProjectId = event.value.id
    this.isSelectProjectFilter = true 
    this.getAllTaskList()
    this.getEmployeesByProject(this.selectProjectId) 
  }

  applyFilter(filterValue: any) {
    // if(filterValue?.target?.value || filterValue?.target?.value == ''){
    //   this.keyValue = filterValue.target.value
    // }else{
    //   this.keyValue = filterValue
    // }
    // this.mainArry = this.taskList

    // this.filterInfluencerList = []
    // this.filterInfluencerList = this.mainArry.filter((element: any) => {
    //   return Object.keys(element).some((key) => {
    //     if (element[key] != null && key !== 'id' && key !=='taskProjectId')
    //       return element[key].toString().toLowerCase().includes(this.keyValue.toLowerCase());
    //   });
    // });
    // let itemsIds
    // if(!this.isSelectProjectFilter){
    //   this.groups = [
    //     {
    //       name: 'Task Ready',
    //       items: [
    //         {taskStatus: "Task Ready"}
    //       ]
    //     },
    //     {
    //       name: 'In Progress',
    //       items: [
    //         {taskStatus: "In Progress"}
    //       ]
    //     },
    //     {
    //       name: 'Testing',
    //       items: [
    //         {taskStatus: "Testing"}
    //       ]
    //     },
    //     {
    //       name: 'Done',
    //       items: [
    //         {taskStatus: "Done"}
    //       ]
    //     }
    //   ];
    //   this.filterInfluencerList = this.filterInfluencerList.filter((id:any) => id.taskProjectId === this.projectList[0].id);
    // } else {
    //   this.groups = [
    //     {
    //       name: 'Task Ready',
    //       items: [
    //         {taskStatus: "Task Ready"}
    //       ]
    //     },
    //     {
    //       name: 'In Progress',
    //       items: [
    //         {taskStatus: "In Progress"}
    //       ]
    //     },
    //     {
    //       name: 'Testing',
    //       items: [
    //         {taskStatus: "Testing"}
    //       ]
    //     },
    //     {
    //       name: 'Done',
    //       items: [
    //         {taskStatus: "Done"}
    //       ]
    //     }
    //   ];
    //   this.filterInfluencerList = this.filterInfluencerList.filter((id:any) => id.taskProjectId === this.selectProjectId);
    // }      
    // this.filterInfluencerList.forEach((ele:any) => {
    //   let index = this.groups.findIndex(id => id.name === ele.taskStatus);
    //   itemsIds = this.groups[index].items.map((id:any) => id.id);
    //   if(index > -1 && !itemsIds.includes(ele.id)){
    //     this.groups[index]?.items.push(ele);
    //     const employeeName = ele.employeeList.map((element:any) => {
    //         return element.emaployeeName
    //     });
    //     ele['employeeName'] = employeeName
    //   }
    // })
    // this.groups.forEach(ele => {
    //   ele.items?.forEach((element:any) => {
    //     if(JSON.stringify(element) != '{}' && element?.employeeName?.length > 0 ) {
    //       element.avatarName = []
    //        element?.employeeName.forEach((ele:any)=>{
    //           const data = ele.split(' ').map((ele:any) => ele?.charAt(0));
    //           if(data != undefined) {
    //             element.avatarName.push([]?.concat(...data).join().replace(',','')) 
    //           }
    //       })
    //     }
    //   })
    // })
  }

  getEmployeesByProject(projectId : any) {
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      if (res) {
        this.isLoading = true
        const employees : any  = []
        res.forEach((element:any) => {
          element.selectProject.forEach((ele:any) => {
            if(ele.id === projectId) {
              employees.push(element)
            }
          })
        });
        this.projectWiseEmployees = employees;
        if (this.projectWiseEmployees && this.projectWiseEmployees.length > 0) {
          const employeeAvatar = this.projectWiseEmployees.map((id : any ) => id.emaployeeName.split(' ').map((ele : any) => ele?.charAt(0))).map((childEle : any) => childEle.join(''))
          this.employeeAvtars = employeeAvatar
        }
      }
      this.getProjectName = this.projectList.find((id:any) => id.id === projectId).projectName    
      this.isLoading = false
    })
      
  }

  onAvatarChange(data:any,index:number){
    this.selectedIndex = index;
    let value:any = []
    this.taskList.forEach((ele:any) =>  {
      if(ele.avatarName.find((id:any) => id == data)){
         value.push(ele);
      }
    });

    this.groups = [
      {
        name: 'Task Ready',
        items: [
          {taskStatus: "Task Ready"}
        ]
      },
      {
        name: 'In Progress',
        items: [
          {taskStatus: "In Progress"}
        ]
      },
      {
        name: 'Testing',
        items: [
          {taskStatus: "Testing"}
        ]
      },
      {
        name: 'Done',
        items: [
          {taskStatus: "Done"}
        ]
      }
    ];

    value.forEach((ele:any) => {
      let index = this.groups.findIndex(id => id.name == ele.taskStatus)
      this.groups[index].items.push(ele)
    })
  }

  addTask(){
    this.taskForm.reset()
  }

  editData(data :any){
    this.isEdit = true
    this.taskEditId = data.id
    this.taskStatus = data.taskStatus
    this.taskForm.controls['taskName'].setValue(data.taskTitle)
    this.taskForm.controls['taskDescription'].setValue(data.taskDesc)
    const taskTypeList  = this.taskTypeList.find((id:any) => id.taskName === data.taskType)
    this.taskForm.controls['taskType'].setValue(taskTypeList)
    const projectList = this.projectList.find((id:any) => id.id === data.taskProjectId)
    this.selectProject('', projectList.id)
    this.taskForm.controls['taskProject'].setValue(projectList)
    const recordId = data.employeeId.map((id:any) => id);
    let employeeListArr:any = []
    this.projectWiseEmployees.forEach((ele:any) => {
      if(recordId.find((id:any) => id == ele.id)) {
        employeeListArr.push(ele)
      }
    })
    this.taskForm.controls['taskEmployee'].setValue(employeeListArr)
    this.taskForm.controls['taskDate'].setValue(new Date(data.taskDate));
  }

  deleteData(data: any) {
    this.isLoading = true
    const payload: TaskList = {
      id: data.id,
      taskDesc: data.taskDesc,
      employeeId: data.employeeId,
      taskTitle: data.taskTitle,
      taskType: data.taskType,
      taskStatus: data.taskStatus,
      taskProjectId: data.taskProjectId,
      taskDate: data.taskDate
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseService.deleteTaskList(payload).then((res: any) => {
          this.messageService.add({
            severity: msgType.success,
            summary: 'Sucess',
            detail: 'Data Delete Successfully..',
            life: 1500,
          });
        })
        this.isLoading = false
      }
    })

   
  }
}