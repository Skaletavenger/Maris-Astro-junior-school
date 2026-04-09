const config = {
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  adapter: "better-sqlite3",
};

export default config;
