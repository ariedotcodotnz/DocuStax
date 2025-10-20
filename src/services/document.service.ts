import { Injectable, signal } from '@angular/core';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private _documents = signal<Document[]>([]);
  private _isLoaded = signal(false);

  public readonly documents = this._documents.asReadonly();
  public readonly isLoaded = this._isLoaded.asReadonly();

  constructor() {
    this.loadDocuments();
  }

  private async loadDocuments(): Promise<void> {
    if (this.isLoaded() || this._documents().length > 0) return;

    try {
      const manifestResponse = await fetch('documents/manifest.json');
      if (!manifestResponse.ok) throw new Error('Failed to load manifest.json');
      const slugs: string[] = await manifestResponse.json();

      const docs: Document[] = await Promise.all(slugs.map(async (slug) => {
        const metaResponse = await fetch(`documents/${slug}/metadata.json`);
        const metadata = await metaResponse.json();
        
        const htmlResponse = await fetch(`documents/${slug}/document.html`);
        const htmlContent = await htmlResponse.text();

        return {
          slug,
          metadata,
          htmlContent,
          pdfUrl: `documents/${slug}/document.pdf`,
        };
      }));
      
      this._documents.set(docs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()));
    } catch (error) {
      console.error("Failed to load documents:", error);
      this._documents.set([]);
    } finally {
      this._isLoaded.set(true);
    }
  }

  getDocumentBySlug(slug: string): Document | undefined {
    return this.documents().find(doc => doc.slug === slug);
  }

  getRelatedDocuments(currentDoc: Document): Document[] {
    return this.documents()
      .filter(doc => doc.slug !== currentDoc.slug)
      .filter(doc => doc.metadata.category === currentDoc.metadata.category || doc.metadata.tags.some(tag => currentDoc.metadata.tags.includes(tag)))
      .slice(0, 3);
  }

  getDocumentsByCategory(category: string): Document[] {
    return this.documents().filter(doc => doc.metadata.category === category);
  }

  getDocumentsByTag(tag: string): Document[] {
    return this.documents().filter(doc => doc.metadata.tags.includes(tag));
  }

  getAllCategories(): string[] {
    const categories = this.documents().map(doc => doc.metadata.category);
    return [...new Set(categories)];
  }

  getAllTags(): string[] {
    const tags = this.documents().flatMap(doc => doc.metadata.tags);
    return [...new Set(tags)];
  }
}
