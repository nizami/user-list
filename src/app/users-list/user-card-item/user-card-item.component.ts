import { Component, Input } from '@angular/core';
import { UserDto } from '../../services/users.api.service';

@Component({
  selector: 'app-user-card-item',
  standalone: true,
  imports: [],
  templateUrl: './user-card-item.component.html',
  styleUrl: './user-card-item.component.scss',
})
export class UserCardItemComponent {
  @Input() user!: UserDto;
}
