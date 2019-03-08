import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const StyledCircle = styled(View)`
  position: absolute;
  width: ${props => props.radius*2};
  height: ${props => props.radius*2};
  background-color: ${props => props.color};
  border-radius: ${props => props.radius};
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
        style={{...this.props.style}}
        radius={this.props.radius}
        onLayout={this.handleLayout}
        /* style={{borderRadius: Math.floor(this.state.width/2)}} */
      />
    )
  }
}
