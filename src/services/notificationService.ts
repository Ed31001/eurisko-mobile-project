import PushNotification from 'react-native-push-notification';
import { Platform, Linking } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = () => {
    PushNotification.configure({
      onNotification: function (notification: any) {
        if (notification.userInteraction) {
          const productId = notification.data?.productId || notification.productId;
          if (productId) {
            const url = `myproject://products/${productId}`;
            if (!(global as any).navigationReady) {
              (global as any).pendingOpenUrl = url;
            } else {
              Linking.openURL(url);
            }
          }
        }
        notification.finish && notification.finish('background');
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'product-channel',
        channelName: 'Product Notifications',
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log(`createChannel returned '${created}'`)
    );
  };

  sendLocalNotification = (productId: string, title: string) => {
    PushNotification.localNotification({
      channelId: 'product-channel',
      title: 'New Product Added',
      message: `You've successfully added: ${title}`,
      playSound: true,
      soundName: 'default',
      data: { productId },
      userInfo: { productId },
    });
  };
}

export default new NotificationService();
