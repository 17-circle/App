import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const Circle = styled.View`
  flex: 1;
  background-color: red;
  border-radius: 50;
`

export class SDGCircle extends Component {
  render() {
    return <Circle onLayout={(layout) => console.log(layout)} />
  }
}
