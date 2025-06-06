jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  // Add any other methods you use as jest.fn()
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => <View {...props} />;
  const MockMarker = (props) => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  requestPermissions: jest.fn(),
  // Add any other methods you use as jest.fn()
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  const TouchableOpacity = require('react-native').TouchableOpacity;
  return {
    __esModule: true,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    Directions: {},
    GestureHandlerRootView: View,
    TouchableOpacity,
    // Add any other components you use from this library
  };
});
