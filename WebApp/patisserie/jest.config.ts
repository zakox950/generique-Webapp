import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^../../../app/generated/prisma/client$":
      "<rootDir>/src/__tests__/__mocks__/prisma-client.ts",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
};

export default config;
