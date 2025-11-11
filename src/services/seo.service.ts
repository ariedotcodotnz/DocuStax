import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);

  private baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://docustax.example.com';
  private defaultTitle = 'DocuStax - Static Document Library';
  private defaultDescription = 'Your central hub for organized, searchable, and accessible documentation. Built for performance and developer happiness.';
  private defaultImage = `${this.baseUrl}/assets/og-image.png`;

  constructor() {
    // Update canonical URL on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCanonicalUrl(event.urlAfterRedirects);
      }
    });
  }

  updateTitle(title?: string): void {
    const fullTitle = title ? `${title} | DocuStax` : this.defaultTitle;
    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
  }

  updateDescription(description?: string): void {
    const desc = description || this.defaultDescription;
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:description', content: desc });
    this.metaService.updateTag({ name: 'twitter:description', content: desc });
  }

  updateImage(imageUrl?: string): void {
    const image = imageUrl || this.defaultImage;
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }

  updateKeywords(keywords: string[]): void {
    if (keywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: keywords.join(', ') });
    }
  }

  updateCanonicalUrl(url?: string): void {
    const canonical = url ? `${this.baseUrl}${url}` : this.baseUrl;
    this.metaService.updateTag({ property: 'og:url', content: canonical });

    // Update or create canonical link tag
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', canonical);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonical);
      document.head.appendChild(link);
    }
  }

  updateAuthor(author?: string): void {
    if (author) {
      this.metaService.updateTag({ name: 'author', content: author });
    }
  }

  updatePublishedDate(date?: string): void {
    if (date) {
      this.metaService.updateTag({ property: 'article:published_time', content: date });
    }
  }

  updateTags(tags: string[]): void {
    // Remove existing article:tag tags
    const existingTags = this.metaService.getTags('property="article:tag"');
    existingTags.forEach(tag => this.metaService.removeTagElement(tag));

    // Add new tags
    tags.forEach(tag => {
      this.metaService.addTag({ property: 'article:tag', content: tag });
    });
  }

  updateMetaTags(options: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string[];
    author?: string;
    publishedDate?: string;
    tags?: string[];
    url?: string;
  }): void {
    if (options.title) this.updateTitle(options.title);
    if (options.description) this.updateDescription(options.description);
    if (options.image) this.updateImage(options.image);
    if (options.keywords) this.updateKeywords(options.keywords);
    if (options.author) this.updateAuthor(options.author);
    if (options.publishedDate) this.updatePublishedDate(options.publishedDate);
    if (options.tags) this.updateTags(options.tags);
    if (options.url) this.updateCanonicalUrl(options.url);
  }

  setDefaultMetaTags(): void {
    this.updateTitle();
    this.updateDescription();
    this.updateImage();
    this.updateCanonicalUrl();
  }
}
