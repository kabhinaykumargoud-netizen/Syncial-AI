export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';

export type PostStatus = 'pending' | 'posted';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduled_time: string | null;
  created_at: string;
  image_url: string | null;
}

export interface Analytics {
  id: string;
  post_id: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Account {
  id: string;
  user_id: string;
  platform: Platform;
  access_token: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}
