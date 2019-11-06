import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Actions } from 'react-native-router-flux'

const tick = require('../assets/Tick.png')

export default class SuccessScreen extends Component {
    render() {
        const { container, image, messageView, message, button, buttonText } = styles
        return (
            <View style = {container}>
                <Image source = {tick} style = {image} />            
                <View style = {messageView}>
                    <Text style = {message}>Transaction Completed</Text> 
                </View>
                <TouchableOpacity style = {button} onPress = {() => Actions.pop()}>
					<Text style = {buttonText}>Close</Text>
				</TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: wp('10%')
    },
    image: {
        position: 'relative',
        top: hp(19),
        height: hp(17),
        width: wp(33.6),
        transform: [{ scale: wp('0.3%') }],
		marginVertical: hp(1.5),
		alignSelf: 'center'
    },
    messageView: {
        flex: 6,
        justifyContent: 'center'
    },
    message: {
        position: 'relative',
        color: 'green',
        fontSize: hp(5.8),
        fontWeight: 'bold',
        textAlign: 'center',
        bottom: hp(8) 
    },
    button: {
        position: 'relative',
        bottom: hp(10),
		width: wp(25),
		padding: wp(2),
		backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 25,
        borderColor: '#28376c'
    },
    buttonText: {
        textAlign: 'center',
        color: '#28376c',
        fontSize: hp(2.3)
    }
})