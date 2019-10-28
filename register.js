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
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const axios = require('axios');

class Register extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
      confirmPassword:'',
      summa:''
    }
    this.handleUsername=this.handleUsername.bind(this);
    this.handlePassword=this.handlePassword.bind(this);
    this.handleConfirmPassword=this.handleConfirmPassword.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleUsername(event){
      this.setState({username:event});
    }

  handlePassword(event){
      this.setState({password:event});
    }

  handleConfirmPassword(event){
      this.setState({confirmPassword:event});
    }
  
  handleSubmit(event){
      const details = {
        email:this.state.username,
        password:this.state.password,
        confirmationPassword:this.state.confirmPassword,
        publicKey:'xyz',
        privateKey:'zz',
        oss:'privae'
      }

      axios.post('http://localhost:5000/users/register',details)
      .then(response=>{
        alert(response.data.success);
      })
  }
    render(){
        return(
          <View style={{flex:1,marginTop:250,paddingLeft:30,paddingRight:30}}>
          <Text style={{ fontFamily:'arial', fontSize:20, fontWeight:'bold', textAlign:'center',color:'#2e4394' }}>Nodeberry Incorporation</Text>
          <Text style={{ fontFamily:'arial',marginTop:15, fontSize:15, fontWeight:'100', textAlign:'center' }}>Laundromat Demo</Text>
          <Text style={{textAlign:'center'}}>{this.state.username}</Text>
          <TextInput name="username" type="email" style={{height:40,borderColor:'#',borderWidth:1,borderRadius:6,textAlign:'center',marginTop:30}} placeholder="Enter your Email" value={this.state.value} onChangeText={text=>this.handleUsername(text)}/>
          <TextInput name="password" style={{height:40,borderColor:'#',borderWidth:1,borderRadius:6,textAlign:'center',marginTop:30}} placeholder="Enter your Password" value={this.state.value} onChangeText={text=>this.handlePassword(text)}/>
          <TextInput name="confirmPassword" style={{height:40,borderColor:'#',borderWidth:1,borderRadius:6,textAlign:'center',marginTop:30}} placeholder="Enter Confirmation Password" value={this.state.value} onChangeText={text=>this.handleConfirmPassword(text)}/>
          <TouchableOpacity style={{marginTop:20,backgroundColor:'#2e4394',padding:12,borderRadius:3}} onPress={this.handleSubmit}><Text style={{textAlign:'center',color:'white'}}>Register</Text></TouchableOpacity>
          <Text style={{textAlign:'center',marginTop:280}}>Powered by Nodebery Inc.,</Text>
          </View>   
          );
    }
}

export default Register;
