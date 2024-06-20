import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Dashboard() {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState('main');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'registration':
        return <RegistrationForm onSave={() => setCurrentScreen('main')} />;
      case 'dataList':
        return <DataList />;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.row}>
              <Text style={styles.header}>Manual</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clock In')}>
              <FontAwesome name="user" size={30} color="black" />
              <FontAwesome name="sign-in" size={30} color="black" />
                <Text style={styles.buttonText}>Clock In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clock Out')}>
              <FontAwesome name="user" size={30} color="black" />
              <FontAwesome name="sign-out" size={30} color="black" />
                <Text style={styles.buttonText}>Clock Out</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <Text style={styles.header}>Biometric</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Photo In')}>
                <FontAwesome name="image" size={30} color="black" />
                <FontAwesome name="sign-in" size={30} color="black" />
                <Text style={styles.buttonText}>Photo In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Photo Out')}>
                <FontAwesome name="image" size={30} color="black" />
                <FontAwesome name="sign-out" size={30} color="black" />
                <Text style={styles.buttonText}>Photo Out</Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.row}>
              <Text style={styles.header}>Report</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clock In Out List')}>
                <FontAwesome name="clock-o" size={60} color="black" />
                <Text style={styles.buttonText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Photo')}>
                <FontAwesome name="file-text-o" size={60} color="black" />
                <Text style={styles.buttonText}>Add User Photo</Text>
              </TouchableOpacity>
            </View>
           
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header:{
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#4e9999',
    color:'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
  },
});

// Add this function to add the toggle bar to the header left on the Dashboard screen
Dashboard.navigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      <FontAwesome name="bars" size={30} color="black" style={{ marginLeft: 20 }} />
    </TouchableOpacity>
  ),
});
