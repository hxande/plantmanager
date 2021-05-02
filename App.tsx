import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import Routes from './src/routes';
import { Plants } from './src/libs/storage';

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as Plants
      });
    return () => subscription.remove();

    // async function notifications() {
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log(data);
    // }
    // notifications();
  }, []);

  return (
    <Routes />
  );
}