import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private documentService = inject(DocumentService);

  documents = signal<Document[]>([]);
  
  categories = signal<string[]>([]);
  tags = signal<string[]>([]);

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedTag = signal<string>('');
  
  constructor() {
    this.documentService.getDocuments().subscribe(docs => {
      this.documents.set(docs);
      // Populate filters only after documents have been loaded
      this.categories.set(this.documentService.getAllCategories());
      this.tags.set(this.documentService.getAllTags());
    });
  }

  filteredDocuments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const tag = this.selectedTag();
    
    return this.documents().filter(doc => {
      const termMatch = term === '' ||
        doc.metadata.title.toLowerCase().includes(term) ||
        doc.metadata.description.toLowerCase().includes(term) ||
        doc.htmlContent.toLowerCase().includes(term);

      const categoryMatch = category === '' || doc.metadata.category === category;
      
      const tagMatch = tag === '' || doc.metadata.tags.includes(tag);

      return termMatch && categoryMatch && tagMatch;
    });
  });

  onSearchTermChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value);
  }
  
  onTagChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTag.set(value);
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedTag.set('');
  }
}
