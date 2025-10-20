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
  templateUrl: './category-list.component.html',
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
