import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode'


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
    // title: 'Links',
  };

  render() {
    const { screenProps: { isAdmin, username }} = this.props

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <QRCode
          value={username}
          size={250}
          bgColor='black'
          fgColor='white'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
