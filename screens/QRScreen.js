import React from 'react';
import { View, Text, StyleSheet, Vibration, Alert, Picker } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo'
import QRCode from 'react-native-qrcode'

import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'

export default class LinksScreen extends React.Component {
  state = {
    hasCameraPermissions: null,
    isBusy: false,
    users: [],
    certificates: [],
    selectedGoal: 1,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    const certifys = await this._getCertificates()

    this.setState({ hasCameraPermission:status === 'granted', certificates: certifys })
  }

  _getCertificates = async () => {
    return (await API.graphql(graphqlOperation(queries.listCertifys))).data.listCertifys.items
  }

  static navigationOptions = {
    header: null,
    // title: 'Links',
  };

  _handleBarCodeRead = ({type, data}) => {
    if(!this.state.busy) {
      this.setState({busy: true})
      Vibration.vibrate(100)
      Alert.alert(
        `Unlock SDG`,
        `Do you want to unlock goal 1 for ${data}?`,
        [{
          text: 'Cancel',
          onPress: () => this.setState({ busy: false }),
          style: 'cancel',
        }, {
          text: 'Unlock',
          onPress: async () => {
            const sdg = {
              goal: 1,
              owner: data
            }

            await API.graphql(
              graphqlOperation(
                mutations.createSdg, {input: sdg}
              )
            )

            alert(`Unlocked SDG 1 for ${data}`)
            this.setState({busy: false})
          },
        }]
      )
    }
    // alert(`Type: ${type} and data: ${data}`)
  }

  render() {
    const { screenProps: { isAdmin, username }} = this.props
    const { hasCameraPermission, users, certificates } = this.state

    if(!isAdmin)
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

    if(hasCameraPermission === null) {
      return <Text>Requesting for camera permissions</Text>
    }
    if(hasCameraPermission === false ) {
      return <Text>No access to camera </Text>
    }


    const pickerItems = certificates.map(({goal}) => <Picker.Item key={goal} label={`${goal}`} value={goal}/>)

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink'}}>
        <View>
          <QRCode
            value={username}
            size={200}
            bgColor='black'
            fgColor='white'
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Picker
            selectedValue={this.state.selectedGoal}
            onValueChange={(value, index) => this.setState({selectedGoal: value})}
            style={{height: 50, width: 100}}
          >
            {pickerItems}
          </Picker>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={{ height: 200, width: 200}}
          />
        </View>
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
