import { Component } from '@angular/core';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { text: string, sender: string, time: string }[] = [];
  newMessage: string = '';
  role: string | null = null;
  taskId: string | null = null;
  disableInput: boolean = false;
  isLoading: boolean = false;
  opponentName: string | null = null;
  opponentId: string | null = null;
  tryingToEnd: boolean = false;

  constructor(private dataService: DataService) {
    this.role = localStorage.getItem('userRole');
    this.taskId = localStorage.getItem('taskId');
    if (this.taskId) {
      dataService.getTask(this.taskId).subscribe((task) => {
        if (this.role === "client") {
          this.opponentId = task.performer;
          dataService.getPerformerById(task.performer).subscribe((performer) => {
            this.opponentName = performer.name;
          })
        } else {
          this.opponentId = task.client;
          dataService.getClientInfo(task.client).subscribe((client) => {
            this.opponentName = client.name;
          })
        }
      });
    }
    this.fetchMessages();
    setInterval(() => {this.hiddenFetchMessages()}, 10000)
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const role = localStorage.getItem('userRole');
      const taskId = localStorage.getItem('taskId')!;

      console.log('Роль:', role);
      console.log('ID задачи:', taskId);
      console.log('Отправка сообщения:', this.newMessage);

      this.dataService.sendMessage(role!, this.newMessage, taskId).subscribe(
        (response: any) => {
          this.isLoading = true;
          console.log('Сообщение успешно отправлено:', response);
          this.newMessage = '';
          this.fetchMessages();
        },
        (error: any) => {
          console.error('Ошибка при отправке сообщения:', error);
        }
      );
    }
  }

  hiddenFetchMessages() {
    if (this.role && this.taskId) {
      this.dataService.getMessages(this.role, this.taskId).subscribe(
        (response: any[]) => {
          this.messages = response.map(msg => ({
            text: msg.message,
            sender: msg.sender,
            time: msg.time
          })).reverse();
          console.log('Получены сообщения:', this.messages);
        },
        (error: any) => {
          console.error('Ошибка при получении сообщений:', error);
        }
      );
    }
  }

  fetchMessages() {
    this.isLoading = true;
    if (this.role && this.taskId) {
      this.dataService.getMessages(this.role, this.taskId).subscribe(
        (response: any[]) => {
          this.messages = response.map(msg => ({
            text: msg.message,
            sender: msg.sender,
            time: msg.time
          })).reverse();
          console.log('Получены сообщения:', this.messages);
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Ошибка при получении сообщений:', error);
          this.isLoading = false;
        }
      );
    }
  }

  suringToEndChat() {
    this.tryingToEnd = true;
  }

  closeSuringModal() {
    this.tryingToEnd = false;
  }

  endChat() {
    if (this.role === 'performer' && this.taskId) {
      const message = 'Финальный ответ эксперта:\n' + this.newMessage;
      this.dataService.endChat(this.taskId, message).subscribe(
        (response: any) => {
          alert('Общение в этом чате завершено!');
          this.fetchMessages();
          this.disableInput = true;
          this.closeSuringModal();
          this.newMessage = '';
        },
        (error: any) => {
          console.error('Ошибка при завершении чата:', error);
        }
      );
    }
  }

}
