export type User = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type Sound = {
  _id: string;
  description?: string;
  duration?: string;
  metadata: {
    s3Key: string;
    bucketName: string;
    fileType: string;
    fileSize: number; // in bytes
  };
  title: string;
  user: User;
  createdAt: Date;
};
