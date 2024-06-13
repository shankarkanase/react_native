// DataList.js
import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, FlatList, Button, TouchableOpacity, StyleSheet, Alert,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { useNavigation } from '@react-navigation/native';

const DataList = ({  }) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from API
      const response = await fetch('http://192.168.0.78/react_api/list.php');
      const jsonData = await response.json();
      setData(jsonData); // Set received data to state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteItem(id) }
      ],
      { cancelable: false }
    );
  };

  const deleteItem = async (id) => {
    try {
      const formData1 = new FormData();
      formData1.append('id', id);
      // Make DELETE request to API
      const response = await fetch('http://192.168.0.78/react_api/delete.php', {
        method: 'POST',
        body: formData1,
      });

      if (response.ok) {
        const responseData = await response.json();
        Alert.alert(responseData[0]);
        // Call fetchData to refresh the list
        fetchData();
      } else {
        Alert.alert('Error', 'Failed to delete item.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item.');
    }
  };

  const searchList = async (value) => {
    setSearchText(value); // Update the search text state
    try {
      // Make API call to search with the entered text
      const response = await fetch(`http://192.168.0.78/react_api/list.php?query=`+value);
      const jsonData = await response.json();
      setData(jsonData); // Set received data to state
    } catch (error) {
      console.error('Error searching data:', error);
      Alert.alert('Error', 'Failed to search data.');
    }
  };

  const handleNavigation = (id) => {
    navigation.navigate('Registration', { id: id });
  };

  counter=1
  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemDetails}>
        <Text>{counter++}</Text>
        {item.photo && <Image source={{ uri: "http://192.168.0.78/react_api/"+item.photo }} style={{ width: 150,borderRadius:75, height: 150 }} />}
        <Text>{item.name}</Text>
        <Text>{item.email}</Text>
        <Text>{item.phone}</Text>
        <Text>{item.dob}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={30} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation(item.id)} style={styles.deleteButton}>
        <Ionicons name="pencil" size={30} color="blue" />
      </TouchableOpacity>
    </View>
  );

  const DataList = ({navigation}) => {
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigation.navigate('Profile', {name: 'Jane'})
        }
      />
    );
  };
  const ProfileScreen = ({navigation, route}) => {
    return <Text>This is {route.params.name}'s profile</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      <Text style={styles.title}>Data List</Text>
      <Text style={styles.counter}>Total Users: {data.length}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by name"
          value={searchText}
          onChangeText={text => searchList(text)}
        />
        <View style={styles.clearSearchContainer}>
          <Button style={styles.clear} title="Clear Search" onPress={() => searchList('')} />
        </View>
      </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Assuming data has unique id
      />
      <View style={styles.buttonContainer}>
      <Button title="Home" onPress={() => navigation.navigate('Home')}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  counter: {
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    top:20,
    backgroundColor:'#cedcf2',
    marginTop:20,
  },
  itemDetails: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  search: {
    borderWidth: 1,
    height: 50,
    padding:5,
  },
  clearSearchContainer: {
    top:10,
    bottom:20,
  },
});

export default DataList;
