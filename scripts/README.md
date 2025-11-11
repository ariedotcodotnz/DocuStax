# DocuStax Build Scripts

This directory contains build-time scripts for generating manifests, thumbnails, and sitemaps.

## Scripts

### generate-manifest.mjs

Automatically generates the `documents/manifest.json` file by scanning the documents directory for all document folders.

**How it works:**
- Scans the `documents/` directory for subdirectories
- Each subdirectory containing a `metadata.json` file is considered a document
- Generates `manifest.json` with an alphabetically sorted list of document slugs

**Usage:**

```bash
# Generate manifest
node scripts/generate-manifest.mjs

# Or via npm
npm run build:manifest
```

**Output:**
- Creates/updates `documents/manifest.json`
- Lists all document slugs found in the documents directory

**Note:** You no longer need to manually update `manifest.json`. Simply add a new folder with a `metadata.json` file to the documents directory, and the script will automatically detect it during the next build or dev run.

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
1. `npm run build:manifest` - Generate document manifest
2. `npm run build:thumbnails` - Generate thumbnails
3. `ng build` - Build Angular application
4. `npm run build:sitemap` - Generate sitemap

The manifest is also automatically generated when running the dev server:

```bash
npm run dev
```

## Manual Execution

You can run scripts individually:

```bash
# Generate manifest only
npm run build:manifest

# Generate thumbnails only
npm run build:thumbnails

# Generate sitemap only
npm run build:sitemap
```
