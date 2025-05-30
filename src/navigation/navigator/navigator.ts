import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductDetails } from '../../services/productService';

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
  Cart: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ProductStackNavigationProp = NativeStackNavigationProp<ProductStackParamList>;
