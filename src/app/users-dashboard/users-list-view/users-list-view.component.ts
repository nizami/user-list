import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../services/users.api.service';

@Component({
  selector: 'app-users-list-view',
  standalone: true,
  imports: [],
  templateUrl: './users-list-view.component.html',
  styleUrl: './users-list-view.component.scss',
})
export class UsersListViewComponent {
  @Input() public users!: UserDto[];
  @Output() public remove = new EventEmitter<UserDto>();

  protected removingUser?: UserDto = undefined;

  protected onRemove(user: UserDto): void {
    this.removingUser = user;
    this.remove.emit(user);
  }
}
