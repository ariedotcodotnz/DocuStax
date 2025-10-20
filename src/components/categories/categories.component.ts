import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { RouterLink } from '@angular/router';
import { Document } from '../../models/document.model';

interface CategoryGroup {
  name: string;
  documents: Document[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private documentService = inject(DocumentService);

  isLoaded = this.documentService.isLoaded;

  categoryGroups = computed<CategoryGroup[]>(() => {
    const docs = this.documentService.documents();
    const categories = this.documentService.getAllCategories();
    
    return categories.map(category => ({
      name: category,
      documents: docs.filter(doc => doc.metadata.category === category)
    })).sort((a,b) => a.name.localeCompare(b.name));
  });
}
