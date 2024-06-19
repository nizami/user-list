import { AbstractControl } from '@angular/forms';
import { ListRequest } from '../../services/users.api.service';

export interface SearchUsersFormModel {
  search: AbstractControl<ListRequest['search']>;
  pageNumber: AbstractControl<ListRequest['pageNumber']>;
  itemsPerPage: AbstractControl<ListRequest['itemsPerPage']>;
}
