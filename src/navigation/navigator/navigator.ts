import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Verification: undefined;
  Products: undefined;
  Profile: undefined;
  ProductList: undefined;
  ProductDetails: {
    id: string;
  };
  AddProduct: undefined;
};

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetails: { id: string };
  AddProduct: undefined;
  EditProduct: {
    product: ProductDetails;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ProductStackNavigationProp = NativeStackNavigationProp<ProductStackParamList>;
