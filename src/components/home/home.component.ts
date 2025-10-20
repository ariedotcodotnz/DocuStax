import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private documentService = inject(DocumentService);

  // FIX: Replaced signals and constructor logic with computed signals for a more reactive and correct approach.
  recentDocuments = computed(() => this.documentService.documents().slice(0, 3));
  categories = computed(() => this.documentService.getAllCategories());
  tags = computed(() => this.documentService.getAllTags());
}