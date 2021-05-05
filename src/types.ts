export type Comment = {
  commenter: Commenter;
  content: string;
  mentionedIds: number[];
};

export type Commenter = {
  id: number;
  name: string;
  image: string;
};
