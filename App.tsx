import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import Header from './components/Header';
import { getAllDocuments } from './services/documentService';
import { Document } from './types';
import Seo from './components/Seo';

// SitemapPage component generates and displays the XML sitemap.
// It's defined here to avoid creating a new file, adhering to the environment constraints.
const SitemapPage: React.FC = () => {
    // In a real SSG, baseUrl would be a build-time env variable.
    // Here, we derive it dynamically on the client.
    const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '');

    const documents = getAllDocuments();

    const generateSitemapXml = (docs: Document[]) => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Home page URL
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}#/</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>1.0</priority>\n`;
        xml += `  </url>\n`;

        // Document page URLs
        docs.forEach(doc => {
            xml += `  <url>\n`;
            // Note the hash (#) for HashRouter compatibility
            xml += `    <loc>${baseUrl}#/documents/${doc.slug}</loc>\n`;
            xml += `    <lastmod>${doc.metadata.date}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;
        return xml;
    };

    const sitemapContent = generateSitemapXml(documents);

    return (
        <>
            <Seo
                title="Sitemap"
                description="XML Sitemap for the Static Document Library, for use by search engine crawlers."
            />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sitemap</h1>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    This page is intended for search engine crawlers. In a true static site generator (SSG) setup, this content would be served as a static <code>sitemap.xml</code> file.
                    You can add this URL to your <code>robots.txt</code> file: <code>Sitemap: ${baseUrl}#/sitemap</code>
                </p>
                <div
                    className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200"
                    aria-label="Sitemap XML content"
                >
                    <pre><code>{sitemapContent}</code></pre>
                </div>
            </div>
        </>
    );
};


function App() {
    return (
        <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/documents/:slug" element={<DocumentPage />} />
                    <Route path="/sitemap" element={<SitemapPage />} />
                </Routes>
            </main>
            <footer className="text-center py-4 text-gray-500 text-sm">
                <p>&copy; 2024 Static Document Library. All rights reserved.</p>
                <Link to="/sitemap" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block">
                    Sitemap
                </Link>
            </footer>
        </div>
    );
}

export default App;