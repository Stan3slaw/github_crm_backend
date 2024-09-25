export const mongooseConfig = {
  dbName: process.env.MONGODB_DATABASE_NAME || 'github-crm',
  auth: {
    username: process.env.MONGODB_USER_NAME,
    password: process.env.MONGODB_USER_PASSWORD,
  },
};
