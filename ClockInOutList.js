// DataList.js
import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, FlatList, Button, TouchableOpacity, StyleSheet, Alert,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { useNavigation } from '@react-navigation/native';

const api_path="http://192.168.0.78/outgraft/Services_FM_1_24/";

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
      const response = await fetch(api_path+'clockinout_list.php');
      const jsonData = await response.json();
      setData(jsonData); // Set received data to state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  


  const searchList = async (value) => {
    setSearchText(value); // Update the search text state
    try {
      // Make API call to search with the entered text
      const response = await fetch(api_path+'clockinout_list.php?query='+value);
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

const itemstyle='item';

  counter=1
  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={item.Status=='IN'?styles.item:styles.item1}>
      <View style={styles.itemDetails}>
        
        <Text style={styles.clockstatustext}>{item.Name}</Text>
        <Text>{item.StatusDate} {item.StatusTime}</Text>
        <View style={styles.clockstatus}>
        <Text style={styles.clockstatustext}>{item.Status}</Text>
        </View>
      </View>
    </View>
  );

 

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      
      <Text style={styles.counter}>Total Records: {data.length}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
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
        keyExtractor={(item) => item.SessionId.toString()} // Assuming data has unique id
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  clockstatustext:{

fontWeight:'bold'
  },
  clockstatus:{
    position:'absolute',
    marginLeft:280,
    alignSelf:'right',
  },
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
    fontWeight:'bold',
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
  item1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    top:20,
    backgroundColor:'#b6f2ea',
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
    borderColor:'black',
    height: 50,
    padding:5,
  },
  clearSearchContainer: {
    top:10,
    bottom:20,
  },
});

export default DataList;
