import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserCardItemComponent } from './user-card-item/user-card-item.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';
import { ViewState } from './model/view-state.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ListRequest } from '../services/users.api.service';
import { SearchUsersFormModel } from './model/search-users-form.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ReactiveFormsModule, UserListItemComponent, UserCardItemComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  protected ViewState = ViewState;
  protected viewState = ViewState.List;

  protected searchForm = new FormGroup<SearchUsersFormModel>({
    search: new FormControl(),
    pageNumber: new FormControl(1, { nonNullable: true }),
    itemsPerPage: new FormControl<ListRequest['itemsPerPage']>(5, {
      nonNullable: true,
    }),
  });

  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.searchForm.controls.search.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        console.log(search);
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected setViewState(viewState: ViewState): void {
    this.viewState = viewState;
  }
}
