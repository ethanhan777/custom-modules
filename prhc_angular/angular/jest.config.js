module.exports = {
  preset: 'jest-preset-angular',
  setupTestFrameworkScriptFile: '<rootDir>/source/tests-setup.ts',
  globals: {
    'ts-jest': {
      tsConfigFile: 'source/tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/source/app/$1',
    'assets/(.*)': '<rootDir>/source/assets/$1',
    'environments/(.*)': '<rootDir>/source/environments/$1',
  },
};
