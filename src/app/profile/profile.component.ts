import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfilePerformerComponent implements OnInit {
  selectedComponent: string = 'tasks';

  performerData: { name: string, login: string } | null = null;

  constructor(private authService: DataService) { }


  ngOnInit() {
    this.authService.validatePerformer(this.authService.getPerformerAccessKey()).subscribe((data) => {
      console.log('got data')
      console.log(data)
      this.performerData = {
        name: data.name,
        login: data.login
      };
    }, (error) => console.log('error'));
    this.loadTasks();
  }

  tasks: any[] = [];  

  loadTasks() {
    console.log("start load")
    this.authService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;  
        console.log('Полученные задачи:', this.tasks);
      },
      (error) => {
        console.error('Ошибка при получении задач:', error);
      }
    );
  }
}
