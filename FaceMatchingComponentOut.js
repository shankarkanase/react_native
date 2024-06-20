import React, { useState, useRef,useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

const api_path = "http://192.168.0.78/outgraft/Services_FM_1_24/";

export default function FaceMatchingComponentOut() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const cameraRef = useRef(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const [formData, setFormData] = useState({
    user_id: null,
    company_id: '4',
    photo: null,
    preview: null,
  });

  const saveFormData = async () => {
    try {
      setLoading(true);
      const formData1 = new FormData();
      formData1.append('user_id', formData.user_id);

      if (formData.photo) {
        const uriParts = formData.photo.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData1.append('photo', {
          uri: formData.photo,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch(api_path + 'match_user_service.php', {
        method: 'POST',
        body: formData1,
      });
      const data = await response.json();
      console.log('API Response:', data);

      if (data.match == '1') {
        console.log('User ID from API:', data.UserID);
        setFormData((prevFormData) => ({
          ...prevFormData,
          user_id: data.UserID,
        }));
        Alert.alert("Match Found.. " + data.name);
      } else {
        Alert.alert("No Match Found..");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  function toggleCameraScreen() {
    setCameraActive(active => !active);
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      setFormData((prevFormData) => ({
        ...prevFormData,
        preview: photo.uri,
        photo: photo.uri,
      }));

      console.log('Photo captured:', photo);
      toggleCameraScreen(); // Automatically close the camera after taking a picture
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const addClockin = async () => {
    try {
      setLoading(true);
      const formData1 = new FormData();
      formData1.append('user_id', formData.user_id);
      formData1.append('company_id', formData.company_id);
      formData1.append('status_date', new Date().toLocaleDateString());
      formData1.append('status_time', new Date().toLocaleTimeString());
      formData1.append('status', 'OUT');
      formData1.append('clock_by', 'Biometric');
      formData1.append('clock_type', '55');
      formData1.append('lat', location.coords.latitude);
      formData1.append('lng', location.coords.longitude);

      const response = await fetch(api_path + 'clockinout_service.php', {
        method: 'POST',
        body: formData1,
      });
      const data = await response.json();
      Alert.alert(data[0]);

      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: '',
        company_id: '4',
        photo: null,
        preview: null,
      }));
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}
      {!cameraActive && (
        <View>
          {formData.photo && <Image source={{ uri: formData.preview }} style={{ width: 400, height: 400 }} />}

          <View style={styles.buttonContainer}>
            <Button title="Match" onPress={saveFormData} />
            {formData.user_id && <Button title="Confirm Clock Out" onPress={addClockin} />}
          </View>
        </View>
      )}

      {cameraActive && (
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.halfButton} onPress={toggleCameraScreen}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.halfButton} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {!cameraActive && (
        <TouchableOpacity style={styles.openCameraButton} onPress={toggleCameraScreen}>
          <Text style={styles.text}>Open Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop:20
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  openCameraButton: {
    backgroundColor: '#AABBCC',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
    position: 'absolute',
    bottom: 20,
    width: '90%',
  },
  halfButton: {
    backgroundColor: '#AABBCC',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
