export interface Person {
  firstname: string;
  lastname: string;
}

export interface DocumentMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  category: string;
  people: Person[];
}

export interface Document {
  slug: string;
  metadata: DocumentMetadata;
  htmlContent: string;
  pdfUrl: string;
  thumbnailUrl?: string;
}
