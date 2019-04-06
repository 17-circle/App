import React, { Component } from 'react'
import { Text, View, PanResponder, Animated, Dimensions } from 'react-native'
import styled from 'styled-components'
import Circle from './Circle'
import circles from '../constants/SDGs'

const SCREEN_WIDTH = Dimensions.get('window').width

const Container = styled(Animated.View)`
  margin: auto;
  width: 200px;
  height: 200px;
  position: relative;
  top: 100px;
`

const gaussFunc = (x, sigma, mu) => {
  return 1/sigma/Math.sqrt(2.0*Math.PI)*Math.exp(-1.0/2.0*Math.pow((x-mu)/sigma,2))
}
const myGaussFunc = (x) => gaussFunc(x, 1/2/Math.sqrt(2*Math.PI), 0)

// const circles = [{
//   color: '#e4253c',
//   title: 'NO POVERTY',
//   description: 'Economic growth must be inclusive to provide sustainable jobs and promote equality.',
// }, {
//   color: 'blue'
// }, {
//   color: 'green'
// }, {
//   color: 'yellow'
// }, {
//   color: 'purple'
// }, {
//   color: 'black'
// }, {
//   color: 'gray'
// }, {
//   color: 'pink'
// }, {
//   color: 'lime'
// }, {
//   color: 'darkgreen'
// }, {
//   color: 'crimson'
// }, {
//   color: 'orange'
// }, {
//   color: 'cyan'
// }, {
//   color: 'navy'
// }, {
//   color: 'indigo'
// }, {
//   color: 'brown'
// }, {
//   color: 'peru'
// }]

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
  constructor(props) {
    super(props)

    const deltaTheta = 360/circles.length
    const pxPerDeg = 200/120


    const thetas = []
    for (const i in circles) {
      let val = i*deltaTheta*pxPerDeg
      if(i >= 9)
        val = -(circles.length-i)*deltaTheta*pxPerDeg

      thetas.push(val)
    }

    this.state = {
      deltaTheta,
      Radius: 0, // radius of center circle (contaienr)
      radius: 25, // radius of orbiting circles
      container: { height: 0, width: 0 },
      deltaAnim: new Animated.Value(0),
      thetas,
      thetasAnim: thetas.map(theta => new Animated.Value(theta)),
    }
  }

  offset = () => parseInt(this.state.container.width/2)-this.state.radius

  _panResponder = PanResponder.create({
    nMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderGrant: () => {
      const { deltaAnim, thetasAnim, thetas } = this.state
      deltaAnim.setOffset(deltaAnim._value)
      deltaAnim.setValue(0)

      const iSel = Math.round((deltaAnim._value+deltaAnim._offset)/(600/circles.length))
      for(let i=0; i<circles.length; i++) {
        let xi = i+iSel
        if(xi > 16)
          xi -= circles.length
        if(xi < 0)
          xi += circles.length
        try {
          thetasAnim[xi].setOffset(thetas[i])
        } catch(err) {console.log(xi)}
      }
    },
    onPanResponderMove: (event, gestureState) => {
      const { deltaAnim, scaleAnim, deltaTheta, Radius, thetasAnim } = this.state
      deltaAnim.setValue(gestureState.dx)

      for (theta of thetasAnim) {
        theta.setValue(-gestureState.dx)
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      const {dx, vx} = gestureState
      const {deltaAnim, thetasAnim, deltaTheta, thetas} = this.state

      deltaAnim.flattenOffset()

      const ithCircleValue = this.getIthCircleValue(dx, deltaAnim)

      Animated.spring(deltaAnim, {
        toValue: ithCircleValue,
        friction: 5,
        tension: 10,
      }).start(() => {
        this.simplifyOffset(deltaAnim)
      });

      // onSelect property
      if(this.props.onSelect) {
        const iSel = Math.round((deltaAnim._value+deltaAnim._offset)/(600/circles.length))
        let xi = iSel
        if(xi > 16)
          xi -= circles.length
        if(xi < 0)
          xi += circles.length
        this.props.onSelect(xi)
      }
    }
  })

  getIthCircleValue = (dx, deltaAnim) => {
    const selectedCircle = Math.round((deltaAnim._value+deltaAnim._offset)/(600/circles.length))
    return (selectedCircle)*600/circles.length
  }

  snapOffset = (offset) => { return Math.round(offset / (600/circles.length)) * 600/circles.length; }
  simplifyOffset = (anim) => {
    if(anim._value + anim._offset >= 600) anim.setOffset(anim._offset - 600)
    if(anim._value + anim._offset <= -600) anim.setOffset(anim._offset + 600)
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
          const {deltaTheta, thetasAnim, Radius} = this.state

          /* const difInPx = index*deltaTheta*200/120 */
          let i = index
          /* if(index >= Math.round(circles.length/2)) */
          /*   i = circles.length - index */

          scale = thetasAnim[i].interpolate({
            inputRange: [-300, 0, 300],
            outputRange: [0, 2, 0],
          })

          return (
            <Circle
              key={index}
              color={circle.color}
              radius={radius}
              style={{
                left: Math.sin(index*deltaTheta*Math.PI/180 + Math.PI)*Radius+this.offset(),
                top: Math.cos(index*deltaTheta*Math.PI/180 + Math.PI)*Radius+this.offset(),
                transform: [{ scale }],
              }}
            >
              <Text style={{color: 'white'}}>{index+1}</Text>
            </Circle>
          )
        })}
      </Container>
    )
  }
}
