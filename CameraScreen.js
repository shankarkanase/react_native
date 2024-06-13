import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false); // State to track if camera screen is active
  const cameraRef = useRef(null);

  const [formData, setFormData] = useState({
    photo: null,
  });

  function toggleCameraScreen() {
    setCameraActive(active => !active); // Toggle camera screen active state
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      setFormData({
        ...formData,
        photo: photo.uri, // Update the 'photo' field in the form data state
      });

      console.log('Photo captured:', photo);
      // You can use the photo data here, such as saving it to a file or displaying it in an Image component
    }
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive && ( // Render camera screen only when cameraActive is true
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraScreen}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {!cameraActive && ( // Render button to turn on camera screen when cameraActive is false
        <TouchableOpacity style={styles.button} onPress={toggleCameraScreen}>
          <Text style={styles.text}>Open Camera</Text>
        </TouchableOpacity>
      )}

      {formData.photo && <Image source={{ uri: formData.photo }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    margin: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
