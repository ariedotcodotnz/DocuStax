import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta, SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-document-view',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    @if (document(); as doc) {
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <article class="prose lg:prose-xl max-w-none lg:col-span-3">
          <header class="mb-8">
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900">{{ doc.metadata.title }}</h1>
            <p class="text-lg text-gray-600 mt-2">{{ doc.metadata.description }}</p>
            <div class="mt-4 text-sm text-gray-500">
              <span>By {{ doc.metadata.author }}</span>
              <span class="mx-2">&bull;</span>
              <span>Published on {{ doc.metadata.date | date:'longDate' }}</span>
            </div>
          </header>

          <div class="border-t border-b py-4 my-8">
             <a [routerLink]="['/category', doc.metadata.category]" class="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full hover:bg-blue-200">{{ doc.metadata.category }}</a>
          </div>

          <div [innerHTML]="sanitizedHtmlContent()"></div>

          <footer class="mt-12 border-t pt-8">
            <a [href]="doc.pdfUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Download as PDF
            </a>
          </footer>

        </article>

        <aside class="lg:col-span-1">
          <div class="sticky top-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Tags</h2>
            <div class="flex flex-wrap gap-2 mb-8">
              @for (tag of doc.metadata.tags; track tag) {
                <a [routerLink]="['/tag', tag]" class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full hover:bg-gray-300">{{ tag }}</a>
              }
            </div>

            <h2 class="text-xl font-bold text-gray-800 mb-4">Related Documents</h2>
            <div class="space-y-4">
              @for(relatedDoc of relatedDocuments(); track relatedDoc.slug) {
                <div class="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
                  <h3 class="font-bold">
                    <a [routerLink]="['/doc', relatedDoc.slug]" class="text-gray-800 hover:text-blue-600 transition-colors">{{ relatedDoc.metadata.title }}</a>
                  </h3>
                  <p class="text-sm text-gray-500">{{ relatedDoc.metadata.category }}</p>
                </div>
              } @empty {
                <p>No related documents found.</p>
              }
            </div>
          </div>
        </aside>
      </div>
      @if (structuredData(); as data) {
        <div [innerHTML]="data"></div>
      }
    } @else {
      <p class="text-center text-gray-500">Loading document...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent {
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  document = signal<Document | undefined>(undefined);
  relatedDocuments = signal<Document[]>([]);
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
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        return this.documentService.getDocumentBySlug(slug!);
      })
    ).subscribe(doc => {
      this.document.set(doc);
      if (doc) {
        this.relatedDocuments.set(this.documentService.getRelatedDocuments(doc));
      }
    });

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
