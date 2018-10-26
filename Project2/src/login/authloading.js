// An authentication view to detech if the user has logged in or not
// Require async

'use strict'

import React, {Component} from "react"
import {  ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View,} from 'react-native'

export default class AuthloadingScreen extends Component {
    constructor(props){
        super(props)
        this._bAsync()
    }

    // Check if the user has a token or not, 
    // navigate the user who has token to main view of this app
    _bAsync =  async() => {
        const uToken = await AsyncStorage.getItem('uToken')
        this.props.navigation.navigate(uToken ? 'Main' : 'Auth')
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })