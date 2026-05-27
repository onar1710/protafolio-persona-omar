import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const OUTPUT_FILE = path.join(__dirname, '../blog-database.json');

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith("'") && value.endsWith("'")) || 
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      
      // Handle array values
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
      
      // Handle boolean values
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      data[key] = value;
    }
  });
  
  return data;
}

function getSlugFromFilename(filename) {
  // Remove extension
  const slug = filename.replace(/\.(md|mdx)$/, '');
  return slug;
}

function generateBlogDatabase() {
  const files = fs.readdirSync(BLOG_DIR);
  const blogPosts = [];
  
  files.forEach(file => {
    // Skip directories and non-markdown files
    if (fs.statSync(path.join(BLOG_DIR, file)).isDirectory()) return;
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;
    
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    // Skip if no frontmatter
    if (!frontmatter) return;
    
    // Skip if draft is true
    if (frontmatter.draft === true) return;
    
    const slug = getSlugFromFilename(file);
    
    blogPosts.push({
      title: frontmatter.title || '',
      slug: slug,
      description: frontmatter.description || '',
      pubDate: frontmatter.pubDate || '',
      tags: frontmatter.tags || [],
      heroImage: frontmatter.heroImage || ''
    });
  });
  
  // Sort by publication date (newest first)
  blogPosts.sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  
  const database = {
    lastUpdated: new Date().toISOString(),
    totalPosts: blogPosts.length,
    posts: blogPosts
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2), 'utf-8');
  
  console.log(`✅ Blog database generated successfully!`);
  console.log(`📊 Total posts: ${blogPosts.length}`);
  console.log(`📁 Output file: ${OUTPUT_FILE}`);
}

// Run the script
generateBlogDatabase();
