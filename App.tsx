import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { uploadToS3 } from "./lib/dataService";

export default function App() {
  //gets the status of the camera permissions
  const [status, requestPermissions] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState<{
    uri: string;
    base64String: string;
    fileType: string;
  } | null>(null);

  async function handleRequestPermission() {
    await requestPermissions();
  }

  //opens the devices camera to take a picture
  async function handleTakePicture() {
    const { canceled, assets } = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    //checks if the camera was cancelled and the picture was discarded
    if (!canceled) {
      setImage({
        uri: assets[0].uri as string,
        base64String: assets[0].base64 as string,
        fileType: assets[0].mimeType as string,
      });
    }
  }

  //opens the devices photo gallery for users to select an image to upload
  async function handleUploadPicture() {
    const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    //checks if the camera was cancelled and the picture was discarded
    if (!canceled) {
      setImage({
        uri: assets[0].uri as string,
        base64String: assets[0].base64 as string,
        fileType: assets[0].mimeType as string,
      });
    }
  }

  //FUNCTION USED TO UPLOAD TO s3
  //it calls the function we created
  function handleUploadToS3() {
    //if there is no image, the function does not run
    if (!image) return;
    uploadToS3({ base64String: image.base64String, fileType: image.fileType });
  }

  return (
    <SafeAreaView style={styles.container}>
      {!status?.granted && (
        <Pressable onPress={handleRequestPermission}>
          <Text style={{ color: "white", fontSize: 20 }}>Allow Camera</Text>
        </Pressable>
      )}

      {status?.granted && (
        <>
          <View>
            <Pressable onPress={handleTakePicture}>
              <Text style={{ color: "white", fontSize: 20 }}>Take Picture</Text>
            </Pressable>

            <Pressable onPress={handleUploadPicture}>
              <Text style={{ color: "white", fontSize: 20 }}>
                Upload Picture
              </Text>
            </Pressable>
          </View>

          {/* this is only shown when there is an uploaded/chosen image*/}
          {image && (
            <>
              <Image width={200} height={200} source={{ uri: image.uri }} />

              <Pressable onPress={handleUploadToS3}>
                <Text style={{ color: "white", fontSize: 20 }}>
                  Upload to s3
                </Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
