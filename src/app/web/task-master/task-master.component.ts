import { Component, OnInit, Renderer2 } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
  styleUrls: ['./task-master.component.scss']
})
export class TaskMasterComponent implements OnInit {

  public groups:Array<any> = [
    {
      name: 'Task Ready',
      items: [
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'Low', taskType: 'UI Designer', taskTitle: 'Web Template', date: '12-06-2023', employeeName: 'Dipak Panshuriya'},
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'High',taskType: 'UX Designer', taskTitle: 'Application Design', date: '20-06-2023', employeeName: 'Manish Savaliya' },
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'High', taskType: 'Development', taskTitle: 'API Integration', date: '09-06-2023', employeeName: 'Pradip Savaliya' },
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'Medium', taskType: 'Backend Development', taskTitle: 'JasperSoft PDF', date: '17-06-2023', employeeName: 'Tirth Bhalani' }]
    },
    {
      name: 'In Progress',
      items: [
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'High', taskType: 'Development', taskTitle: 'API Integration', date: '09-06-2023', employeeName: 'Pradip Savaliya' },
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'Low', taskType: 'UI Designer', taskTitle: 'Web Template', date: '12-06-2023', employeeName: 'Dipak Panshuriya'},
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'Medium', taskType: 'Backend Development', taskTitle: 'JasperSoft PDF', date: '17-06-2023', employeeName: 'Tirth Bhalani' },
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'High',taskType: 'UX Designer', taskTitle: 'Application Design', date: '20-06-2023', employeeName: 'Manish Savaliya' }]
    },
    {
      name: 'Testing',
      items: [
        { desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', prority: 'High', taskType: 'Development', taskTitle: 'API Integration', date: '09-06-2023', employeeName: 'Pradip Savaliya' },
      ]
    },
    {
      name: 'Done',
      items: []
    }
  ];

  constructor( private _ds : DragulaService) { 
  }

  ngOnInit(): void {
    this.groups.forEach(ele => {
      ele.items?.forEach((element:any) => {
        let data = element.employeeName.split(' ').map((ele:any) => ele.charAt(0));
        element.avatarName = [].concat(...data).join().replace(',','');
      })
    })

    const existingGroup = this._ds.find('COLUMNS');
    if (!existingGroup) {
      this._ds.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle:any) => handle.className === "group-handle"
      });
    }

    this._ds.dropModel().subscribe((args:any) => {
      debugger
    });
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
      case 'Backend Development':
        return {
          'background': '#f0faff',
          'color': '#33bfff'
        }
      case 'Development':
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
  
}
