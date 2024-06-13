import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import DropDownPicker from 'react-native-dropdown-picker';

const api_path = "http://192.168.0.78/outgraft/Services_FM_1_24/";

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false); // State to track if camera screen is active
  const cameraRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: '',
    company_id: '4',
    photo: null,
    preview:null,
  });

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const saveFormData = async () => {
    try {
      

      if(formData.user_id=="")
        {
          Alert.alert("Select User");
          return;
        }

      const formData1 = new FormData();
      formData1.append('user_id', formData.user_id);

      

      if (formData.photo) {
        const uriParts = formData.photo.split('.');
        const fileType = uriParts[uriParts.length - 1];

        console.log('Photo URI:', formData.photo);
        console.log('URI Parts:', uriParts);
        console.log('File Type:', fileType);

        formData1.append('photo', {
          uri: formData.photo,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });

        //console.log('FormData appended photo:', formData1.get('photo'));
      }
     

      console.log('FormData appended photo:', formData1);
    
      const response = await fetch(api_path+'save_user_image_service.php', {
        method: 'POST',
        body: formData1,
      });
      console.log(response);
      const data = await response.json();
      Alert.alert(data[0]);

      setFormData({
        user_id:'',
        company_id: '4',
        photo:null,
       
      });
     


      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Fetch data from API when the component mounts
    fetch(api_path + 'list_user_service.php') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Transform the data into the format required by DropDownPicker
        const transformedData = data.map((item) => ({
          label: item.Name,
          value: item.UserID,
        }));
        setItems(transformedData);
        setLoading(false); // Stop loading indicator
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  function toggleCameraScreen() {
    setCameraActive(active => !active); // Toggle camera screen active state
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      setFormData({
        ...formData,
        preview: photo.uri, // Update the 'photo' field in the form data state
        photo: photo.uri,
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

  const handleChange = (name, value) => {
    console.log('handleChange:', name, value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  let saveButton;

    saveButton = <Button title="Save" onPress={saveFormData} />;

  return (
    <View style={styles.container}>


      <Text style={styles.label}>Select User</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.value.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                items={items}
                defaultValue={selectedValue}
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: '#fafafa' }}
                dropDownContainerStyle={styles.dropDownContainer}
                open={open}
                setOpen={setOpen}
                value={selectedValue}
                setValue={setSelectedValue}
                onSelectItem={(item) => {
                  setSelectedValue(item.value);
                  handleChange('user_id', item.value);
                }}
                zIndex={1000}
                zIndexInverse={3000}
                elevation={5}
                flatListProps={{
                  scrollEnabled: true, // Ensure the dropdown list is scrollable
                }}
              />
            </View>
          </>
        }
      />

      {formData.photo && <Image source={{ uri: formData.preview }} style={{ width: 200, height: 200 }} />}

      <View style={styles.buttonContainer}>
              {saveButton}
            </View>

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
  label: {
    marginTop: 50,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 100,
    zIndex: 1000,
    maxHeight: 400,
  },
});
