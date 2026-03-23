import { getCollection } from 'astro:content';

export async function getSortedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

export async function getFeaturedPosts() {
  const posts = await getSortedPosts();
  return posts.filter(post => post.data.featured);
}

export async function getCategories() {
  const posts = await getSortedPosts();
  const categories = new Set<string>();
  posts.forEach(post => categories.add(post.data.category));
  return Array.from(categories).sort();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
