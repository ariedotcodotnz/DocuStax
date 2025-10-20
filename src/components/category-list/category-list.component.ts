import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="space-y-8">
      <h1 class="text-4xl font-extrabold text-gray-800">Category: <span class="text-blue-600">{{ category() }}</span></h1>
      
      <div class="space-y-6">
        @for (doc of documents(); track doc.slug) {
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <p class="text-sm text-gray-500 mb-2">{{ doc.metadata.date | date:'longDate' }}</p>
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
          <p>No documents found in this category.</p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  private documentService = inject(DocumentService);
  private route = inject(ActivatedRoute);

  // FIX: Refactored to use computed signals. This fixes the incorrect usage of switchMap which caused a type error,
  // and makes the component reactively update when route params or documents change.
  private paramMap = toSignal(this.route.paramMap);
  category = computed(() => this.paramMap()?.get('category') ?? '');
  documents = computed(() => {
    const category = this.category();
    if (category) {
      return this.documentService.getDocumentsByCategory(category);
    }
    return [];
  });
}
