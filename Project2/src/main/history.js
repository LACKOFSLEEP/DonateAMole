// The view is to show all directories of users have created and has 
// An api to create a new directory

import React, {Component} from "react"
import {RefreshControl,Alert, ScrollView, Dimensions, Text, Image, View, StyleSheet, TextInput, TouchableOpacity, AsyncStorage} from "react-native"
import MyHeader from "../component/header"
import Spinner from 'react-native-loading-spinner-overlay'
import Dialog from "react-native-dialog"

export default class HistoryView extends Component {

    // constructor for HistoryView
    constructor(props) {
        super(props)
        this.state = {history:[], names:[], length:0, visible: false, refreshing: false}
    }

    // // After rendering get all info has been cached
    componentWillReceiveProps(nextProps) {
        if (true) {
            console.log("kk")
            this.fetchPhotos()
        }
    }

    // Prefetch donation history
    async componentDidMount() {
        this.fetchPhotos()
    }


    // Refreash the view by scrolling down
    _onRefresh = () => {
        this.setState({refreshing: true});
        console.log("refreshing")
        this.fetchPhotos().then(() => {
          this.setState({refreshing: false});
        });
    }

    fetchPhotos = async() => {

        uid = await AsyncStorage.getItem("uid")
        this.setState({visible: true})
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/history.php", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: uid,
                tag: 'history'
            })
        })
        .then((response) => response.json()
        )
        .then((responseJson) => {
            // Add history to Async
            this.setState((previousState => {
                // Reconstruct the data structure in order to iterate and render
                dirc = []
                for(i=0;i<responseJson.length;i++){
                    dirc.push({
                        key: i,
                        value: responseJson[i]
                    })
                }
                return({history: dirc, length: responseJson.length})
            }))
        })
        this.forceUpdate()
        this.setState({visible: false})
    }

    render() {
        myWidth = Dimensions.get('window').width/2-20 // Get the width of phone screen
        var entries = []
        const history = this.state.history
        // Iterate all directories
        history.map((value, key) => {
            key = value.key,
            value = value.value
            entries.push(
                    // given every album different function so to navigate to different pages
                    <Album key={key} value={value} 
                    navigateToSilgle={() => this.props.navigation.navigate('Single', {key: key, value:value})}
                    navigateToOnDonate={() => this.props.navigation.navigate('OnDonate', {entry: value[0]})}
                    navigateToSelf={() =>  this.props.navigation.navigate("Root", {changed: true})}/>
                )
        })       
        return( 
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Fetching Data..."} /> 
                <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
                <ScrollView refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    />
                    }style={{flex:1}}>
                    <View style={{flex:1, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-around'}}>
                        {entries}
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OnDonate', {entry: null})} 
                            style={{width: myWidth, height: myWidth, backgroundColor: 'tomato', justifyContent: "center", alignItems: "center"}}>
                            <Text style={{color: 'white'}}>Create a new album</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
 
            </View>
        )
    }
}

// A Album class that will only fetch the specific album name from the logined user
class Album extends Component {
    constructor(props) {
        super(props)
        this.state = {visible: false}
    }

    // function to change the state of visible
    rename() {
        this.setState({visible: !this.state.visible})
    }

    async sendNewName(value) {
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/updateAlbum.php", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: await AsyncStorage.getItem('uid'),
                oldName: this.props.value[0],
                newName: value
            })
        })
        .then((response) => response.json()
        )
        .then((responseJson) => {
            if (responseJson.update == false) {
                setTimeout(function(){Alert.alert('Ooops...', "Some thing went wrong")}, 500)
            } else {
                this.props.navigateToSelf()
            }
        }) 
    }

    // promte to ask user to confirm delition
    async deleteAlbum() {
        Alert.alert(
            "Confirm Delete",
            "Are you sure to continue to delete the whole album?",
            [
                {text: "Cancel", style: 'cancel'},
                {text: "Confirm", onPress: () => this.sendDelete(this.state.pid)},
            ],
            {cancelable: false}
        )
        
    }

    // delete the album passing the uid and album to AIP
    async sendDelete() {
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/deleteAlbum.php", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: await AsyncStorage.getItem('uid'),
                name: this.props.value[0],
            })
        })
        .then((response) => response.json()
        )
        .then((responseJson) => {
            if (responseJson.delete == false) {
                setTimeout(function(){Alert.alert('Ooops...', "Some thing went wrong")}, 500)
            } else {
                this.props.navigateToSelf()
            }
        }) 
    }

    // if cancle is called change the state of visible
    handleCancel = () => {
        this.setState({visible: !this.state.visible})
    }

    // if ok is called change the state of visible
    handleOk = () => {
        this.setState({visible: !this.state.visible})
        this.sendNewName(this.state.text)
    }

    render() {
        return (
            <View style={styles.album}>
            <Dialog.Container visible={this.state.visible}>
                <Dialog.Title>Edit</Dialog.Title>
                <Dialog.Description>
                  Your new album name
                </Dialog.Description>
                {/* change state text */}
                <Dialog.Input onChangeText = {(text) => this.setState({text})} 
                autoCapitalize={"none"}
                autoCorrect={false}></Dialog.Input>
                <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                <Dialog.Button label="Ok" onPress={this.handleOk} />
            </Dialog.Container>
            
            <TouchableOpacity onPress={this.props.navigateToSilgle}>
                <Image source={{uri:this.props.value[1][0]}} // Show the first photo of the donation
                style={{width: myWidth, height: myWidth}} />
            </TouchableOpacity>
            
            <Text style={{width: myWidth, height: 20, fontSize: 15, paddingBottom: 10, marginBottom: 2}}>{this.props.value[0]}</Text>

            {/* three buttons to add, edit or delete a single album */}
            <View style={styles.albumButton}>
                <TouchableOpacity style={{width: (myWidth)/3*2, backgroundColor: "#3d70b2"}} onPress={this.props.navigateToOnDonate}>
                    <Text style={{textAlign: 'center'}}>add photos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.rename()}>
                    <Image style={styles.textButton} source={require("../img/edit.png")}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.deleteAlbum()}>
                    <Image style={styles.textButton} source={require("../img/rubbish-bin.png")}/>
                </TouchableOpacity>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "#5898E3",
        opacity: 0.5,
    },

    album: {
        margin: 10
    },

    albumButton: {
        flex:1, 
        flexDirection: 'row',
        height: 20,
        justifyContent: "space-around"
    },

    textButton: {
        paddingLeft: 10,
        height: 20,
        width: 20,
    },

    buttonContainer: {

    }
})


