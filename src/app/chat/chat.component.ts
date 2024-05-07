import { Component } from '@angular/core';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { text: string }[] = [];
  newMessage: string = '';
  role: string | null = null;
  taskId: string | null = null;
  disableInput: boolean = false;


  constructor(private dataService: DataService) {
    this.role = localStorage.getItem('userRole');
    this.taskId = localStorage.getItem('taskId');

  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage});
      const role = localStorage.getItem('userRole');
      const taskId = localStorage.getItem('taskId')!;

      console.log('Роль:', role);
      console.log('ID задачи:', taskId);
      console.log('Отправка сообщения:', this.newMessage);

      this.dataService.sendMessage(role!, this.newMessage, taskId).subscribe(
        (response: any) => {
          console.log('Сообщение успешно отправлено:', response);
        },
        (error: any) => {
          console.error('Ошибка при отправке сообщения:', error);
        }
      );
    }
  }
  
  fetchMessages() {
    if (this.role && this.taskId) {
      this.dataService.getMessages(this.role, this.taskId).subscribe(
        (response: any[]) => {
          this.messages = response.map(msg => ({
            text: msg.message,
            sender: msg.sender,
            time: msg.time
          }));
          console.log('Получены сообщения:', this.messages);
        },
        (error: any) => {
          console.error('Ошибка при получении сообщений:', error);
        }
      );
    }
  }

  endChat() {
    if (this.role === 'performer' && this.taskId) {
      const message = 'Завершение чата';
      this.dataService.endChat(this.taskId, message).subscribe(
        (response: any) => {
          console.log('Чат успешно завершен:', response);
          // Отображаем уведомление "Встреча завершена!"
          alert('Встреча завершена!');
          // Запретить писать дальше клиенту
          this.disableInput = true;
        },
        (error: any) => {
          console.error('Ошибка при завершении чата:', error);
        }
      );
    }
}

}
