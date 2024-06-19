import { Component, Input } from '@angular/core';
import { UserDto } from '../../services/users.api.service';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss',
})
export class UserListItemComponent {
  @Input() user!: UserDto;
}
