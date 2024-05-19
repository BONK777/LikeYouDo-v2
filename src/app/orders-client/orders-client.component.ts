import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-orders-client',
  templateUrl: './orders-client.component.html',
  styleUrls: ['./orders-client.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class OrdersClientComponent implements OnInit {
  clientData: any;
  accKey!: string;
  canCreateNew: boolean = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.getClientInfo();
  }

  getClientInfo() {
    const accKey = this.dataService.getClientAccessKey();
    this.dataService.validateClient(accKey).subscribe(
      (response) => {
        let canCreateNew = true;
        for (const task of response.tasks) {
          canCreateNew = canCreateNew && task.data.answer != null;
          if (task.data.performer != '0') {
            this.dataService.getPerformerById(task.data.performer).subscribe(perfData => {
              task.data.performer = {
                id: task.data.performer,
                data: perfData
              };
            })
          }
        }
        this.canCreateNew = canCreateNew;
        this.clientData = response;
        this.clientData.tasks.reverse();
      },
      (error) => {
        console.error('Ошибка при получении данных:', error);
      }
    );
  }

  showCandidates(taskId: string) {    
    const task = this.clientData.tasks.find((task: { id: string; }) => task.id === taskId);
    if (task) {
      task.showCandidates = !task.showCandidates;
      if (task.showCandidates) {
        this.dataService.getCandidates(taskId).subscribe(
          (candidates) => {
            task.candidates = candidates;
            console.log(candidates);
            const performerIds = candidates.map((candidate: { performer: any; }) => candidate.performer);
            performerIds.forEach((performerId: string) => {
              this.dataService.getPerformerById(performerId).subscribe(
                (performerInfo) => {
                  task.performerInfo = task.performerInfo || {};
                  task.performerInfo[performerId] = performerInfo;
                  console.log(performerInfo);
                },
                (error) => {
                  console.error('Ошибка при получении данных об исполнителе:', error);
                }
              );
            });
          },
          (error) => {
            console.error('Ошибка при получении кандидатов:', error);
          }
        );
      }
    }
  }

  respondToPerformer(performerId: string, taskId: string) {
    this.dataService.choosePerformer(performerId, taskId).subscribe(
      (response) => {
        console.log('Исполнитель успешно выбран:', response);
        this.openChat(taskId);
      },
      (error) => {
        console.error('Ошибка при выборе исполнителя:', error);
      }
    );
  }

  openChat(taskId: string) {
    localStorage.setItem('taskId', taskId);
    localStorage.setItem('userRole', 'client');
    this.router.navigate(['/chat']);
  }
}
