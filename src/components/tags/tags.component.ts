import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  private documentService = inject(DocumentService);
  isLoaded = this.documentService.isLoaded;
  tags = computed(() => this.documentService.getAllTags().sort());
}
