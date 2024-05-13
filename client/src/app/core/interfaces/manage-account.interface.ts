export interface UserProfile {
  [key: string]: any;
  fullname: string;
  dob?: Date | null;
  phone: string | null;
  gender: "male" | "female" | "other" | null;
  bio: string | null;
  avatar: string | null;
}
