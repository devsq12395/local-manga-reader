export interface ProfileDetails {
  id: string; // uuid
  created_at: string; // ISO timestamp
  user_name: string;
  email: string;
  avatar_url: string;
  role: string;
}