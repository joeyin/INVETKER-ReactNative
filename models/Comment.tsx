export interface NewComment {
  ticker: string;
  comment: string;
};

export interface Comment extends NewComment {
  id: string;
  userId: string;
  avatar: URL;
  displayName: String;
  datetime: number;
}

