export interface IReview {
  productId: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  likeCount?: number;
  isPublished?: boolean;
}

export interface ReviewQuery {
  page?: string;
  limit?: string;
  rating?: string;
  isPublished?: string;
}
