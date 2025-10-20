import { Injectable, signal } from '@angular/core';
import { Document } from '../models/document.model';
import { of, Observable } from 'rxjs';

// Mock Data
const MOCK_DOCUMENTS: Document[] = [
  {
    slug: 'getting-started-with-angular',
    metadata: {
      title: 'Getting Started with Angular',
      description: 'A comprehensive guide to start your journey with the Angular framework.',
      author: 'John Doe',
      date: '2023-10-26',
      tags: ['angular', 'framework', 'javascript', 'getting-started'],
      category: 'Web Development'
    },
    htmlContent: '<h1>Welcome to Angular</h1><p>This is a sample document content. Angular is a platform for building mobile and desktop web applications.</p><p>Explore the official documentation to learn more about components, templates, and services.</p>',
    pdfUrl: '/assets/documents/getting-started-with-angular.pdf'
  },
  {
    slug: 'advanced-typescript-techniques',
    metadata: {
      title: 'Advanced TypeScript Techniques',
      description: 'Explore advanced features of TypeScript to write more robust and maintainable code.',
      author: 'Jane Smith',
      date: '2023-09-15',
      tags: ['typescript', 'advanced', 'programming'],
      category: 'Web Development'
    },
    htmlContent: '<h1>Advanced TypeScript</h1><p>Generics, decorators, and more. Learn how to leverage the full power of TypeScript\'s type system.</p>',
    pdfUrl: '/assets/documents/advanced-typescript-techniques.pdf'
  },
  {
    slug: 'understanding-rxjs',
    metadata: {
      title: 'Understanding RxJS',
      description: 'A deep dive into reactive programming with RxJS for managing asynchronous data streams.',
      author: 'Peter Jones',
      date: '2023-08-01',
      tags: ['rxjs', 'reactive-programming', 'javascript'],
      category: 'Web Development'
    },
    htmlContent: '<h1>RxJS Deep Dive</h1><p>Observables, operators, and subjects are the core concepts of RxJS. This document explains them in detail.</p>',
    pdfUrl: '/assets/documents/understanding-rxjs.pdf'
  },
  {
    slug: 'seo-for-modern-web-apps',
    metadata: {
      title: 'SEO for Modern Web Apps',
      description: 'Best practices for search engine optimization in single-page applications (SPAs).',
      author: 'Alice Williams',
      date: '2023-11-05',
      tags: ['seo', 'web-development', 'spa'],
      category: 'Marketing'
    },
    htmlContent: '<h1>SEO for SPAs</h1><p>Learn how to make your app visible to search engines using techniques like server-side rendering and prerendering.</p>',
    pdfUrl: '/assets/documents/seo-for-modern-web-apps.pdf'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = signal<Document[]>(MOCK_DOCUMENTS);

  getDocuments(): Observable<Document[]> {
    return of(this.documents());
  }

  getDocumentBySlug(slug: string): Observable<Document | undefined> {
    return of(this.documents().find(doc => doc.slug === slug));
  }

  getRelatedDocuments(currentDoc: Document): Document[] {
    return this.documents()
      .filter(doc => doc.slug !== currentDoc.slug) // Exclude the current document
      .filter(doc => doc.metadata.category === currentDoc.metadata.category || doc.metadata.tags.some(tag => currentDoc.metadata.tags.includes(tag)))
      .slice(0, 3); // Return up to 3 related documents
  }

  getDocumentsByCategory(category: string): Observable<Document[]> {
    return of(this.documents().filter(doc => doc.metadata.category === category));
  }

  getDocumentsByTag(tag: string): Observable<Document[]> {
    return of(this.documents().filter(doc => doc.metadata.tags.includes(tag)));
  }

  getAllCategories(): Observable<string[]> {
    const categories = this.documents().map(doc => doc.metadata.category);
    return of([...new Set(categories)]);
  }

  getAllTags(): Observable<string[]> {
    const tags = this.documents().flatMap(doc => doc.metadata.tags);
    return of([...new Set(tags)]);
  }
}
