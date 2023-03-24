import path from 'path';
import { fileURLToPath } from 'url';
export const dirNameGet = () => path.dirname(fileURLToPath(import.meta.url));
