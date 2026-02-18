import { json } from '@sveltejs/kit';

const INSPECTIFY_BASE = process.env.PUBLIC_API_BASE || 'http://localhost:3000/api';

export const GET = async () => {
  try {
    // Try to fetch from the inspectify backend
    const response = await fetch(`${INSPECTIFY_BASE}/generate-chip`);
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    const data = await response.json();
    return json(data);
  } catch (error) {
    // Fallback to a default program if inspectify is not running
    console.warn('Failed to fetch from inspectify backend, using fallback:', error);
    return json({
      program: `{ FRONTEND }`,
    });
  }
};
