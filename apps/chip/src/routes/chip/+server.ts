import type { RequestHandler } from '@sveltejs/kit';

const modules = import.meta.glob('./exercises/*.txt', {
  as: 'raw',
  eager: true
});

const files = Object.values(modules) as string[];

export const GET: RequestHandler = async () => {
  if (files.length === 0) {
    return new Response('No exercise files found', { status: 404 });
  }

  const random = files[Math.floor(Math.random() * files.length)];

  return new Response(random, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};