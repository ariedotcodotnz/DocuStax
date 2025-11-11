import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document, Person } from '../../models/document.model';
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
  selectedPerson = signal('All People');

  categories = computed(() => ['All Categories', ...this.documentService.getAllCategories()]);
  tags = computed(() => ['All Tags', ...this.documentService.getAllTags()]);
  people = computed(() => {
    const allPeople = this.documentService.getAllPeople();
    return ['All People', ...allPeople.map(p => `${p.firstname} ${p.lastname}`)];
  });

  filteredDocuments = computed(() => {
    const docs = this.documents();
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const tag = this.selectedTag();
    const person = this.selectedPerson();

    return docs.filter(doc => {
      const isCategoryMatch = category === 'All Categories' || doc.metadata.category === category;
      const isTagMatch = tag === 'All Tags' || doc.metadata.tags.includes(tag);
      const isPersonMatch = person === 'All People' ||
        (doc.metadata.people || []).some(p => `${p.firstname} ${p.lastname}` === person);
      const isSearchMatch = search === '' ||
        doc.metadata.title.toLowerCase().includes(search) ||
        doc.metadata.description.toLowerCase().includes(search) ||
        doc.htmlContent.toLowerCase().replace(/<[^>]*>/g, ' ').includes(search);

      return isCategoryMatch && isTagMatch && isPersonMatch && isSearchMatch;
    });
  });

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
  }
}
