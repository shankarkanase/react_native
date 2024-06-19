import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity  } from 'react-native';

import ClockinForm from './ClockinForm';
import ClockoutForm from './ClockoutForm';
import ClockInOutList from './ClockInOutList';
import CameraScreen from './CameraScreen';
import FaceMatchingComponentIn from './FaceMatchingComponentIn';
import FaceMatchingComponentOut from './FaceMatchingComponentOut';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Dashboard';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';





const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


export default function App({}) {

  
  const MainStackNavigator = () => (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainStackNavigator} />
        {/* Add more screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
 
  return (
  

  <NavigationContainer>
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#6bcad1', // Change the background color here
          height:100
        },
        headerTintColor: 'black', // Change the text color here
        headerTitleStyle: {
          fontWeight: 'normal', // Customize the font style of the title
          textAlign: 'right',
          fontSize: 17,
        },
        headerLeft:()=>
          (
            
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <FontAwesome name="arrow-left" size={30} color="black" style={{ marginLeft: 20 }} />
            </TouchableOpacity>
          ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <FontAwesome name="home" size={30} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="Home" component={Dashboard} />
      <Stack.Screen name="Clock In" component={ClockinForm} />
      <Stack.Screen name="Clock Out" component={ClockoutForm} />
      <Stack.Screen name="Clock In Out List" component={ClockInOutList} />
      <Stack.Screen name="Add Photo" component={CameraScreen} />
      <Stack.Screen name="Photo In" component={FaceMatchingComponentIn} />
      <Stack.Screen name="Photo Out" component={FaceMatchingComponentOut} />
    </Stack.Navigator>
  </NavigationContainer>


  );
}


