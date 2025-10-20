import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="space-y-12">
      <section class="text-center py-12 bg-gray-50 rounded-lg">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Welcome to DocuStax</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Your central hub for organized, searchable, and accessible documentation.
          Built for performance and developer happiness.
        </p>
      </section>

      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">Recent Documents</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (doc of recentDocuments(); track doc.slug) {
            <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
              <div class="p-6 flex-grow">
                <p class="text-sm text-gray-500 mb-2">{{ doc.metadata.category }}</p>
                <h3 class="text-xl font-bold mb-2 h-16">
                  <a [routerLink]="['/doc', doc.slug]" class="text-gray-800 hover:text-blue-600 transition-colors">{{ doc.metadata.title }}</a>
                </h3>
                <p class="text-gray-600 mb-4 h-24 overflow-hidden text-ellipsis">{{ doc.metadata.description }}</p>
                <div class="flex items-center text-sm text-gray-500">
                  <span>{{ doc.metadata.author }}</span>
                  <span class="mx-2">&bull;</span>
                  <span>{{ doc.metadata.date | date:'longDate' }}</span>
                </div>
              </div>
              <div class="bg-gray-50 px-6 py-3">
                <a [routerLink]="['/doc', doc.slug]" class="font-semibold text-blue-600 hover:text-blue-800">Read More &rarr;</a>
              </div>
            </div>
          } @empty {
            <p>No recent documents found.</p>
          }
        </div>
      </section>

      <section>
          <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">Categories</h2>
          <div class="flex flex-wrap gap-2">
            @for (category of categories(); track category) {
              <a [routerLink]="['/category', category]" class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full hover:bg-blue-200">{{ category }}</a>
            }
          </div>
      </section>
       <section>
          <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            @for (tag of tags(); track tag) {
              <a [routerLink]="['/tag', tag]" class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full hover:bg-gray-200">{{ tag }}</a>
            }
          </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private documentService = inject(DocumentService);
  recentDocuments = signal<Document[]>([]);
  categories = signal<string[]>([]);
  tags = signal<string[]>([]);

  constructor() {
    this.documentService.getDocuments().subscribe(docs => {
      this.recentDocuments.set(docs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()).slice(0, 3));
    });
    this.documentService.getAllCategories().subscribe(categories => this.categories.set(categories));
    this.documentService.getAllTags().subscribe(tags => this.tags.set(tags));
  }
}
