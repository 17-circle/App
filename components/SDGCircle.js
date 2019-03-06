import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import Circle from './Circle'

const Container = styled.View`
  flex: 1;
`

export default class SDGCircle extends Component {
  render() {
    return (
      <Container>
        <Circle color="red" />
        <Circle color="blue" />
      </Container>
    )
  }
}
