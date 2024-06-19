import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ListRequest,
  UserDto,
  UserListResponseDto,
  UsersApiService,
} from '../services/users.api.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchUsersFormModel } from './model/search-users-form.model';
import { ViewState } from './model/view-state.model';
import { UsersListViewComponent } from './users-list-view/users-list-view.component';
import { UsersCardsViewComponent } from './users-cards-view/users-cards-view.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ActivatedRoute, Router } from '@angular/router';

const DEFAULT_PAGE_NUMBER = 1;
const ITEMS_PER_PAGE: ListRequest['itemsPerPage'][] = [5, 10, 20];

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersListViewComponent,
    UsersCardsViewComponent,
    PaginatorComponent,
  ],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.scss',
})
export class UsersDashboardComponent implements OnInit, OnDestroy {
  protected ViewState = ViewState;
  protected currentViewState = ViewState.Cards;

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

  protected get itemsCount(): number {
    return this.response?.total_count ?? 0;
  }

  protected get currentPageNumber() {
    return this.searchForm.getRawValue().pageNumber;
  }

  protected loading = false;
  protected response?: UserListResponseDto;

  private destroy$ = new Subject<void>();

  constructor(
    private usersApi: UsersApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initRouteQueryParams();
  }

  public ngOnInit(): void {
    this.updateSearchedUsers();

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.navigateByQueryParams();
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

  protected onRemove(user: UserDto): void {
    this.loading = true;

    this.usersApi
      .remove(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSearchedUsers();
      });
  }

  private initRouteQueryParams(): void {
    const params = {
      search: String(this.route.snapshot.queryParams['search']),
      pageNumber: Number(this.route.snapshot.queryParams['pageNumber']) || 1,
      itemsPerPage:
        (Number(
          this.route.snapshot.queryParams['itemsPerPage']
        ) as ListRequest['itemsPerPage']) || ITEMS_PER_PAGE[0],
    };

    this.searchForm.patchValue(params);
  }

  private navigateByQueryParams(): void {
    this.router.navigate([], {
      queryParams: this.searchForm.getRawValue(),
    });
  }

  private updateSearchedUsers(): void {
    this.loading = true;
    const request = this.searchForm.getRawValue();

    this.usersApi
      .getList(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => {
        this.response = response;

        this.searchForm.controls.pageNumber.setValue(response.page_number, {
          emitEvent: false,
        });
      });
  }
}
