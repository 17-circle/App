import React, { Component } from 'react'
import { Text, View, Animated } from 'react-native'
import styled from 'styled-components'

const StyledCircle = styled(Animated.View)`
  position: absolute;
  width: ${props => props.radius*2};
  height: ${props => props.radius*2};
  background-color: ${props => props.color};
  border-radius: ${props => props.radius};

  display: flex;
  justify-content: center;
  align-items: center;
`

export default class Circle extends Component {
  state = { width: 0 }

  handleLayout = ({ nativeEvent }) => {
    this.setState({ width: nativeEvent.layout.width })
  }

  render() {
    return (
      <StyledCircle
        {...this.props} // radius, style, color
        onLayout={this.handleLayout}
        /* style={{borderRadius: Math.floor(this.state.width/2)}} */
      />
    )
  }
}
