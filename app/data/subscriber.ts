// app/data/subscriber.ts
export type Subscriber = {
  id: string; // uuid or timestamp string
  email: string;
  name?: string; // derived or provided in future
  createdAt: string; // ISO timestamp
};
