import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { FirebaseService } from 'src/app/service/firebase.service';
import * as moment from 'moment';
import { TaskList } from 'src/app/interface/AuthResponse';
import { MessageService } from 'primeng/api';
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
  public groups:Array<any> = [
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

  taskTypeList :any = [
    {taskName:"Backend"},
    {taskName:"Frontend"},
    {taskName:"UX Designer"},
    {taskName:"UI Designer"},
  ]
  projectList: any
  employeeList: any
  projectId: any
  employeeProjectList: any = []
  taskList :any;
  isUpdate = false; 

  constructor( private _ds : DragulaService, 
    private formbuilder :FormBuilder,
    private firebaseService:FirebaseService,
    private messageService :MessageService) { 
  }

  ngOnInit(): void {
    

    const existingGroup = this._ds.find('COLUMNS');
    if (!existingGroup) {
      this._ds.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle:any) => handle.className === "group-handle"
      });
    }

    this._ds.dropModel().subscribe((args:any) => {
      this.isLoading = true
      let data = args.targetModel.filter((el:any) => Object.keys(el).length);
      const payload: TaskList = {
        id: args.item.id,
        taskDesc : args.item.taskDesc,
        employeeList : args.item.employeeList,
        taskTitle :args.item.taskTitle,
        taskType : args.item.taskType,
        taskStatus : data[0].taskStatus,
        taskProjectId : args.item.taskProjectId,
        taskDate : args.item.taskDate
      }

      this.firebaseService.updateTaskList(args.item.id,payload).then(res => {
        this.isUpdate = true;
        this.messageService.add({
          severity: msgType.success,
          summary:'Sucess',
          detail: 'Data UpDate Successfully..',
          life: 1500,
        });
        this.isLoading = false
      })
    });
    
    this.buildForm()
    this.getAllProjectList()

    if(!this.isUpdate){
      this.getAllTaskList()
    }
  }

  getAllProjectList() {
    this.isLoading = true
    this.firebaseService.getProjectList().subscribe((res: any) => {
      this.projectList = res      
      this.isLoading = false
    })
  }

  getAllEmployeeList() {
    this.isLoading = true
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
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
      this.taskList = res;

      this.taskList.forEach((ele:any) => {
        let index = this.groups.findIndex(id => id.name === ele.taskStatus);
        itemsIds = this.groups[index].items.map((id:any) => id.id);
        if(index > -1 && !itemsIds.includes(ele.id)){
          this.groups[index]?.items.push(ele);
          ele.employeeList.forEach((element:any) => {
              ele['employeeName'] = element.emaployeeName
          });
        }
      })

      this.groups.forEach(ele => {
        ele.items?.forEach((element:any) => {
          if(JSON.stringify(element) != '{}') {
            let data = element?.employeeName?.split(' ').map((ele:any) => ele?.charAt(0));
            if(data != undefined) {
              element.avatarName = []?.concat(...data).join().replace(',','');
            }
          }
        })
      })
      this.isLoading = false
    })    
  }

  selectProject(event:any){
    this.projectId = event.value.id
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
      id:'',
      taskDesc : this.taskForm.value.taskDescription,
      employeeList : this.taskForm.value.taskEmployee,
      taskTitle :this.taskForm.value.taskName,
      taskType : this.taskForm.value.taskType.taskName,
      taskProjectId: this.taskForm.value.taskProject.id,
      taskStatus : "Task Ready",
      taskDate : moment(this.taskForm.value.taskDate).format("YYYY-MM-DD")
    }

    this.isLoading = true
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
  }
  
}
