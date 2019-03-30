import React from 'react';
import { View, Text, Alert, Picker, Vibration } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import * as queries from '../graphql/queries'

export default class SettingsScreen extends React.Component {
  state = {
    hasCameraPermissions: null,
    isBusy: false,
    users: [],
    certificates: [],
    selectedGoal: 1,
  }

  static navigationOptions = {
    header: null,
    // title: 'app.json',
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    const certifys = await this._getCertificates()

    this.setState({ hasCameraPermission:status === 'granted', certificates: certifys })
  }

  _getCertificates = async () => {
    return (await API.graphql(graphqlOperation(queries.listCertifys))).data.listCertifys.items
  }

  _handleBarCodeRead = ({type, data}) => {
    if(!this.state.busy) {
      this.setState({busy: true})
      Vibration.vibrate(100)
      Alert.alert(
        `Unlock SDG`,
        `Do you want to unlock goal ${this.state.selectedGoal} for ${data}?`,
        [{
          text: 'Cancel',
          onPress: () => this.setState({ busy: false }),
          style: 'cancel',
        }, {
          text: 'Unlock',
          onPress: async () => {
            const sdg = {
              goal: this.state.selectedGoal,
              owner: data
            }

            await API.graphql(
              graphqlOperation(
                mutations.createSdg, {input: sdg}
              )
            )

            alert(`Unlocked SDG ${this.state.selectedGoal} for ${data}`)
            this.setState({busy: false})
          },
        }]
      )
    }
    // alert(`Type: ${type} and data: ${data}`)
  }

  render() {
    const { screenProps: { isAdmin }} = this.props
    const { hasCameraPermission, users, certificates } = this.state

    if(!isAdmin)
      return (
        <View>
          <Text>
            You need to be an admin to certify SDGs
          </Text>
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          style={{ height: 250, width: 250}}
        />
        <Picker
          selectedValue={this.state.selectedGoal}
          onValueChange={(value, index) => this.setState({selectedGoal: value})}
          style={{height: 250, width: 250}}
        >
          {pickerItems}
        </Picker>
      </View>
    )
  }
}
