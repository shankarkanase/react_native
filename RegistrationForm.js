import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, TextInput, Button, StyleSheet, Alert,Image, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Camera  } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';




export default function RegistrationForm({ handleDataListPress }) {

  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    dob: '',
    qualification: '',
    gender: '',
    country:'',
    courses: [],
    photo: null,
  });

  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);

  const handleChange = (name, value) => {

    console.log('handleChange:', name, value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (course) => {
    const { courses } = formData;
    const updatedCourses = courses.includes(course)
      ? courses.filter(c => c !== course)
      : [...courses, course];

    setFormData({
      ...formData,
      courses: updatedCourses
    });
  };

  const saveFormData = async () => {
    try {
      
      
      const formData1 = new FormData();
      formData1.append('id', formData.id);
      formData1.append('name', formData.name);
      formData1.append('email', formData.email);
      formData1.append('phone', formData.phone);
      formData1.append('dob', formData.dob);
      formData1.append('country', formData.country);
      formData1.append('gender', formData.gender);
      formData1.append('courses', formData.courses.join(','));

      console.log('name:', formData1);

      if (formData.photo) {
        const uriParts = formData.photo.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData1.append('photo', {
          uri: formData.photo,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch('http://192.168.0.78/react_api/save_form.php', {
        method: 'POST',
        body: formData1,
      });
      console.log(response);
      const data = await response.json();
      Alert.alert(data[0]);

      if (data[0] === "New record created successfully") {
        setFormData({
          id:'',
          name: '',
          email: '',
          phone: '',
          dob: '',
          qualification: '',
          gender: '',
          country: '',
          courses: [],
          photo: null,
        });
      }

      navigation.navigate('UserList')

      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request permission to access media library
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
  
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    console.log(result.assets[0].uri);
  
    if (!result.cancelled) {
      setFormData({
        ...formData,
        photo: result.assets[0].uri, // Update the 'photo' field in the form data state
      });
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

  const fetchData = async (id) => {
    try {

      if(id!='')
      {
      console.log(`http://192.168.0.78/react_api/user_detail.php?id=`+id);

      // Fetch data using the id
      const response = await fetch(`http://192.168.0.78/react_api/user_detail.php?id=`+id);
      const jsonData = await response.json();

      console.log(jsonData);

      setFormData({
        id: jsonData.id,
        name: jsonData.name,
        email: jsonData.email,
        phone: jsonData.phone,
        dob: jsonData.dob,
        qualification: jsonData.name,
        gender: jsonData.gender,
        country: jsonData.country,
        courses: jsonData.courses.split(","),
        photo: "http://192.168.0.78/react_api/"+jsonData.photo,
      });

      setData(jsonData);
     }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  let saveButton;

  if (id=='') {
    saveButton = <Button title="Save" onPress={saveFormData} />;
  } else {
    saveButton = <Button title="Update" onPress={saveFormData} />;
  }
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>User Registration Form</Text>

     

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(value) => handleChange('phone', value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={formData.dob}
        onChangeText={(value) => handleChange('dob', value)}
      />


      
<View style={styles.dropdownContainer}>
<DropDownPicker
  items={[
    {label: 'USA', value: 'usa', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
    {label: 'UK', value: 'uk', icon: () => <Icon name="flag" size={18} color="#900" />},
    {label: 'India', value: 'india', icon: () => <Icon name="flag" size={18} color="#900" />},
    {label: 'France', value: 'france', icon: () => <Icon name="flag" size={18} color="#900" />},
  ]}
  defaultValue={selectedValue}
  containerStyle={{height: 40}}
  style={{backgroundColor: '#fafafa'}}
  open={open}
  setOpen={setOpen}
  value={formData.country}
  setValue={setSelectedValue}
  onSelectItem={(item) => {
    setSelectedValue(item.value); // Update selectedValue state
    handleChange('country', item.value); // Update formData with selected country
  }}
/>
      </View>

      <View style={{ flex: 1,height:250, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Select from Gallery" onPress={pickImage} />
        {formData.photo && <Image source={{ uri: formData.photo }} style={{ width: 200, height: 200 }} />}
        </View>

      <View style={styles.radioContainer}>
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.radioButton}>
          <Button
            title=""
            onPress={() => handleChange('gender', 'Male')}
            color={formData.gender === 'Male' ? 'blue' : 'white'}
          />
        </View><Text style={styles.label}>Male</Text>
        <View style={styles.radioButton}>
          <Button
            title=""
            onPress={() => handleChange('gender', 'Female')}
            color={formData.gender === 'Female' ? 'blue' : 'white'}
          />
        </View><Text style={styles.label}>Female</Text>
      </View>

      <Text style={styles.label}>Courses:</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          <Button
            title=""
            onPress={() => handleCheckboxChange('Computer')}
            color={formData.courses.includes('Computer') ? 'blue' : 'white'}
          />
        </View><Text style={styles.label}>Computer</Text>

        <View style={styles.checkbox}>
          <Button
            title=""
            onPress={() => handleCheckboxChange('Electrical')}
            color={formData.courses.includes('Electrical') ? 'blue' : 'white'}
          />
        </View><Text style={styles.label}>Electrical</Text>

        <View style={styles.checkbox}>
          <Button
            title=""
            onPress={() => handleCheckboxChange('Mechanical')}
            color={formData.courses.includes('Mechanical') ? 'blue' : 'white'}
          />
        </View><Text style={styles.label}>Mechanical</Text>
      </View>

    
      
{saveButton}
      

      <View style={styles.buttonContainer}>
        <Button title="Home" onPress={() => navigation.navigate('Home')}/>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    top:20,
  
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginRight: 8,
  },
  radioButton: {
    marginRight: 8,
  height: 20, // Adjust height and width as needed
  width: 20,
  borderWidth: 2,
  marginLeft: 20
    
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
    
  },
  checkbox: {
    marginRight: 8,
  height: 20, // Adjust height and width as needed
  width: 20,
  borderWidth: 2,
  marginLeft: 20
  },
});
