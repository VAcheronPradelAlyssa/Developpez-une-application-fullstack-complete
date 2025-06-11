export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: { username: string };
  subject: { name: string };
}