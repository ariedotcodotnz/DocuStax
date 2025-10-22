<div align="center">

# 📚 DocuStax

### Your Modern Static Document Management System

*A powerful, SEO-friendly platform for hosting and managing OCR'd PDF documents with HTML versions, featuring full-text search, filtering, and beautiful dark mode support.*

[![Built with Angular](https://img.shields.io/badge/Built%20with-Angular%2020-DD0031?style=flat&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Demo]([#-demo](https://847c818f.docustax.pages.dev/#/)) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-project-structure) • [Contributing](#-contributing)

</div>

---
## Demo
https://847c818f.docustax.pages.dev/

## ✨ Features

DocuStax is designed to be a **production-ready static document library** that combines the power of modern web technologies with simplicity and performance:

- 📄 **Document Management** - Host and organize OCR'd PDF documents with clean HTML versions
- 🔍 **Full-Text Search** - Powerful search functionality to find documents instantly
- 🏷️ **Smart Filtering** - Filter documents by categories, tags, authors, and dates
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark mode support
- 📱 **Mobile-First** - Fully responsive layout that works on all devices
- 🚀 **SEO Optimized** - Built-in sitemap generation and meta tags for better discoverability
- ⚡ **Lightning Fast** - Static site architecture for instant page loads
- 🎯 **Easy Navigation** - Intuitive browsing through categories and tags
- 📊 **Document Metadata** - Rich metadata support (author, date, description, tags)
- 🌐 **Static Deployment** - Deploy anywhere - Cloudflare Pages, Netlify, Vercel, GitHub Pages

## 🎯 Use Cases

DocuStax is perfect for:

- 📚 Corporate document libraries
- 📖 Knowledge base portals
- 🏛️ Government document archives
- 📋 Policy and procedure documentation
- 🎓 Educational resource centers
- 📑 API documentation hosting
- 📝 Legal document repositories

## 🛠️ Technology Stack

- **Framework**: [Angular 20](https://angular.io/) - Modern, powerful frontend framework
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Build Tool**: [Angular CLI](https://angular.io/cli) - Official Angular build system
- **Routing**: Angular Router with lazy loading support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## 🚀 Installation

Get DocuStax up and running in minutes:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ariedotcodotnz/DocuStax.git
   cd DocuStax
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:4200` to see your document library in action!

## 📖 Usage

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Adding Documents

Documents are stored in the `documents/` directory. Each document has its own folder with:

1. **metadata.json** - Document metadata (title, description, author, date, tags, category)
2. **document.html** - The HTML version of your document

Example `metadata.json`:
```json
{
  "title": "Privacy Policy Update 2024",
  "description": "An updated version of our company privacy policy",
  "author": "Legal Department",
  "date": "2024-01-01",
  "tags": ["legal", "policy", "privacy"],
  "category": "Legal Documents"
}
```

Then register your document in `documents/manifest.json`:
```json
[
  "privacy-policy-2024",
  "your-new-document-slug"
]
```

### Configuration

Customize DocuStax by modifying:

- **metadata.json** (root) - Application name and description
- **tailwind.config.js** - Theme colors and styling
- **angular.json** - Build and deployment settings

## 📁 Project Structure

```
DocuStax/
├── documents/              # Document storage
│   ├── manifest.json      # List of all documents
│   └── [document-slug]/   # Individual document folders
│       ├── metadata.json  # Document metadata
│       └── document.html  # Document content
├── src/
│   ├── components/        # Reusable Angular components
│   ├── services/          # Business logic and data services
│   ├── models/            # TypeScript interfaces and types
│   └── app.component.*    # Main application component
├── angular.json           # Angular CLI configuration
├── tailwind.config.js     # TailwindCSS configuration
└── package.json           # Project dependencies
```

## 🌐 Deployment

DocuStax can be deployed to any static hosting platform:

### Cloudflare Pages
```bash
npm run build
# Upload dist/cloudflare to Cloudflare Pages
```

### Netlify / Vercel / GitHub Pages
```bash
npm run build
# Deploy the dist/ directory
```

The build output is optimized for static hosting with:
- Minified assets
- Tree-shaken bundles
- Pre-rendered routes (where applicable)
- Optimized images

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests (if applicable)
- Updates documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Angular and TailwindCSS
- Icons and design inspiration from modern document management systems
- Community feedback and contributions

## 📞 Support

Having issues? Found a bug? Have a feature request?

- Open an [issue](https://github.com/ariedotcodotnz/DocuStax/issues)
- Start a [discussion](https://github.com/ariedotcodotnz/DocuStax/discussions)
- Check existing [documentation](https://github.com/ariedotcodotnz/DocuStax/wiki)

---

<div align="center">

**[⬆ back to top](#-docustax)**

Made with ❤️ by the DocuStax team

</div>
