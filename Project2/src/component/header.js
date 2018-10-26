// A warpped component of commom headers

'use strict'
import React, {Component} from "react"
import {Text, Image, View, StyleSheet, Button, TouchableOpacity} from "react-native"

// header for main views that has a button to trigger drawer
export default class MyHeader extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.drawerOpen} >
                    <Text style={styles.menu}> ☰ </Text>
                </TouchableOpacity>
                <Image style={styles.logo} source={require('../img/logo.png')} />
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: 10,
            paddingTop: 30,
            paddingBottom: 10,
            // paddingTop: 30,
            // paddingRight: 10,
            backgroundColor: "#2a85ed"
        },

        menu: {
            fontSize: 20,
            color: 'white',
            // marginLeft: 10,
        },

        logo: {
            width: 46, 
            height: 20
        }
    }
) 