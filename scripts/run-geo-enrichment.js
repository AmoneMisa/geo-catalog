import process from 'node:process';

// Keep credentials local while making `npm run crawl:geo` behave as users
// expect when a project-root .env file is present. Explicit shell/process
// environment variables retain precedence according to Node's dotenv loader.
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
} else {
  console.warn('geo enrichment: Node <20.12 cannot auto-load .env; export provider keys in the shell or upgrade Node.');
}

await import('./crawl-geo-enrichment.js');
