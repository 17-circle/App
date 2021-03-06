import React from 'react';
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
Amplify.configure(awsmobile)


class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isAdmin: false,
    username: null
  };

  getUsername = async () => {
    return (await Auth.currentAuthenticatedUser()).username
  }
  getUserGroups = async () => {
    const user = await Auth.currentAuthenticatedUser()
    const groups = user.signInUserSession.accessToken.payload['cognito:groups']
    return groups ? groups : []
  }
  isAdmin = async () => {
    const userGroups = await this.getUserGroups()
    return userGroups.includes('admin')
  }

  componentDidMount = async (props) => {
    const username = await this.getUsername()
    const isAdmin = await this.isAdmin()

    this.setState({isAdmin, username})
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator
            screenProps={{
              isAdmin: this.state.isAdmin,
              username: this.state.username
            }}/>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

export default withAuthenticator(App, true)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
