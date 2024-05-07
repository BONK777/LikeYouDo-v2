import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-task',
  templateUrl: './active-task.component.html',
  styleUrls: ['./active-task.component.css']
})
export class ActiveTaskComponent implements OnInit {
  performerTasks: any[] = [];
  performerData: any;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.loadPerformerTasks();
  }
  
  loadPerformerTasks() {
    const accKey = this.dataService.getPerformerAccessKey();
    this.dataService.validatePerformer(accKey).subscribe(
      (response) => {
        this.performerData = response;
        console.log('Полученные данные исполнителя:', this.performerData);
      },
      (error) => {
        console.error('Ошибка при получении задач исполнителя:', error);
      }
    );
  }

  openChat(taskId: string) {
    localStorage.setItem('taskId', taskId);
    localStorage.setItem('userRole', 'performer');

    console.log('сохранили id таска:', taskId);
    
    this.router.navigate(['/chat']);
  }
}
