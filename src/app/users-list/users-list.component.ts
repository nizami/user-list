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
const ITEMS_PER_PAGE = [5, 10, 20] as const;

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
  protected currentViewState = ViewState.List;

  protected searchForm = new FormGroup<SearchUsersFormModel>({
    search: new FormControl(),
    pageNumber: new FormControl(DEFAULT_PAGE_NUMBER, {
      nonNullable: true,
    }),
    itemsPerPage: new FormControl<ListRequest['itemsPerPage']>(
      ITEMS_PER_PAGE[0],
      {
        nonNullable: true,
      }
    ),
  });

  protected allItemsPerPage = ITEMS_PER_PAGE;

  protected get currentItemsPerPage() {
    return this.searchForm.getRawValue().itemsPerPage;
  }

  protected get allPageNumbers(): number[] {
    if (this.response) {
      const length = Math.ceil(
        this.response.total_count / this.currentItemsPerPage
      );

      return Array.from({ length }, (x, i) => i + 1);
    }

    return [];
  }

  protected get currentPageNumber() {
    return this.searchForm.getRawValue().pageNumber;
  }

  protected loading = false;
  protected response?: UserListResponseDto;

  private destroy$ = new Subject<void>();

  constructor(private usersApi: UsersApiService) {}

  public ngOnInit(): void {
    this.updateSearchedUsers();

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSearchedUsers();
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected setViewState(value: ViewState): void {
    this.currentViewState = value;
  }

  protected setItemsPerPage(value: ListRequest['itemsPerPage']): void {
    this.searchForm.controls.itemsPerPage.setValue(value);
  }

  protected setPageNumber(value: number): void {
    this.searchForm.controls.pageNumber.setValue(value);
  }

  private updateSearchedUsers() {
    const request = this.searchForm.getRawValue();
    this.loading = true;

    this.usersApi
      .getList(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => {
        console.log(response);

        this.response = response;

        this.searchForm.controls.pageNumber.setValue(response.page_number, {
          emitEvent: false,
        });
      });
  }
}
