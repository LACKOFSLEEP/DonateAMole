// Support view

'use strict'
import React, {Component} from "react"
import {Text, View, StyleSheet, TextInput, Button, AsyncStorage, TouchableOpacity} from "react-native"
import MyHeader from "../component/header"

export default class SupportView extends Component {
    static navigationOptions = {
        drawerLabel: "Support"
    }
    render() {
        return(
            <View style={styles.container}>
                <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
                <View style={styles.content}>
                    <Text style={styles.pageTitle}> Find doctors nearby </Text>
                    <View style={styles.listContainer}>
                        <View style={styles.list}>
                            <Text style={styles.listTitle}> Mater Hill Family Medical Centre</Text>
                            <Text style={styles.listText}>Address: Suite 7/40 Annerley Rd, Woolloongabba QLD 4102</Text>
                            <Text style={styles.listText}>Phone: (07) 3828 6300</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listTitle}> St Lucia Clinic </Text>
                            <Text style={styles.listText}>Address: St Lucia QLD 4067</Text>
                            <Text style={styles.listText}>Phone: (07) 3365 6210</Text>
                        </View>

                        <View style={styles.list}>
                            <Text style={styles.listTitle}> SmartClinics Toowong Family Medical Centre </Text>
                            <Text style={styles.listText}>Address: Level 10/39 Sherwood Rd, Toowong QLD 4066</Text>
                            <Text style={styles.listText}>Phone: (07) 3371 5666</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listTitle}> Brisbane Allied Health Centre </Text>
                            <Text style={styles.listText}>Address: 180 Fairfield Rd, Fairfield QLD 4103</Text>
                            <Text style={styles.listText}>Phone: (07) 3846 2277</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listTitle}> SmartClinics George Street Family Medical Centre </Text>
                            <Text style={styles.listText}>Address: 275 George St, Brisbane City QLD 4000</Text>
                            <Text style={styles.listText}>Phone: (07) 3236 2559</Text>
                        </View>
                    </View>
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
        alignItems: "center",
        // justifyContent : "center",
        padding: 10,
        paddingTop: 10, 
    },

    pageTitle: {
        fontSize:  20,
        color: "#2a85ed",
        marginTop: 20,
        marginBottom: 20,
        // margin: 30,
    },
    listContainer: {
        // marginTop: 20,
        padding: 10, 
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#F2F2F2"
    },

    listTitle: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom:5,
    },

    listText: {
        // margin: 10,

    }


    })