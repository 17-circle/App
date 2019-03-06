import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const StyledCircle = styled(View)`
  flex: 1;
  background-color: ${props => props.color};
`

export default class Circle extends Component {
  state = { width: 0 }

  handleLayout = ({ nativeEvent }) => {
    this.setState({ width: nativeEvent.layout.width })
  }

  render() {
    return (
      <StyledCircle
        color={this.props.color}
        onLayout={this.handleLayout}
        style={{borderRadius: Math.floor(this.state.width/2)}}
      />
    )
  }
}
