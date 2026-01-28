import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'docs');

export interface DocMeta {
  title: string;
  description: string;
  slug: string;
  content: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

export function getDocBySlug(slug: string): DocMeta | null {
  try {
    // Map common slug patterns to actual files
    const slugToFile: Record<string, string> = {
      'getting-started': 'getting-started.md',
      'quick-start': 'getting-started.md',
      'configuration': 'configuration.md',
      'privacy': 'PRIVACY.md',
      'terms': 'TERMS.md',
      'first-agent': 'getting-started.md',
      'installation': 'getting-started.md',
    };

    const fileName = slugToFile[slug] || `${slug}.md`;
    const fullPath = path.join(docsDirectory, fileName);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title || extractTitleFromContent(content) || slug,
      description: data.description || extractDescriptionFromContent(content) || '',
      slug,
      content,
    };
  } catch (error) {
    console.error(`Error loading doc: ${slug}`, error);
    return null;
  }
}

export function getAllDocs(): DocMeta[] {
  try {
    const fileNames = fs.readdirSync(docsDirectory);
    const docs = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '').toLowerCase();
        return getDocBySlug(slug);
      })
      .filter((doc): doc is DocMeta => doc !== null);

    return docs;
  } catch (error) {
    console.error('Error loading all docs', error);
    return [];
  }
}

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : '';
}

function extractDescriptionFromContent(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.length > 20) {
      return trimmed.substring(0, 150) + '...';
    }
  }
  return '';
}
