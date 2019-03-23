import React from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo'
import QRCode from 'react-native-qrcode'


export default class LinksScreen extends React.Component {
  state = {
    hasCameraPermissions: null
  }

  async componentWillMound() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission:status === 'granted' })
  }

  static navigationOptions = {
    title: 'Links',
  };

  _handleBarCodeRead = ({type, data}) => {
    alert(`Type: ${type} and data: ${data}`)
    Vibration.vibrate(100)
  }

  render() {
    const { screenProps: { isAdmin }} = this.props
    const { hasCameraPermission } = this.state

    if(!isAdmin)
      return <Text>You have to be an organizer to certify SDGs!</Text>

    if(hasCameraPermission === null) {
      return <Text>Requesting for camera permissions</Text>
    }
    if(hasCameraPermission === false ) {
      return <Text>No access to camera </Text>
    }

    return (
      <View>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          style={{ height: 250, width: 350}}
        />
        <QRCode
          value={'123'}
          size={200}
          bgColor='purple'
          fgColor='white'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
