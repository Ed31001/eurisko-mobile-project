import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Verification: undefined;
  Products: undefined;
  Profile: undefined;
  ProductDetails: {
    id: string;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
