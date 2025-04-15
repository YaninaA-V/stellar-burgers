/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testMatch: [
    '**/__tests__/**/*.test.ts' 
  ],
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts', 
    '^@utils(.*)$': '<rootDir>/src/utils$1', 
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  },
};

export default config;
