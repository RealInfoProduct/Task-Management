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

  selectedDate!: Date;
  countdown: any;
  hours : any;
  minutes: any;
  seconds: any;
  isEdit: boolean = false
  isLoading: boolean = false
  taskForm!: FormGroup
  taskReady: any = []
  taskInProgress: any = []
  taskTesting: any = []
  taskDone: any = []
  filterInfluencerList: any = []
  employeeAvtars: any = []
  projectWiseEmployees: any = [];
  selectedIndex: any = 'index';
  public groups: Array<any> = [];
  taskTypeList: any = [
    { taskName: "Backend" },
    { taskName: "Frontend" },
    { taskName: "UX Designer" },
    { taskName: "UI Designer" },
  ]
  projectList: any
  employeeList: any;
  projectId: any
  employeeProjectList: any = []
  taskList: any;
  isUpdate = false;
  selectProjectItem: any
  selectProjectId: any
  isSelectProjectFilter: boolean = false
  mainArry: any = []
  keyValue: any
  taskListLength: number = 0
  taskListTaskReadyLength: number = 0
  taskListInProgressLength: number = 0
  taskListTestingLength: number = 0
  taskListDoneLength: number = 0
  getProjectName: any
  employeeListArr: any
  taskEditId: any
  taskStatus: any
  projectNameTaskNumber:any
  taskViewList :any
  progrssBarPersantage:any;
  priority = [
    { name: 'Blocker', img: '../../../assets/task-img/Blocker.png' },
    { name: 'Critical', img: '../../../assets/task-img/Critical.png' },
    { name: 'Major', img: '../../../assets/task-img/Major.png' },
    { name: 'Highest', img: '../../../assets/task-img/Highest.png' },
    { name: 'High', img: '../../../assets/task-img/High.png' },
    { name: 'Medium', img: '../../../assets/task-img/Medium.png' },
    { name: 'Low', img: '../../../assets/task-img/Low.png' },
    { name: 'Lowest', img: '../../../assets/task-img/Lowest.png' },
    { name: 'Minor', img: '../../../assets/task-img/Minor.png' },
    { name: 'Trivial', img: '../../../assets/task-img/Trivial.png' }
];
selectedPriority :any
  constructor(private _ds: DragulaService,
    private formbuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    const name = 'MS';
    const randomColor = this.generateColor(name);
    const existingGroup = this._ds.find('COLUMNS');
    if (!existingGroup) {
      this._ds.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle: any) => handle.className === "group-handle"
      });
    }

    this._ds.dropModel().subscribe(async (args: any) => {
      this.isLoading = true
      let data = args.targetModel.filter((el: any) => Object.keys(el).length);
      const payload: TaskList = {
        id: args.item.id,
        taskDesc: args.item.taskDesc,
        employeeId: args.item.employeeId,
        taskTitle: args.item.taskTitle,
        taskType: args.item.taskType,
        taskStatus: data[0].taskStatus,
        taskProjectId: args.item.taskProjectId,
        taskDate: args.item.taskDate,
        taskNumber: args.item.taskNumber,
        taskEndDate : args.item.taskEndDate,
        taskPriority : args.item.taskPriority,
      }      
      this.firebaseService.updateTaskList(args.item.id, payload).then(res => {
        this.isUpdate = true;
        this.isLoading = false
      })
    });

    this.buildForm()
    this.getAllProjectList();
    this.getAllEmployeeList();

    setTimeout(() => {
      if (!this.isUpdate) {
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
        this.selectProjectItem = this.projectList[0]
        this.getEmployeesByProject(this.projectList[0].id)
        this.getAllTaskList()
      }, 150);
      this.isLoading = false;
    })
  }

  getAllEmployeeList() {
    this.isLoading = true
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      this.employeeListArr = res;
      this.getAllTaskList()
      this.employeeList = res
      this.employeeProjectList = []
      res.forEach((element: any) => {
        element.selectProject.forEach((ele: any) => {
          if (ele.id === this.projectId) {
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
      if (!this.isSelectProjectFilter) {
        this.groups = [
          {
            name: 'Task Ready',
            items: [
              { taskStatus: "Task Ready" }
            ]
          },
          {
            name: 'In Progress',
            items: [
              { taskStatus: "In Progress" }
            ]
          },
          {
            name: 'Testing',
            items: [
              { taskStatus: "Testing" }
            ]
          },
          {
            name: 'Done',
            items: [
              { taskStatus: "Done" }
            ]
          }
        ];
        this.taskList = res.filter((id: any) => id.taskProjectId === this.projectList[0].id);
      } else {
        this.groups = [
          {
            name: 'Task Ready',
            items: [
              { taskStatus: "Task Ready" }
            ]
          },
          {
            name: 'In Progress',
            items: [
              { taskStatus: "In Progress" }
            ]
          },
          {
            name: 'Testing',
            items: [
              { taskStatus: "Testing" }
            ]
          },
          {
            name: 'Done',
            items: [
              { taskStatus: "Done" }
            ]
          }
        ];
        this.taskList = res.filter((id: any) => id.taskProjectId === this.selectProjectId);
      }
      if(this.taskList.length > 0){ 
          const data = this.getProjectName?.split(' ')[0].split('');
          const findnumber = this.taskList.map((id:any) => id.taskNumber).sort()
          const lastIndex = findnumber.length - 1;
          const lastElement = Number(findnumber[lastIndex].split("-")[1]);
          findnumber.forEach((ele :any) => {
            const element = Number(ele.split("-")[1])+ 1
            if(lastElement < element ) {
              const numeric_part = Number(ele.split("-")[1])+ 1
              this.projectNameTaskNumber = [...data[0], ...data[1]].join('').toUpperCase() + "-" + numeric_part              
            }
          })
      } else { 
        const data = this.getProjectName?.split(' ')[0].split('');
        this.projectNameTaskNumber = [...data[0], ...data[1]].join('').toUpperCase() + "-" + 1
      }
      this.taskList.forEach((ele: any) => {
        let index = this.groups.findIndex(id => id.name === ele.taskStatus);
        itemsIds = this.groups[index].items.map((id: any) => id.id);
        if (index > -1 && !itemsIds.includes(ele.id)) {
          this.groups[index]?.items.push(ele);
          const data = ele?.employeeId?.map((element: any) => {
            return this.employeeListArr?.find((id: any) => id.id === element).avatarName
          })
          ele['employeeName'] = data
        }
      })

      this.taskListLength = this.taskList.length
      this.taskListTaskReadyLength = this.taskList.filter((id: any) => id.taskStatus === "Task Ready").length
      this.taskListInProgressLength = this.taskList.filter((id: any) => id.taskStatus === "In Progress").length
      this.taskListTestingLength = this.taskList.filter((id: any) => id.taskStatus === "Testing").length
      this.taskListDoneLength = this.taskList.filter((id: any) => id.taskStatus === "Done").length
      this.isLoading = false
    })
  }

  createAvatarName(name:string) {
     return name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0);
  }

  selectProject(event: any, id?: any) {
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
      taskDate: [moment().format('YYYY-MM-DD')],
      taskEndDate: [moment().format('YYYY-MM-DD')],
      taskPriority : ['']
    })
  }

  taskBorder(groupName: any) {
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
      taskDesc: this.taskForm.value.taskDescription,
      employeeId: this.taskForm.value.taskEmployee?.map((id: any) => id.id) ? this.taskForm.value.taskEmployee?.map((id: any) => id.id) : null ,
      taskTitle: this.taskForm.value.taskName,
      taskType: this.taskForm.value.taskType.taskName,
      taskProjectId: this.taskForm.value.taskProject.id,
      taskStatus: this.taskEditId ? this.taskStatus : "Task Ready",
      taskDate: moment(this.taskForm.value.taskDate).format("D-MMM-YYY") + "," + moment().format('LTS'),
      taskNumber : this.projectNameTaskNumber,
      taskEndDate : moment(this.taskForm.value.taskEndDate).format("D-MMM-YYYY"),
      taskPriority : this.taskForm.value.taskPriority,
    }

    this.isLoading = true
    if (!this.taskEditId) {
      this.firebaseService.addTaskList(payload).then(res => {
        this.apiSuccessMsg(msgType.success , 'Sucess', 'Data Add Successfully..')
        this.getAllTaskList()
        this.isLoading = false
      })
    } else {
      this.firebaseService.updateTaskList(this.taskEditId, payload).then(res => {
        this.apiSuccessMsg(msgType.success , 'Sucess', 'Data UpDate Successfully..')
        this.getAllTaskList()
        this.isLoading = false
      })
    }
  }

  selectProjectFilter(event: any) {
    this.selectedIndex = 'index'
    this.selectProjectId = event.value.id
    this.isSelectProjectFilter = true
    this.getAllTaskList()
    this.getEmployeesByProject(this.selectProjectId)
  }

  getEmployeesByProject(projectId: any) {
    this.firebaseService.getEmaployeeList().subscribe((res: any) => {
      if (res) {
        this.isLoading = true
        const employees: any = []
        res.forEach((element: any) => {
          element.selectProject.forEach((ele: any) => {
            if (ele.id === projectId) {
              employees.push(element)
            }
          })
        });
        this.projectWiseEmployees = employees;
        
        if (this.projectWiseEmployees && this.projectWiseEmployees.length > 0) {
          this.employeeAvtars = this.projectWiseEmployees
        } else {
          this.employeeAvtars = []
        }
      }
      this.getProjectName = this.projectList.find((id: any) => id.id === projectId).projectName
      this.getAllTaskList() 
      this.isLoading = false
    })
  }

  onAvatarChange(data: any, index: any) {
    this.selectedIndex = index;
    let value: any = []

    this.taskList.forEach((ele: any) => {
      if (ele.employeeId.find((id: any) => id == data)) {
        value.push(ele);
      } else if(data == "ALL") {
        value = this.taskList;
      }
    });

    this.groups = [
      {
        name: 'Task Ready',
        items: [
          { taskStatus: "Task Ready" }
        ]
      },
      {
        name: 'In Progress',
        items: [
          { taskStatus: "In Progress" }
        ]
      },
      {
        name: 'Testing',
        items: [
          { taskStatus: "Testing" }
        ]
      },
      {
        name: 'Done',
        items: [
          { taskStatus: "Done" }
        ]
      }
    ];

    value.forEach((ele: any) => {
      let index = this.groups.findIndex(id => id.name == ele.taskStatus)
      this.groups[index].items.push(ele)
    })
  }

  addTask() {
    this.taskForm.reset()
    this.taskEditId = ''
  }

  editData(data: any) {
    this.isEdit = true
    this.taskEditId = data.id
    this.taskStatus = data.taskStatus
    this.taskForm.controls['taskName'].setValue(data.taskTitle)
    this.taskForm.controls['taskDescription'].setValue(data.taskDesc)
    const taskTypeList = this.taskTypeList.find((id: any) => id.taskName === data.taskType)
    this.taskForm.controls['taskType'].setValue(taskTypeList)
    const projectList = this.projectList.find((id: any) => id.id === data.taskProjectId)
    this.selectProject('', projectList.id)
    this.taskForm.controls['taskProject'].setValue(projectList)
    const recordId = data.employeeId?.map((id: any) => id);
    let employeeListArr: any = []
    this.projectWiseEmployees.forEach((ele: any) => {
      if (recordId?.find((id: any) => id == ele.id)) {
        employeeListArr.push(ele)
      }
    })
    this.taskForm.controls['taskEmployee'].setValue(employeeListArr)
    this.taskForm.controls['taskDate'].setValue(new Date(data.taskDate));
    this.taskForm.controls['taskEndDate'].setValue(new Date(data.taskEndDate));
    this.taskForm.controls['taskPriority'].setValue(data.taskPriority);
    this.projectNameTaskNumber = data.taskNumber
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
      taskDate: data.taskDate,
      taskNumber : data.taskNumber,
      taskEndDate : "",
      taskPriority : "",
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete this record ?',
      header: 'Delete Priority',
      accept: async () => {
        this.isLoading = true
        this.firebaseService.deleteTaskList(payload).then((res: any) => {
          this.apiSuccessMsg(msgType.success , 'Sucess', 'Data Delete Successfully..')
        })
        this.isLoading = false
      }
    })
  }

  viewData(data:any) {
    this.taskViewList = data;
    this.startCountdown(new Date(data.taskTime));
  }

  apiSuccessMsg(msgType:any, flag:any , message:any){
    this.messageService.add({
      severity: msgType,
      summary: flag,
      detail: message,
      life: 1500,
    });
  }

  startCountdown(hours:any) {
    this.countdown = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = hours.getTime() - currentTime;

      if (timeDifference > 0) {
        let hours = Math.floor(timeDifference / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
      } else {
        clearInterval(this.countdown);
      }
      this.timeGapForProgressbar(hours);
    }, 1000);
  }

  timeGapForProgressbar(hours:any){
    const startTime = moment().format('HH:mm');
    const endTime = moment(hours).format('HH:mm');
    const currentTime = moment();

    const totalDuration = moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm')));
    const remainingDuration = moment.duration(moment(endTime, 'HH:mm').diff(currentTime));
    const percentage = (remainingDuration.asMilliseconds() / totalDuration.asMilliseconds()) * 100;
    this.progrssBarPersantage = percentage.toFixed(2) + '%';

  }

  closePopup() {
    clearInterval(this.countdown);
  }
}
