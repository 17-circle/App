import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import QRScreen from '../screens/QRScreen';
import QRScanScreen from '../screens/QRScanScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});



HomeStack.navigationOptions = {
  tabBarLabel: 'SDGs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const QRStack = createStackNavigator({
  QR: QRScreen,
});

QRStack.navigationOptions = {
  tabBarLabel: 'QR-Code',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-barcode' : 'md-barcode'}
    />
  ),
};

const QRScanStack = createStackNavigator({
  QRScan: QRScanScreen,
});

QRScanStack.navigationOptions = {
  tabBarLabel: 'QR-Scan',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  QRStack,
  QRScanStack,
});
