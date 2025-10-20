import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

type ViewMode = 'card' | 'list' | 'image-card';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule],
  templateUrl: './archive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent {
  private documentService = inject(DocumentService);
  
  documents = this.documentService.documents;
  isLoaded = this.documentService.isLoaded;
  
  viewMode = signal<ViewMode>('card');
  searchTerm = signal('');
  selectedCategory = signal('All Categories');
  selectedTag = signal('All Tags');
  
  categories = computed(() => ['All Categories', ...this.documentService.getAllCategories()]);
  tags = computed(() => ['All Tags', ...this.documentService.getAllTags()]);

  filteredDocuments = computed(() => {
    const docs = this.documents();
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const tag = this.selectedTag();

    return docs.filter(doc => {
      const isCategoryMatch = category === 'All Categories' || doc.metadata.category === category;
      const isTagMatch = tag === 'All Tags' || doc.metadata.tags.includes(tag);
      const isSearchMatch = search === '' ||
        doc.metadata.title.toLowerCase().includes(search) ||
        doc.metadata.description.toLowerCase().includes(search) ||
        doc.htmlContent.toLowerCase().replace(/<[^>]*>/g, ' ').includes(search);
      
      return isCategoryMatch && isTagMatch && isSearchMatch;
    });
  });

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
  }
}
