import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, Button, StyleSheet, Alert,ActivityIndicator,FlatList  } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

const api_path="http://192.168.0.78/outgraft/Services_FM_1_24/";


export default function ClockoutForm({ handleDataListPress }) {

  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
    user_id: '',
    company_id: '4',
    currentDate: '',
    currentTime: '',
    
  });




  const handleChange = (name, value) => {

    console.log('handleChange:', name, value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  

  const saveFormData = async () => {
    try {
      

      if(formData.user_id=="")
        {
          Alert.alert("Select User");
          return;
        }

      const formData1 = new FormData();
      formData1.append('user_id', formData.user_id);
      formData1.append('company_id', formData.company_id);
      formData1.append('status_date', new Date().toLocaleDateString());
      formData1.append('status_time', new Date().toLocaleTimeString());
      formData1.append('status', 'OUT');
      formData1.append('clock_by', 'Manual');
      formData1.append('clock_type', '1');
      formData1.append('lat', location.coords.latitude);
      formData1.append('lng', location.coords.longitude);
      

      console.log('name:', formData1);
      
    
      const response = await fetch(api_path+'clockinout_service.php', {
        method: 'POST',
        body: formData1,
      });
      console.log(response);
      const data = await response.json();
      Alert.alert(data[0]);

      setFormData({
        user_id:'',
        company_id: '4',
       
      });
     
      navigation.navigate('Home')

      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const route = useRoute();
  const { id = '' } = route.params || {};
  const [data, setData] = useState(null);

  useEffect(() => {
    if(id!='')
      {
        // Fetch data based on the id
        fetchData(id);
      }
  }, [id]);

  

  let saveButton;

  if (id=='') {
    saveButton = <Button title="Clock Out" onPress={saveFormData} />;
  } else {
    saveButton = <Button title="Update" onPress={saveFormData} />;
  }

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API when the component mounts
    fetch(api_path+'list_user_out_service.php') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {

        console.log(data);
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

 

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Location:</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      ) : null}

    </View>
    
      <Text style={styles.label}>Select User</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
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
            <View style={styles.buttonContainer}>
              {saveButton}
            </View>
          </>
        }
       
        renderItem={renderItem}
      />
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  label:
  {
    marginTop:50,
    fontWeight:'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    marginTop: 20,
    zIndex: 1000,
    maxHeight: 400,
  },
  buttonContainer: {
    marginTop: 150,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
