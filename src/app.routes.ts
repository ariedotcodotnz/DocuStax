
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'DocuStax - Home'
  },
  {
    path: 'document/:slug',
    loadComponent: () => import('./components/document-view/document-view.component').then(m => m.DocumentViewComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
