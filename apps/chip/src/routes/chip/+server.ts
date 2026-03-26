import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    const exercisesPath = join(process.cwd(), 'src', 'routes', 'chip', 'exercises');
    const files = readdirSync(exercisesPath).filter((file) => file.endsWith('.txt'));

    if (files.length === 0) {
      return new Response('No exercise files found', { status: 404 });
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const content = readFileSync(join(exercisesPath, randomFile), 'utf-8');

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error loading random exercise:', error);
    return new Response('Error loading exercise file', { status: 500 });
  }
};
