import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'

const tick = require('../assets/Tick.png')

export default class SuccessScreen extends Component {
    render() {
        const { container, message, button } = styles
        return (
            <View style = {container}>
                <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source = {tick} style = {{ width: 150, height: 150, position: 'absolute', top: 140, left: -50}} />            
                </View>
                <View style = {{ flex: 6, justifyContent: 'center'}}>
                    <Text style = {message}>Transaction success!</Text> 
                </View>
                <TouchableOpacity style = {button} onPress = {() => Actions.pop()}>
					<Text style = {{ textAlign: 'center', color: 'white' }}>Close</Text>
				</TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0000a0'
    },
    message: {
        position: 'relative',
        color: 'white',
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: -200   
    },
    button: {
        position: 'absolute',
        top: 600,
		width: 100,
		backgroundColor: '#0000a0',
		padding: 12,
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1
	}
})