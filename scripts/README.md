# DocuStax Build Scripts

This directory contains build-time scripts for generating thumbnails and sitemaps.

## Scripts

### generate-thumbnails.mjs

Generates thumbnail images from the first page of PDF documents.

**Prerequisites:**
- poppler-utils must be installed on your system

```bash
# Ubuntu/Debian
sudo apt-get install poppler-utils

# macOS
brew install poppler
```

**Usage:**

```bash
# Generate thumbnails for all documents (skip existing)
node scripts/generate-thumbnails.mjs

# Regenerate all thumbnails (force overwrite)
node scripts/generate-thumbnails.mjs --force
```

**Output:**
- Creates `thumbnail.png` (400px width) in each document folder
- Maintains aspect ratio
- Uses PNG format for high quality

### generate-sitemap.mjs

Generates an XML sitemap for SEO optimization.

**Usage:**

```bash
# Generate sitemap
node scripts/generate-sitemap.mjs

# With custom base URL
BASE_URL=https://yourdomain.com node scripts/generate-sitemap.mjs
```

**Output:**
- Creates `dist/sitemap.xml`
- Includes all document pages, categories, and tags
- Sets appropriate priorities and change frequencies

## Build Process

These scripts are automatically run during the build process:

```bash
npm run build
```

This executes:
1. `npm run build:thumbnails` - Generate thumbnails
2. `ng build` - Build Angular application
3. `npm run build:sitemap` - Generate sitemap

## Manual Execution

You can run scripts individually:

```bash
# Generate thumbnails only
npm run build:thumbnails

# Generate sitemap only
npm run build:sitemap
```
