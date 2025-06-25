export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  authorUsername: string;
  postId: number;
}