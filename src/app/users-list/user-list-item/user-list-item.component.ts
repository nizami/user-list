import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() remove = new EventEmitter<UserDto>();

  protected onRemove(): void {
    this.remove.emit(this.user);
  }
}
