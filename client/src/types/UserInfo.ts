interface UserInfo {
  email: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  summary: string;
  generators: string[];
  software: string[];
  socials: {
    network: string;
    username: string;
    _id: string;
  }[];
  location: string;
  tagline: string;
  website: string;
  createdAt: Date;
}

export default UserInfo;
