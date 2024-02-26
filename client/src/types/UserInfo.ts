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
  following: string[];
  followers: string[];
  _id: string;
}

export default UserInfo;
