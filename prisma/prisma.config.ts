const config = {
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
};

export default config;
