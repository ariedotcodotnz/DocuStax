#!/usr/bin/env node

/**
 * PDF Thumbnail Generator
 *
 * This script generates thumbnail images from the first page of PDF documents.
 * It requires pdf-poppler to be installed on the system.
 *
 * Installation (Ubuntu/Debian):
 *   sudo apt-get install poppler-utils
 *
 * Installation (macOS):
 *   brew install poppler
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');
const THUMBNAIL_WIDTH = 400;

// Check if poppler is installed
const checkPoppler = () => {
  try {
    execSync('pdftoppm -v', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Generate thumbnail for a single PDF
const generateThumbnail = (pdfPath, outputPath) => {
  try {
    const dir = path.dirname(outputPath);
    const basename = path.basename(outputPath, '.png');

    // Use pdftoppm to convert first page to PNG
    // -png: output PNG format
    // -f 1 -l 1: first page only
    // -scale-to-x: scale to width (maintains aspect ratio)
    // -singlefile: output single file without page number suffix
    execSync(
      `pdftoppm -png -f 1 -l 1 -scale-to-x ${THUMBNAIL_WIDTH} -singlefile "${pdfPath}" "${path.join(dir, basename)}"`,
      { stdio: 'ignore' }
    );

    console.log(`✅ Generated thumbnail: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate thumbnail for ${pdfPath}:`, error.message);
    return false;
  }
};

// Main function
const generateAllThumbnails = async () => {
  console.log('🖼️  PDF Thumbnail Generator\n');

  // Check if poppler is installed
  if (!checkPoppler()) {
    console.error('❌ Error: pdftoppm (poppler-utils) is not installed.');
    console.error('\nPlease install poppler:');
    console.error('  Ubuntu/Debian: sudo apt-get install poppler-utils');
    console.error('  macOS: brew install poppler');
    process.exit(1);
  }

  // Read manifest
  const manifestPath = path.join(DOCUMENTS_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`Found ${manifest.length} documents\n`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // Generate thumbnails for each document
  for (const slug of manifest) {
    const pdfPath = path.join(DOCUMENTS_DIR, slug, 'document.pdf');
    const thumbnailPath = path.join(DOCUMENTS_DIR, slug, 'thumbnail.png');

    if (!fs.existsSync(pdfPath)) {
      console.warn(`⚠️  PDF not found: ${pdfPath}`);
      failCount++;
      continue;
    }

    // Skip if thumbnail already exists (unless force flag is set)
    if (fs.existsSync(thumbnailPath) && !process.argv.includes('--force')) {
      console.log(`⏭️  Thumbnail already exists: ${thumbnailPath}`);
      skipCount++;
      continue;
    }

    if (generateThumbnail(pdfPath, thumbnailPath)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   ✅ Generated: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📄 Total: ${manifest.length}`);

  if (failCount > 0) {
    process.exit(1);
  }
};

// Run the script
generateAllThumbnails().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
