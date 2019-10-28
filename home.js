/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Home extends Component{

  render(){
    const goToRegister = () => {
        Actions.register()
     }
     const goToLogin = () => {
        Actions.login()
     }
        return(
          <View style={{flex:1,marginTop:250,paddingLeft:30,paddingRight:30}}>
          <Text style={{ fontFamily:'arial', fontSize:20, fontWeight:'bold', textAlign:'center',color:'#2e4394' }}>Nodeberry Incorporation</Text>
          <Text style={{ fontFamily:'arial',marginTop:15, fontSize:15, fontWeight:'100', textAlign:'center' }}>Laundromat Demo</Text>
          <TouchableOpacity style={{marginTop:20,backgroundColor:'#2e4394',padding:12,borderRadius:3}} onPress={goToRegister}><Text style={{textAlign:'center',color:'white'}}>Register</Text></TouchableOpacity>
          <TouchableOpacity style={{marginTop:20,backgroundColor:'#2e4394',padding:12,borderRadius:3}} onPress={goToLogin}><Text style={{textAlign:'center',color:'white'}}>Login</Text></TouchableOpacity>
          <Text style={{textAlign:'center',marginTop:280}}>Powered by Nodebery Inc.,</Text>
          </View>   
          );
    }
}

export default Home;
