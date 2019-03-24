import React from 'react';
import { View, Text, StyleSheet, Vibration, Alert } from 'react-native';
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
    Alert.alert(
      `Unlock SDG`,
      `Do you want to unlock goal 1 for ${data}?`,
      [{
        text: 'Cancel',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      }, {
        text: 'Unlock',
        onPress: () => console.log('ok'),
      }]
    )
    // alert(`Type: ${type} and data: ${data}`)
    Vibration.vibrate(100)
  }

  render() {
    const { screenProps: { isAdmin, username }} = this.props
    const { hasCameraPermission } = this.state

    if(!isAdmin)
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <QRCode
            value={username}
            size={200}
            bgColor='purple'
            fgColor='white'
          />
        </View>
      )

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
