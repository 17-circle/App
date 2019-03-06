import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const Circle = styled(View)`
  flex: 1;
  background-color: red;
`

export class SDGCircle extends Component {
  state = { width: 0 }

  handleLayout = ({ nativeEvent }) => {
    this.setState({ width: nativeEvent.layout.width })
  }

  render() {
    return <Circle onLayout={this.handleLayout} style={{borderRadius: Math.floor(this.state.width/2)}} />
  }
}
