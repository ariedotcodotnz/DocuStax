import { Injectable } from '@angular/core';
import { Document, DocumentMetadata } from '../models/document.model';
import { Observable, from, map, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documents$: Observable<Document[]>;
  private allDocuments: Document[] = [];

  constructor() {
    this.documents$ = from(this.fetchAllDocuments()).pipe(
      tap(docs => {
        this.allDocuments = docs;
      }),
      shareReplay(1) // Cache the result and replay for subsequent subscribers
    );
  }

  private async fetchAllDocuments(): Promise<Document[]> {
    try {
      const manifestResponse = await fetch('/documents/manifest.json');
      if (!manifestResponse.ok) {
        throw new Error('Could not fetch manifest.json');
      }
      const slugs: string[] = await manifestResponse.json();

      const documentPromises = slugs.map(slug => this.fetchDocumentData(slug));
      const documents = await Promise.all(documentPromises);
      
      // Filter out any undefined results if a document failed to load
      return documents.filter((doc): doc is Document => doc !== undefined);
    } catch (error) {
      console.error("Error fetching all documents:", error);
      return [];
    }
  }

  private async fetchDocumentData(slug: string): Promise<Document | undefined> {
    try {
      const [metadataResponse, htmlResponse] = await Promise.all([
        fetch(`/documents/${slug}/metadata.json`),
        fetch(`/documents/${slug}/document.html`)
      ]);

      if (!metadataResponse.ok || !htmlResponse.ok) {
        console.error(`Could not fetch data for slug: ${slug}`);
        return undefined;
      }
      
      const metadata: DocumentMetadata = await metadataResponse.json();
      const htmlContent: string = await htmlResponse.text();

      return {
        slug,
        metadata,
        htmlContent,
        pdfUrl: `/documents/${slug}/document.pdf`
      };
    } catch (error) {
      console.error(`Error fetching document data for ${slug}:`, error);
      return undefined;
    }
  }

  getDocuments(): Observable<Document[]> {
    return this.documents$;
  }

  getDocumentBySlug(slug: string): Observable<Document | undefined> {
    return this.documents$.pipe(
      map(docs => docs.find(doc => doc.slug === slug))
    );
  }

  getRelatedDocuments(currentDoc: Document): Document[] {
    // This now uses the cached `allDocuments` array which is populated when `getDocuments` is first called
    return this.allDocuments.filter(doc => 
        doc.slug !== currentDoc.slug && 
        (doc.metadata.category === currentDoc.metadata.category || doc.metadata.tags.some(tag => currentDoc.metadata.tags.includes(tag)))
    ).slice(0, 3);
  }

  getAllCategories(): string[] {
    const categories = this.allDocuments.map(doc => doc.metadata.category);
    return [...new Set(categories)];
  }

  getAllTags(): string[] {
    const tags = this.allDocuments.flatMap(doc => doc.metadata.tags);
    return [...new Set(tags)];
  }
}
