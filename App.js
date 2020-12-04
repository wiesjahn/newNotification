import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Amplify, { API } from 'aws-amplify'
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import Button from './Button'
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ marginBottom: 50 }}>Your expo push token: {expoPushToken}</Text>
      <Button
        expoPushToken={expoPushToken}
        scheduleNotification={amplifyApiCall}
        title='Press to send a notification via amplify'
      />
      <Button
        scheduleNotification={scheduleTwoNotifications}
        title='Press to schedule 2 notifications from app'
      />
      <Button
        scheduleNotification={schedulePushNotification}
        title='Press to schedule a notification via app'
      />
      <Button
        expoPushToken={expoPushToken}
        scheduleNotification={amplifyApiCall2Notifications}
        title='Press to end 2 notifications via amplify'
      />
      <Button
        expoPushToken={null}
        scheduleNotification={amplifyApiCallToIos}
        title='Send notifications to iphone via amplify'
      />

    </View>
  );
}

async function schedulePushNotification() {
  console.log('attempting to send notification')
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });

    //AMPLIFY API CALL

  }
  catch (err) {
    alert('there was an error');
  }
}

async function scheduleTwoNotifications() {
  console.log('attempting to send notification')
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Here is Number1!",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Here is Number 2!",
        body: 'Here is the 2nd notification',
        data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
      });

  }
  catch (err) {
    alert('there was an error');
  }
}

async function amplifyApiCall(expoPushToken) {
  const api = 'newpushapi';
  const path = '/api'
  const myInit = {
    headers: {
      "Connection": "Keep-Alive",
      "Keep-Alive": "timeout=60"
    },
    body: {
      "somePushTokens": expoPushToken,
    }
  }
  try {
    const response = await API.post(api, path, myInit);
    console.log(response)
  }
  catch (err) {
    console.log(err)
  }
}

async function amplifyApiCall2Notifications(expoPushToken) {
  const api = 'newpushapi';
  const path = '/api/test'
  const myInit = {
    headers: {
      "Connection": "Keep-Alive",
      "Keep-Alive": "timeout=60"
    },
    body: {
      "somePushTokens": expoPushToken,
    }
  }
  try {
    const response = await API.post(api, path, myInit);
    console.log(response)
  }
  catch (err) {
    console.log(err)
  }
}

async function amplifyApiCallToIos() {
  const api = 'newpushapi';
  const path = '/api/test'
  const myInit = {
    headers: {
      "Connection": "Keep-Alive",
      "Keep-Alive": "timeout=60"
    },
    body: {
      "somePushTokens": 'ExponentPushToken[xOmMZCIXsk3_tGMbzJU36y]',
    }
  }
  try {
    const response = await API.post(api, path, myInit);
    console.log(response)
  }
  catch (err) {
    console.log(err)
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    token = 'ExponentPushToken[EYenTkNan1qLwerUumTlBo]'
    // alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}