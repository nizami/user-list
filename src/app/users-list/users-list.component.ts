import { Component } from '@angular/core';
import { UserCardItemComponent } from './user-card-item/user-card-item.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserListItemComponent, UserCardItemComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {}
