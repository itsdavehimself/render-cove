import UserInfo from './UserInfo';
import { Image } from './Project';

interface ProjectInCollection {
  title: string;
  author: UserInfo;
  images: Image[];
  _id: string;
}

interface Collection {
  title: string;
  creator: string;
  projects: ProjectInCollection[];
  createdAt: Date;
  private: boolean;
  _id: string;
}

export default Collection;
