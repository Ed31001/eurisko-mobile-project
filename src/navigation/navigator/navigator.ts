import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Verification: undefined;
  ProductList: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
