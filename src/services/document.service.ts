import { Injectable, signal } from '@angular/core';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private _documents = signal<Document[]>([]);
  private _isLoaded = signal(false);
  private _error = signal<string | null>(null);

  public readonly documents = this._documents.asReadonly();
  public readonly isLoaded = this._isLoaded.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor() {
    this.loadDocuments();
  }

  private async loadDocuments(): Promise<void> {
    if (this.isLoaded() || this._documents().length > 0) return;

    try {
      const manifestResponse = await fetch('documents/manifest.json');
      if (!manifestResponse.ok) {
        throw new Error(`Failed to load manifest.json: ${manifestResponse.status} ${manifestResponse.statusText}`);
      }
      const slugs: string[] = await manifestResponse.json();

      const docs: Document[] = await Promise.all(slugs.map(async (slug) => {
        const metaResponse = await fetch(`documents/${slug}/metadata.json`);
        if (!metaResponse.ok) {
          throw new Error(`Failed to load metadata for ${slug}: ${metaResponse.status}`);
        }
        const metadata = await metaResponse.json();

        const htmlResponse = await fetch(`documents/${slug}/document.html`);
        if (!htmlResponse.ok) {
          throw new Error(`Failed to load HTML for ${slug}: ${htmlResponse.status}`);
        }
        let htmlContent = await htmlResponse.text();

        // Extract styles from head and body content from full HTML document
        let styles = '';
        const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) {
          const styleMatches = headMatch[1].match(/<style[^>]*>[\s\S]*?<\/style>/gi);
          if (styleMatches) {
            styles = styleMatches.join('\n');
          }
        }

        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          htmlContent = styles + bodyMatch[1];
        }

        // Fix relative image and asset paths to absolute paths
        // Replace src="slug_files/..." with src="documents/slug/slug_files/..."
        htmlContent = htmlContent.replace(
          /src="([^"]*_files\/[^"]*)"/gi,
          `src="documents/${slug}/$1"`
        );

        // Also fix src='...' with single quotes
        htmlContent = htmlContent.replace(
          /src='([^']*_files\/[^']*)'/gi,
          `src="documents/${slug}/$1"`
        );

        // Fix href for any linked assets (double quotes)
        htmlContent = htmlContent.replace(
          /href="([^"]*_files\/[^"]*)"/gi,
          `href="documents/${slug}/$1"`
        );

        // Fix href with single quotes
        htmlContent = htmlContent.replace(
          /href='([^']*_files\/[^']*)'/gi,
          `href="documents/${slug}/$1"`
        );

        // Fix background images in inline styles
        htmlContent = htmlContent.replace(
          /url\((['"]?)([^'"()]*_files\/[^'"()]*)\1\)/gi,
          `url("documents/${slug}/$2")`
        );

        // Check if thumbnail exists
        let thumbnailUrl: string | undefined;
        try {
          const thumbnailResponse = await fetch(`documents/${slug}/thumbnail.png`, { method: 'HEAD' });
          if (thumbnailResponse.ok) {
            thumbnailUrl = `documents/${slug}/thumbnail.png`;
          }
        } catch {
          // Thumbnail doesn't exist, that's okay
        }

        return {
          slug,
          metadata,
          htmlContent,
          pdfUrl: `documents/${slug}/document.pdf`,
          thumbnailUrl,
        };
      }));
      
      this._documents.set(docs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()));
      this._error.set(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load documents';
      console.error("Failed to load documents:", error);
      this._error.set(errorMessage);
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
