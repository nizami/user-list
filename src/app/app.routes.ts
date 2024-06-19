import { Routes } from '@angular/router';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersDashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
