import { ImageInfo } from '../interfaces/image';

export type Role = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwd: string;
  firstName: string;
  surname: string;
  role: string;
  image: ImageInfo;
};
