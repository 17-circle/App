import React, { Component } from 'react'
import { Text, View, PanResponder, Animated, Dimensions } from 'react-native'
import styled from 'styled-components'
import Circle from './Circle'

const SCREEN_WIDTH = Dimensions.get('window').width

const Container = styled(Animated.View)`
  margin: auto;
  width: 200px;
  height: 200px;
  position: relative;
  top: 100px;
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
}
                ]

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
    nMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderGrant: () => {
      const { deltaAnim } = this.state
      deltaAnim.setOffset(deltaAnim._value)
      deltaAnim.setValue(0)
    },
    onPanResponderMove: (event, gestureState) => {
      const { deltaAnim } = this.state
      deltaAnim.setValue(gestureState.dx)
    },
    onPanResponderRelease: (event, gestureState) => {
      const {dx, vx} = gestureState
      const {deltaAnim} = this.state

      deltaAnim.flattenOffset()
      Animated.spring(deltaAnim, {
        toValue: this.getIthCircleValue(dx, deltaAnim),
        friction: 5,
        tension: 10,
      }).start(() => this.simplifyOffset(deltaAnim._value));
    }
  })

  getIthCircleValue = (dx, deltaAnim) => {
    const ithCircle = Math.round(deltaAnim._value/(600/circles.length))
    return (ithCircle)*600/circles.length
  }
  getAmountForNextSlice = (dx, offset) => {
    // This just rounds to the nearest 200 to snap the circle to the correct thirds
    const snappedOffset = this.snapOffset(offset);
    // Depending on the direction, we either add 200 or subtract 200 to calculate new offset position. (200 are equal to 120deg!)
    // const newOffset = dx > 0 ? snappedOffset + 200 : snappedOffset - 200; // fixed for 3 circles
    const newOffset = dx > 0 ? snappedOffset + 600/circles.length : snappedOffset - 600/circles.length;
    return newOffset;
  }
  snapOffset = (offset) => { return Math.round(offset / (600/circles.length)) * 600/circles.length; }
  simplifyOffset = (val) => {
    const { deltaAnim } = this.state
    if(deltaAnim._offset > 600) deltaAnim.setOffset(deltaAnim._offset - 600)
    if(deltaAnim._offset < -600) deltaAnim.setOffset(deltaAnim._offset + 600)
  }

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
              outputRange: ['-120deg', '0deg', '120deg']
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
                left: Math.sin(index*deltaTheta*Math.PI/180 + Math.PI)*Radius+this.offset(),
                top: Math.cos(index*deltaTheta*Math.PI/180 + Math.PI)*Radius+this.offset(),

              }}
            >
              <Text style={{color: 'white'}}>{index}</Text>
            </Circle>
          )
        })}
      </Container>
    )
  }
}
