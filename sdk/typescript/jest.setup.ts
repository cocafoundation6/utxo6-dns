// jest.setup.ts
// Global test setup: extend expect, configure globals, and polyfills if needed

// Example: add custom matchers or global mocks here
// import '@testing-library/jest-dom/extend-expect';

// Configure TextEncoder/TextDecoder for Node if not present (Node >= 18 has them)
if (typeof TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = require('util').TextDecoder;
}
