import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Verification: undefined;
  ProductList: undefined;
  ProductDetails: {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
