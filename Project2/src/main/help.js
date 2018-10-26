// Help view

'use strict'
import React, {Component} from "react"
import {Text, View, StyleSheet, TextInput, Button, AsyncStorage, TouchableOpacity} from "react-native"
import MyHeader from "../component/header"

export default class HelpView extends Component {
    static navigationOptions = {
        drawerLabel: "Help"
    }
    render() {
        return(
            <View style={styles.container}>
                
                <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
                <View style={styles.content}>
                    <Text style={styles.pageTitle}> The fact of the day</Text>
                    <Text style={styles.textTitle}> What is Melanoma?</Text>
                    <Text style={styles.text}>The most dangerous form of skin cancer, 
                    these cancerous growths develop when unrepaired DNA damage to skin 
                    cells (most often caused by ultraviolet radiation from sunshine or 
                    tanning beds) triggers mutations (genetic defects) that lead the skin 
                    cells to multiply rapidly and form malignant tumors. These tumors o
                    riginate in the pigment-producing melanocytes in the basal layer of 
                    the epidermis. 
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    content: {
        flex: 1, 
        // alignItems: "center",
        // justifyContent : "center",
        padding: 30,
        paddingTop: 10, 
    },

    pageTitle: {
        alignSelf: "center",
        fontSize:  20,
        color: "#2a85ed",
        marginBottom: 20,
        marginTop: 20,
    },

    textTitle: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom:5,
        textAlign: "left"
    },

    text: {
        fontSize: 15,
        lineHeight: 25,

    },
    })