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
  @Input() public user!: UserDto;
  @Output() public remove = new EventEmitter<UserDto>();

  protected isRemoving = false;

  protected onRemove(): void {
    this.isRemoving = true;
    this.remove.emit(this.user);
  }
}
