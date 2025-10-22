// data/review.ts
export type ReviewType = {
  id: number;
  name: string;
  text: string;
  email?: string; // Add this
  approved: boolean;
  createdAt: string;
};
