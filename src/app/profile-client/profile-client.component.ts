import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {

  clientData: { name: string, login: string } | null = null;

  constructor(private authService: DataService) { }

  ngOnInit() {
    const accKey = this.authService.getClientAccessKey();
    this.authService.validateClient(accKey).subscribe(
      (response) => {
        this.clientData = response
      },
      (error) => {
        console.error("Ошибка при получении данных", error)
      }
    )
  }
}
