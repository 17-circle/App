import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import Circle from './Circle'

const Container = styled.View`
  margin: auto;
  width: 180px;
  height: 180px;
  position: relative;
  background-color: #ac5;
`

const circles = [{
  color: 'red'
}, {
  color: 'blue'
}, {
  color: 'green'
}, {
  color: 'yellow'
}, {
  color: 'red'
}, {
  color: 'blue'
}, {
  color: 'green'
}, {
  color: 'yellow'
}, {
  color: 'red'
}, {
  color: 'blue'
}, {
  color: 'green'
}, {
  color: 'yellow'
}, {
  color: 'red'
}, {
  color: 'blue'
}, {
  color: 'green'
}, {
  color: 'yellow'
}, {
  color: 'red'
}]


export default class SDGCircle extends Component {
  state = {
    deltaTheta: 360/circles.length,
    Radius: 0, // radius of center circle (contaienr)
    radius: 25, // radius of orbiting circles
    container: { height: 0, width: 0 }
  }

  offset = () => parseInt(this.state.container.width/2)-this.state.radius
  xPos = (i) => Math.sin((i*this.state.deltaTheta) * (Math.PI/180))*this.state.Radius+this.offset()
  yPos = (i) => Math.cos((i*this.state.deltaTheta) * (Math.PI/180))*this.state.Radius+this.offset()

  handleLayout = ({ nativeEvent }) => {
    this.setState({
      Radius: nativeEvent.layout.width,
      container: {
        height: nativeEvent.layout.height,
        width: nativeEvent.layout.width
      }
    })
  }

  render() {
    return (
      <Container onLayout={this.handleLayout}>
        {circles.map((circle, index) => (
          <Circle
            color={circle.color}
            radius={this.state.radius}
            style={{left: this.xPos(index), top: this.yPos(index)}}
          />)
                    )}
      </Container>
    )
  }
}
