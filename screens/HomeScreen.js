import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import SDGCircle from '../components/SDGCircle'
import SDGs from '../constants/SDGs'
import styled from 'styled-components'

import { API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    SDGs: SDGs,
    refreshing: true,
    selectedSDG: 0,
  }

  componentDidMount = () => {
    const {SDGs} = this.state

    this._getSDGs().then(sdgs => {
      for (sdg of sdgs) {
        SDGs[sdg.goal-1].unlocked = true
      }
      this.setState({SDGs, refreshing: false})
    })
  }

  _getSDGs = async () => {
    return (await API.graphql(graphqlOperation(queries.listSdGs))).data.listSDGs.items
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this._getSDGs().then(sdgs => {
      for (sdg of sdgs) {
        SDGs[sdg.goal-1].unlocked = true
      }
      this.setState({sdgs, refreshing: false})
    })
  }

  onSelectSDG = (selectedSDG) => {
    this.setState({selectedSDG})
  }

  render() {
    const { selectedSDG, SDGs } = this.state
    return (
      <View style={styles.container}>
        <View style={{flex: 1, height: '80%', justifyContent: 'center'}}>
          <SDGContainer
            bgColour={SDGs[selectedSDG].unlocked ? SDGs[selectedSDG].color : 'gray'}
            contentContainerStyle={{flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Title>{SDGs[selectedSDG].title}</Title>
            <Description>{SDGs[selectedSDG].description}</Description>
          </SDGContainer>
        </View>
        <SDGCircle onSelect={this.onSelectSDG} circles={SDGs}/>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const SDGContainer = styled(ScrollView)`
  background-color: ${props => props.bgColour};
  padding: 16px;
`
const Title = styled(Text)`
  text-align: center;
  font-size: 30px;
   color: black;
`
const Description = styled(Text)`
  font-size: 20px;
  text-align: center;
   color: black;
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
