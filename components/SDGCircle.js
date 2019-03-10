import React, { Component } from 'react'
import { Text, View, PanResponder, Animated, Dimensions } from 'react-native'
import styled from 'styled-components'
import Circle from './Circle'

const SCREEN_WIDTH = Dimensions.get('window').width

const Container = styled(Animated.View)`
  margin: auto;
  width: 150px;
  height: 150px;
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
  color: 'purple'
}, {
  color: 'black'
}, {
  color: 'gray'
}, {
  color: 'pink'
}, {
  color: 'lime'
}, {
  color: 'darkgreen'
}, {
  color: 'crimson'
}, {
  color: 'orange'
}, {
  color: 'cyan'
}, {
  color: 'navy'
}, {
  color: 'indigo'
}, {
  color: 'brown'
}, {
  color: 'peru'
}]

function withFunction(callback) {
  let inputRange = [], outputRange = [], steps = 50;
  /// input range 0-1
  for (let i=0; i<=steps; ++i) {
    let key = i/steps;
    inputRange.push(key);
    outputRange.push(callback(key));
  }
  return { inputRange, outputRange };
}

export default class SDGCircle extends Component {
  state = {
    deltaTheta: 360/circles.length,
    Radius: 0, // radius of center circle (contaienr)
    radius: 25, // radius of orbiting circles
    container: { height: 0, width: 0 },
    deltaAnim: new Animated.Value(0),
  }

  offset = () => parseInt(this.state.container.width/2)-this.state.radius

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderGrant: () => {
      console.log('grant')
      this.state.deltaAnim.setOffset(this.state.deltaAnim._value)
    },
    onPanResponderMove: (event, gestureState) => {
      this.state.deltaAnim.setValue(gestureState.dx)
    },
    onPanResponderRelease: (event, gestureState) => {
      const {dx, vx} = gestureState
      const {deltaAnim} = this.state
      const handlerValue = Math.abs(dx) > SCREEN_WIDTH / 8 || Math.abs(vx) > 1.3 ? this.getAmountForNextSlice(dx, deltaAnim._offset) : this.snapOffset(deltaAnim._offset);
      Animated.spring(deltaAnim, {
        toValue: handlerValue
      }).start()
      // }).start(() => this.simplifyOffset(this.pan._value));
    }
  })

  getAmountForNextSlice = (dx, offset) => {
    // This just rounds to the nearest 200 to snap the circle to the correct thirds
    const snappedOffset = this.snapOffset(offset);
    // Depending on the direction, we either add 200 or subtract 200 to calculate new offset position.
    const newOffset = dx > 0 ? snappedOffset + 200 : snappedOffset - 200;
    return newOffset;
  }
  snapOffset = (offset) => { return Math.round(offset / 200) * 200; }

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
    const {deltaAnim, radius} = this.state

    return (
      <Container
        onLayout={this.handleLayout}
        {...this._panResponder.panHandlers}
        style={{
          transform: [{
            rotate: deltaAnim.interpolate({
              inputRange: [-200, 0, 200],
              outputRange: ['-360deg', '0deg', '360deg']
            })
          }]
        }}
      >
        {circles.map((circle, index) => {
          const {deltaTheta, Radius} = this.state

          return (
            <Circle
              key={index}
              color={circle.color}
              radius={radius}
              style={{
                left: Math.sin(index*deltaTheta*Math.PI/180)*Radius+this.offset(),
                top: Math.cos(index*deltaTheta*Math.PI/180)*Radius+this.offset(),
              }}
            />
          )
        })}
      </Container>
    )
  }
}
