import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta, SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document-view',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './document-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent {
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  // FIX: Refactored to use computed signals based on route params and document service data.
  // This fixes the incorrect use of switchMap with a non-observable return value and also resolves potential race conditions.
  private paramMap = toSignal(this.route.paramMap);

  document = computed(() => {
    const slug = this.paramMap()?.get('slug');
    if (!slug) {
      return undefined;
    }
    return this.documentService.getDocumentBySlug(slug);
  });

  relatedDocuments = computed(() => {
    const doc = this.document();
    if (doc) {
      return this.documentService.getRelatedDocuments(doc);
    }
    return [];
  });

  sanitizedHtmlContent = computed<SafeHtml | undefined>(() => {
    const doc = this.document();
    if (doc) {
      return this.sanitizer.bypassSecurityTrustHtml(doc.htmlContent);
    }
    return undefined;
  });

  structuredData = computed<SafeHtml | undefined>(() => {
    const doc = this.document();
    if (doc) {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': doc.metadata.title,
        'author': {
          '@type': 'Person',
          'name': doc.metadata.author,
        },
        'datePublished': doc.metadata.date,
        'description': doc.metadata.description,
      };
      const script = `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      return this.sanitizer.bypassSecurityTrustHtml(script);
    }
    return undefined;
  });

  constructor() {
    effect(() => {
      const doc = this.document();
      if (doc) {
        const title = `${doc.metadata.title} | DocuStax`;
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: doc.metadata.description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: doc.metadata.description });
        this.metaService.updateTag({ property: 'og:type', content: 'article' });
      }
    });
  }
}
