import *as React from 'react';
import { Text, View, StyleSheet, Image, Button, Platform } from 'react-native';
import *as ImagePicker from 'expo-image-picker';
import *as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
    state = {
        image: null
    };

    render() {
        let { image } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    title="Pick image from your gallary"
                    onPress={this.pickImage()} />
            </View>
        )
    }

    componentDidMount() {
        this.getPermissionAsync();
    }
    getPermissionAsync = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (staus !== 'granted') {
                alert("We need camera permission!!!")
            }
        }

    };
    uploadImage = async (uri) => {
        const data = new FormData();
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type,
        };
        data.append("digit", fileToUpload);
        fetch("https://d4de6f538005.ngrok.io/predict-alphabet", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ image: result.data });
                console.log(result.uri)
                this.uploadImage(result.uri);
            }
        } catch (E) {
            console.log(E);
        }
    };
}