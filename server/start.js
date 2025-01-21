// server/start.js
import { register } from 'ts-node';
import { pathToFileURL } from 'url';

register();

const filePath = pathToFileURL('./server/index.ts').href;
import(filePath).catch((err) => {
  console.error('Failed to import the module:', err);
});
