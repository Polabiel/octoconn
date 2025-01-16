require("dotenv").config();

export const Configuration = {
  port: process.env.PORT ?? 3000,
  host: process.env.HOST ?? "localhost",
  getBaseUrl() {
    return `http://${this.host}:${this.port}`;
  },
};
