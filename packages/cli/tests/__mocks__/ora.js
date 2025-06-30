/* global jest */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/** @returns {object} */
const createMockSpinner = () => ({
  start: jest.fn().mockReturnThis(),
  stop: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis(),
  text: "",
  color: "blue",
});

module.exports = {
  default: jest.fn(() => createMockSpinner()),
  __esModule: true,
};

// Also export as named export for compatibility
module.exports.ora = module.exports.default;
