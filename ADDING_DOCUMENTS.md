# Adding Documents to DocuStax

This guide explains how to add new documents to the DocuStax document management system.

## Document Structure

Each document should be organized in its own folder under the `documents/` directory with the following structure:

```
documents/
  └── your-document-slug/
      ├── metadata.json          # Required: Document metadata
      ├── document.html          # Required: HTML version of the document
      ├── document.pdf           # Required: PDF version of the document
      └── your-document-slug_files/  # Optional: Images and assets
          ├── image-1.jpg
          ├── image-2.jpg
          └── ...
```

## Step-by-Step Guide

### 1. Create Document Folder

Create a new folder in `documents/` with a URL-friendly slug name:

```bash
mkdir documents/my-new-document
```

**Slug naming guidelines:**
- Use lowercase letters
- Replace spaces with hyphens (-)
- Remove special characters
- Keep it descriptive but concise

### 2. Add Document Files

#### Required Files:

**a) `metadata.json`**
```json
{
  "title": "Your Document Title",
  "description": "A brief description of the document content",
  "author": "Author Name",
  "date": "YYYY-MM-DD",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Category Name"
}
```

**b) `document.html`**
- Full HTML document with complete structure
- Can include embedded images (see Image Assets section)
- Styles can be inline or in `<style>` tags in the `<head>`

**c) `document.pdf`**
- PDF version of the same document
- Used for downloads and viewing in PDF reader

### 3. Add Images and Assets (Optional)

If your HTML includes images:

1. Create an assets folder: `your-document-slug_files/`
2. Place all images in this folder
3. Reference them in HTML using relative paths:
   ```html
   <img src="your-document-slug_files/image.jpg" alt="Description">
   ```

**Note:** The system automatically converts relative paths to absolute paths during loading.

### 4. Update Manifest

Add your document slug to `documents/manifest.json`:

```json
[
  "existing-document-1",
  "existing-document-2",
  "my-new-document"
]
```

**Important:** The order in this file doesn't matter as documents are sorted by date.

## Example Document

Here's a complete example for a document called "board-meeting-2025":

### Folder Structure:
```
documents/
  └── board-meeting-2025/
      ├── metadata.json
      ├── document.html
      ├── document.pdf
      └── board-meeting-2025_files/
          ├── logo.png
          └── signature.jpg
```

### metadata.json:
```json
{
  "title": "Board Meeting Minutes - January 2025",
  "description": "Minutes from the quarterly board meeting held on January 15, 2025",
  "author": "Board Secretary",
  "date": "2025-01-15",
  "tags": ["board meeting", "minutes", "quarterly"],
  "category": "Meeting Minutes"
}
```

### document.html (excerpt):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .header { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Board Meeting Minutes</h1>
  <p class="header">Date: January 15, 2025</p>
  <img src="board-meeting-2025_files/logo.png" alt="Company Logo">
  <!-- Document content... -->
</body>
</html>
```

## Metadata Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Document title (appears in listings) |
| `description` | string | Yes | Brief summary (shown in cards and search) |
| `author` | string | Yes | Document author or creator |
| `date` | string | Yes | Publication date (YYYY-MM-DD format) |
| `tags` | array | Yes | List of tags for filtering and search |
| `category` | string | Yes | Primary category for organization |

## Best Practices

### Date Format
Always use ISO 8601 format: `YYYY-MM-DD`
```json
"date": "2025-01-15"  ✓ Correct
"date": "01/15/2025"  ✗ Wrong
```

### Tags
- Use lowercase
- Be consistent with existing tags
- Include 3-6 relevant tags
- Combine specific and general tags

Example:
```json
"tags": ["board meeting", "minutes", "quarterly", "2025", "governance"]
```

### Categories
- Check existing categories first
- Use title case
- Keep it broad (not too specific)
- Common categories: "Meeting Minutes", "Reports", "Policies", "Guides"

### Images
- Use web-optimized formats (JPEG for photos, PNG for graphics)
- Compress images to reduce file size
- Use descriptive alt text in HTML
- Keep original filenames descriptive

### HTML Quality
- Include proper DOCTYPE and structure
- Use semantic HTML when possible
- Embed styles or include in `<head>`
- Validate HTML before adding

## Troubleshooting

### Document not appearing?
1. Check `manifest.json` includes your document slug
2. Verify folder name matches slug in manifest exactly
3. Ensure all required files exist (metadata.json, document.html, document.pdf)
4. Check metadata.json is valid JSON (use a validator)

### Images not loading?
1. Verify images are in the `_files` folder
2. Check HTML uses relative paths (not absolute)
3. Ensure image filenames match references exactly (case-sensitive)
4. Rebuild the application: `npm run build`

### Date sorting incorrect?
1. Verify date format is YYYY-MM-DD
2. Check date is valid (no typos)
3. Documents are sorted newest to oldest by default

## Bulk Import

To add multiple documents at once:

1. Prepare all document folders with required files
2. Update `manifest.json` with all new slugs at once
3. Rebuild: `npm run build`
4. Test thoroughly before deploying

## Testing

After adding documents:

```bash
# Rebuild the application
npm run build

# Serve locally (if configured)
npm run dev

# Verify:
# - Document appears on home page (if recent)
# - Document appears in browse page
# - Search finds the document
# - PDF download works
# - Images display correctly
# - Tags and category links work
```

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify file paths are correct
3. Validate JSON files
4. Ensure all required fields are present
5. Check the application build logs
