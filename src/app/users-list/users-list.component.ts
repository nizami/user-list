import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserCardItemComponent } from './user-card-item/user-card-item.component';
import { UserListItemComponent } from './user-list-item/user-list-item.component';
import { ViewState } from './model/view-state.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ListRequest,
  UserListResponseDto,
  UsersApiService,
} from '../services/users.api.service';
import { SearchUsersFormModel } from './model/search-users-form.model';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_ITEMS_PER_PAGE = 5;

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserListItemComponent,
    UserCardItemComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  protected ViewState = ViewState;
  protected viewState = ViewState.List;

  protected searchForm = new FormGroup<SearchUsersFormModel>({
    search: new FormControl(),
    pageNumber: new FormControl(DEFAULT_PAGE_NUMBER, {
      nonNullable: true,
    }),
    itemsPerPage: new FormControl<ListRequest['itemsPerPage']>(
      DEFAULT_ITEMS_PER_PAGE,
      {
        nonNullable: true,
      }
    ),
  });

  protected loading$ = new Subject<boolean>();
  protected response$ = new Subject<UserListResponseDto>();

  private destroy$ = new Subject<void>();

  constructor(private usersApi: UsersApiService) {}

  public ngOnInit(): void {
    this.updateSearchedUsers();

    this.searchForm.controls.search.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        console.log(search);

        this.updateSearchedUsers();
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
    this.response$.complete();
  }

  protected setViewState(viewState: ViewState): void {
    this.viewState = viewState;
  }

  private updateSearchedUsers() {
    const request = this.searchForm.getRawValue();
    this.loading$.next(true);

    this.usersApi
      .getList(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading$.next(false))
      )
      .subscribe((response) => {
        console.log(response);

        this.response$.next(response);
      });
  }
}
