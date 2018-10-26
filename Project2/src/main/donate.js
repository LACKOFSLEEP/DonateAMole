// A component to handler camera and upload events

import React, {Component} from "react"
import {Text, View, Image, TextInput, StyleSheet, Dimensions,  AsyncStorage, TouchableOpacity, ScrollView} from "react-native"
import ImagePicker from "react-native-image-picker"
import MyHeader from "../component/header"
import upload from "../function/upload"
import AlbumHeader from "../component/albumHeader"
import { Dropdown } from 'react-native-material-dropdown'
import { KeyboardAvoidingView } from 'react-native';

export default class DonateView extends Component {

    constructor(props) {
        super(props)
        this.state = {loading: false, uid:'', name:'', names:[], entry: this.props.navigation.state.params.entry, pickedImage: null
        , location: '', size: '', description: ''}
    }

    // get the uid
    async componentDidMount() {
       var uid = await AsyncStorage.getItem('uid')
       this.setState({uid: uid})
    }

    // A select photo method 
    // Requires ImagePicker lib
    selectPhoto = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {

                let file = response.uri // the file to upload
                this.setState({
                    loading:true,
                    pickedImage: {uri: file}
                })
                console.log(response.uri)
                // Auto upload
                this.setState({file: file, name: response.fileName})               
            }
        })
    }

    // upload a photo picked from selectphoto()
    _upload = () => {
        if(this.state.file == null) {
            alert("Please choose a photo")
            return
        }else if(typeof(this.state.entry) == "object" || this.state.entry == "") {
            console.log("1")
            alert("Please input a name for new directory!")
            return
        } else if(!this.state.file) {
            console.log("2")
            alert("Please choose a image!")
            return
        } else if(this.state.location == ""){
            console.log("3")
            alert("Please choose a location")
            return
        } else if(this.state.size == ""){
            console.log("4")
            alert("Please describe the size")
            return
        } else if(this.state.description == ""){
            console.log("5")
            alert("Please describe the mole")
            return
        } else {
            upload(this.state.uid, this.state.file,this.state.name, this.state.entry, this.state.location, this.state.size, this.state.description)
            this.props.navigation.navigate('Root', {upload: true})
            alert("Sueecssfully uploaded!")
        }
    }

    // Detemine whether user is donating in a exist album or in a new album
    // This is achieved by the props of navigarion
    _handleEntry = () => {
        if(this.props.navigation.state.params.entry != null) { // this is a new ablum
            return(
                <View style={styles.dynamicContent}>
                    
                    <View style={styles.placeholder}>
                        <Image style={styles.previewImage} source={this.state.pickedImage}/>
                    </View>

                    <TouchableOpacity onPress={this.selectPhoto} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>select a photo</Text>
                    </TouchableOpacity>

                    <Dropdown
                            label='Location'
                            containerStyle={{width:230}}
                            data={[{
                                value: 'Face',
                              }, {
                                value: 'Arms',
                              }, {
                                value: 'Chest',
                              }, {
                                value: 'Heap',
                              }, {
                                value: 'Legs',
                              },]}
                            onChangeText={(text) => {this.setState({location: text})}}
                    />        

                    <View style={styles.inputContent}>
                        <TextInput placeholder="Please describe the size" onChangeText=
                        {(text) => {this.setState({size: text})}}></TextInput>
                        <View style={styles.underline}></View>
                        <TextInput placeholder="Write some descriptions for this mole" onChangeText=
                        {(text) => {this.setState({description: text})}}></TextInput>
                        <View style={styles.underline}></View>
                    </View>
                </View>                
            )
            
        } else { // this is a exist album
            return(
                <View style={styles.dynamicContent}>
                    <View style={styles.inputContent}>
                        <TextInput placeholder="Input the name of the directory"
                            onChangeText={(entry)=>this.setState({entry})}
                            value={this.state.entry}
                            autoCapitalize={"none"}
                            autoCorrect={false}>
                        </TextInput>
                        <View style={styles.underline}></View>

                        <View style={styles.placeholder}>
                        <Image style={styles.previewImage} source={this.state.pickedImage}/>
                        </View>

                        <TouchableOpacity onPress={this.selectPhoto} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>select a photo</Text>
                        </TouchableOpacity> 

                        <Dropdown
                            label='Location'
                            containerStyle={{width:230}}
                            data={[{
                                value: 'Face',
                              }, {
                                value: 'Arms',
                              }, {
                                value: 'Chest',
                              }, {
                                value: 'Heap',
                              }, {
                                value: 'Legs',
                              },]}
                            onChangeText={(text) => {this.setState({location: text})}}
                        />  

                        <TextInput placeholder="Please describe the size" onChangeText=
                        {(text) => {this.setState({size: text})}}></TextInput>
                        <View style={styles.underline}></View>
                        <TextInput placeholder="Write some descriptions for this donation"
                            onChangeText={(description)=>this.setState({description})}
                            value={this.state.description}>
                        </TextInput>
                        <View style={styles.underline}></View>                    
                    </View>
                </View>
            )          
        }
    }

    render() {
        return(
            // the top level content in this view
            <KeyboardAvoidingView style={styles.container}  behavior="padding" enabled>
                <AlbumHeader name={this.state.entry} 
                back={() => this.props.navigation.navigate('Root')}
                add={null}/>
                <ScrollView style={{paddingTop: 20}}>   
                    {this._handleEntry()}
                    <TouchableOpacity onPress={this._upload} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>submit</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
  
                       
        )
    }
}

const options = {
    title: 'Choose a Photo', 
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take a Photo', 
    chooseFromLibraryButtonTitle: 'Library', 
    storageOptions: {
        cameraRoll: true,
        waitUntilSaved: true,
    },
    cropping: true,
    includeBase64: true,
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high', 
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2, 
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: true,
}

myWidth = Dimensions.get('window').width

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "white"     
    },

    content: {
        flex: 1, 
        alignItems: "center",
        justifyContent : "space-around",
    },

    dynamicContent: {
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "stretch",
    },

    album: {
        marginBottom: 20,
    },

    underline: { 
        height: 1,
        backgroundColor:"#5898E3", 
        marginTop: 10, 
        marginBottom: 10,
    },

    buttonContainer: {
        alignSelf: "stretch",
        padding: 20,
        marginBottom: 10, 
        borderRadius: 5, 
        backgroundColor: "#2a85ed", 
        borderWidth: 2,
    },

    buttonText: { 
        textAlign: "center", 
        fontSize: 15, 
        fontWeight: "bold", 
        color: "white",
    },

    textButtonContainer: { 
        margin:10,
        marginLeft: 0,
    },

    textButton: {
        color: "#5898E3", 
        textDecorationLine:'underline', 
    },

    previewImage: {
        width: "100%",
        height: "100%"
    },

    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: myWidth / 2,
        height: myWidth / 2,
        alignSelf: "center",
        marginBottom: 20,
    },

})
