import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="space-y-8">
      <h1 class="text-4xl font-extrabold text-gray-800">Document Archive</h1>
      <p class="text-lg text-gray-600">Browse through all our available documents.</p>

      <div class="space-y-6">
        @for (doc of documents(); track doc.slug) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <p class="text-sm text-gray-500 mb-2">{{ doc.metadata.date | date:'longDate' }} &bull; {{ doc.metadata.category }}</p>
            <h2 class="text-2xl font-bold mb-2">
              <a [routerLink]="['/doc', doc.slug]" class="text-gray-800 hover:text-blue-600 transition-colors">{{ doc.metadata.title }}</a>
            </h2>
            <p class="text-gray-600 mb-4">{{ doc.metadata.description }}</p>
            <div class="flex flex-wrap gap-2">
              @for (tag of doc.metadata.tags; track tag) {
                <a [routerLink]="['/tag', tag]" class="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-gray-300">{{ tag }}</a>
              }
            </div>
          </div>
        } @empty {
          <p>No documents found in the archive.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent {
  private documentService = inject(DocumentService);
  documents = signal<Document[]>([]);

  constructor() {
    this.documentService.getDocuments().subscribe(docs => {
      this.documents.set(docs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()));
    });
  }
}
