import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  openIndex = signal<number | null>(0);

  faqs = signal<FaqItem[]>([
    {
      question: 'What is DocuStax?',
      answer: 'DocuStax is a static document management system designed for hosting public-facing libraries of documents. It focuses on performance, SEO, and ease of use, without requiring a backend server.'
    },
    {
      question: 'How does the search functionality work?',
      answer: 'The search is powered by a client-side JavaScript library. At build time, an index of all document content is created. When you search, this index is queried directly in your browser, providing instant results.'
    },
    {
      question: 'Can I add my own documents?',
      answer: 'Yes. The system is designed to automatically discover documents. You simply need to add a new folder under the `/documents` directory containing your `document.html`, `document.pdf`, and `metadata.json` files, then update the `manifest.json` file.'
    },
    {
      question: 'Is this system secure?',
      answer: 'Because DocuStax generates a fully static website, it is inherently very secure. There is no database to hack, no server-side code to exploit, and no user accounts to compromise. The attack surface is minimal.'
    },
    {
      question: 'How do I deploy a DocuStax site?',
      answer: 'You can deploy the output static files to any static hosting provider like Netlify, Vercel, GitHub Pages, AWS S3, or a traditional web server. The build process generates a simple directory of HTML, CSS, and JS files.'
    }
  ]);

  toggle(index: number) {
    this.openIndex.update(currentIndex => (currentIndex === index ? null : index));
  }
}
