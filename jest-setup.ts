jest.mock('@react-native-firebase/perf', () => {
  return jest.fn().mockImplementation(() => {
    return {
      newHttpMetric: jest.fn().mockImplementation(() => {
        return {
          stop: jest.fn(),
          setHttpResponseCode: jest.fn(),
          setResponseContentType: jest.fn(),
        };
      }),
    };
  });
});

// jest.mock('@react-native-firebase/remote-config', () => {
//   return () => ({
//     fetchAndActivate: jest.fn(() => Promise.resolve()),
//     getValue: jest.fn(() => ({
//       toString: jest.fn(),
//     })),
//   });
// });
