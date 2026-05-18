import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'polls/:id',
    loadComponent: () => import('./components/poll-detail/poll-detail.component').then(m => m.PollDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'polls/:id/results',
    loadComponent: () => import('./components/results/results.component').then(m => m.ResultsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
