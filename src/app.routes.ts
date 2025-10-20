import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'doc/:slug',
    loadComponent: () => import('./components/document-view/document-view.component').then(m => m.DocumentViewComponent),
  },
  {
    path: 'archive',
    loadComponent: () => import('./components/archive/archive.component').then(m => m.ArchiveComponent),
  },
  {
    path: 'category/:category',
    loadComponent: () => import('./components/category-list/category-list.component').then(m => m.CategoryListComponent),
  },
  {
    path: 'tag/:tag',
    loadComponent: () => import('./components/tag-list/tag-list.component').then(m => m.TagListComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./components/faq/faq.component').then(m => m.FaqComponent),
  },
  {
    path: 'legal',
    loadComponent: () => import('./components/legal/legal.component').then(m => m.LegalComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
