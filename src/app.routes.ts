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
    path: 'browse',
    loadComponent: () => import('./components/archive/archive.component').then(m => m.ArchiveComponent),
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent),
  },
  {
    path: 'category/:category',
    loadComponent: () => import('./components/category-list/category-list.component').then(m => m.CategoryListComponent),
  },
  {
    path: 'tags',
    loadComponent: () => import('./components/tags/tags.component').then(m => m.TagsComponent),
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
    path: 'archive', // Redirect old archive link to the new browse page
    redirectTo: 'browse'
  },
  {
    path: '404',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
