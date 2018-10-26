/**
 * @author Jiechen Xu
 */

import React, {Component, PropTypes} from "react"
import {Text, View, StyleSheet, Platform, TouchableHighLight} from "react-native"

// a custome button for logging in
export default class Button extends Component {
    render() {
        return(
            <TouchableHighLight onPress={this.props.onPress}>
                {this._renderContent}
            </TouchableHighLight>
        )
    }

    _renderContent() {
        return (
            <View style={styles.content}>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text:{
        color: "white",
        fontSize: 13,
    },
    content: {
        height: 45,
        backgroundColor: "#282C34",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
    },
})