import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './src/components/MainScreen';
import VideoPlayer from './src/components/VideoPlayer';

const App: React.FC = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={MainScreen}
          options={{
            headerShown: false,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="video"
          component={VideoPlayer}
          options={{
            headerShown: false,
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
