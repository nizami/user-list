import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UsersDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'user-list';
}
