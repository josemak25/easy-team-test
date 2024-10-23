import {ImageRequireSource} from 'react-native';

const localImage = [
  {
    name: 'google-icon',
    id: require('../../assets/images/google_icon.png'),
  },
  {
    name: 'main-background',
    id: require('../../assets/images/main_background.png'),
  },
  {
    name: 'avatar-notification',
    id: require('../../assets/images/avatar_notification.png'),
  },
  {
    name: 'auth-background',
    id: require('../../assets/images/auth_background.png'),
  },
  {
    name: 'watch-one',
    id: require('../../assets/images/watch_one.png'),
  },
  {
    name: 'watch-two',
    id: require('../../assets/images/watch_two.png'),
  },
] as const;

const images = localImage.reduce((acc, image) => {
  acc[image.name] = image.id;
  return acc;
}, {} as Record<(typeof localImage)[number]['name'], ImageRequireSource>);

export const AppImages = {images};
