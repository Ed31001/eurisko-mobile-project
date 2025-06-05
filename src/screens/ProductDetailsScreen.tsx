import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  PermissionsAndroid,
  Linking,
  Clipboard,
  Share,
} from 'react-native';
import * as FileSystem from 'react-native-fs';
import Swiper from 'react-native-swiper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, ProductStackParamList } from '../navigation/navigator/navigator';
import useProductDetailsScreenStyles from '../styles/ProductDetailsScreenStyles';
import { useProductStore } from '../store/useProductStore';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';
import MapView, { Marker } from 'react-native-maps';
import { useAuthStore } from '../store/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productService } from '../services/productService';
import { useCartStore } from '../store/useCartStore';

type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const { id } = route.params;
  const { getProductById, selectedProduct, loading, error, refreshProducts } = useProductStore();
  const theme = useThemeStore((state) => state.theme);
  const styles = useProductDetailsScreenStyles();
  const [isPortrait, setIsPortrait] = useState(true);
  const { width } = useWindowDimensions();
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<ProductStackParamList>>();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number; height: number } }) => {
      setIsPortrait(window.height >= window.width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    onChange({ window: Dimensions.get('window') });
    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]);

  useEffect(() => {
    if (selectedProduct) {
      setImageLoading(new Array(selectedProduct.images.length).fill(true));
    }
  }, [selectedProduct]);

  const handleImageLoad = useCallback((index: number) => {
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  }, []);

  const requestStoragePermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const saveImage = useCallback(async (imageUrl: string) => {
    try {
      const hasPermission = await requestStoragePermission();

      if (!hasPermission) {
        Alert.alert('Permission denied', 'Please grant storage permission to save images');
        return;
      }

      const date = new Date();
      const fileName = `product_${date.getTime()}.jpg`;
      const path = `${FileSystem.PicturesDirectoryPath}/${fileName}`;

      Alert.alert('Saving...', 'Please wait while we save your image');

      const response = await FileSystem.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
      }).promise;

      if (response.statusCode === 200) {
        await FileSystem.scanFile(path);
        Alert.alert('Success', 'Image saved to gallery!');
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save image');
    }
  }, [requestStoragePermission]);

  const handleLongPress = useCallback((imageUrl: string) => {
    Alert.alert(
      'Save Image',
      'Would you like to save this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => saveImage(imageUrl) },
      ]
    );
  }, [saveImage]);

  const handleEmailPress = useCallback(async () => {
    if (!selectedProduct?.user?.email) {
      Alert.alert('Error', 'No email address available for the seller');
      return;
    }

    const subject = encodeURIComponent(`Regarding your product: ${selectedProduct.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in your product "${selectedProduct.title}".`);

    try {
      const mailtoUrl = `mailto:${selectedProduct.user.email}?subject=${subject}&body=${body}`;
      const canOpenMailto = await Linking.canOpenURL(mailtoUrl);

      if (canOpenMailto) {
        await Linking.openURL(mailtoUrl);
        return;
      }

      const outlookUrl = `ms-outlook://compose?to=${encodeURIComponent(selectedProduct.user.email)}&subject=${subject}&body=${body}`;
      const canOpenOutlook = await Linking.canOpenURL(outlookUrl);

      if (canOpenOutlook) {
        await Linking.openURL(outlookUrl);
        return;
      }

      Alert.alert(
        'Copy Email',
        `No email app found. The seller's email is: ${selectedProduct.user.email}`,
        [
          {
            text: 'Copy Email',
            onPress: () => {
              Clipboard.setString(selectedProduct.user.email);
              Alert.alert('Success', 'Email copied to clipboard');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (err) {
      console.error('Email error:', err);
      Alert.alert(
        'Error',
        'Could not handle email. Please try again.',
        [
          {
            text: 'Copy Email',
            onPress: () => {
              Clipboard.setString(selectedProduct.user.email);
              Alert.alert('Success', 'Email copied to clipboard');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  }, [selectedProduct]);

  const renderOwnerSection = useCallback(() => {
    if (!selectedProduct?.user) {
      return null;
    }
    const { email } = selectedProduct.user;
    const displayName = email.split('@')[0];
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
      <View style={styles.ownerContainer}>
        <View style={styles.ownerImageContainer}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.ownerInitials}>{initials}</Text>
          </View>
        </View>
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerName}>{displayName}</Text>
          <Text style={styles.ownerEmail}>{email}</Text>
        </View>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleEmailPress}
        >
          <Text style={styles.emailIcon}>✉️</Text>
          <Text style={styles.emailButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    );
  }, [selectedProduct, styles, handleEmailPress]);

  const renderMap = useCallback(() => {
    if (!selectedProduct?.location) {
      return null;
    }

    return (
      <View style={styles.mapContainer}>
        <Text style={styles.locationText}>{selectedProduct.location.name}</Text>
        {!mapReady && (
          <ActivityIndicator
            size="large"
            color={theme.buttonBackground}
            style={styles.mapLoader}
          />
        )}
        {mapError ? (
          <Text style={styles.errorText}>Error loading map: {mapError}</Text>
        ) : (
          <MapView
            style={[
              styles.map,
              !mapReady && styles.hiddenMap,
            ]}
            initialRegion={{
              latitude: selectedProduct.location.latitude,
              longitude: selectedProduct.location.longitude || selectedProduct.location.latitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            onMapReady={() => setMapReady(true)}
            onMapLoaded={() => setMapReady(true)}
            onRegionChangeComplete={() => {
              if (!mapReady) {
                setMapReady(true);
              }
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedProduct.location.latitude,
                longitude: selectedProduct.location.longitude || selectedProduct.location.latitude,
              }}
              title={selectedProduct.location.name}
            />
          </MapView>
        )}
      </View>
    );
  }, [selectedProduct, styles, theme.buttonBackground, mapReady, mapError]);

  const isOwner = useMemo(
    () => user?.id === selectedProduct?.user?._id,
    [user, selectedProduct]
  );

  const handleEdit = useCallback(() => {
    if (!selectedProduct){ return; }
    navigation.navigate('EditProduct', {
      product: selectedProduct,
    });
  }, [navigation, selectedProduct]);

  const handleDelete = useCallback(() => {
    if (!selectedProduct){ return; }

    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(selectedProduct._id);
              await refreshProducts();
              Alert.alert('Success', 'Product deleted successfully');
              navigation.goBack();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  }, [selectedProduct, refreshProducts, navigation]);

  const renderOwnerActions = useCallback(() => {
    if (!isOwner){ return null; }

    return (
      <View style={styles.ownerActionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }, [isOwner, styles, handleEdit, handleDelete]);

  const handleAddToCart = useCallback(() => {
    if (selectedProduct) {
      addToCart(selectedProduct);
      Alert.alert('Success', 'Product added to cart');
    }
  }, [selectedProduct, addToCart]);

  const handleShare = useCallback(() => {
    if (!selectedProduct){ return; }
    const url = `myproject://products/${selectedProduct._id}`;
    const message = `Check out this product: ${selectedProduct.title}\n\n${selectedProduct.description}\nPrice: $${selectedProduct.price}\n\nOpen in app: ${url}`;
    Share.share({
      message,
      url,
      title: selectedProduct.title,
    });
  }, [selectedProduct]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error || !selectedProduct) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => getProductById(id)}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        isPortrait ? styles.scrollViewContentPortrait : styles.scrollViewContentLandscape,
      ]}
    >
      <View
        style={[
          styles.swiperContainer,
          !isPortrait && { width: width * 0.5 },
        ]}
      >
        <Swiper
          showsButtons
          showsPagination
          loop={false}
          dotColor={theme.buttonText + '80'}
          activeDotColor={theme.buttonText}
          nextButton={<Text style={styles.swiperButton}>›</Text>}
          prevButton={<Text style={styles.swiperButton}>‹</Text>}
        >
          {selectedProduct.images?.map((image, index) => (
            <View key={index} style={styles.slide}>
              <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={() => handleLongPress(image.url)}
                delayLongPress={500}
                style={styles.touchableImage}
              >
                <Image
                  source={{
                    uri: image.url,
                    headers: {
                      Accept: 'image/*',
                    },
                  }}
                  style={styles.image}
                  onLoadStart={() => handleImageLoad(index)}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
                />
              </TouchableOpacity>
              {imageLoading[index] && (
                <ActivityIndicator
                  size="large"
                  color={theme.buttonBackground}
                  style={styles.imageLoader}
                />
              )}
            </View>
          ))}
        </Swiper>
      </View>

      <View style={[
        styles.detailsContainer,
        !isPortrait && { paddingBottom: moderateScale(20) },
      ]}>
        <Text style={styles.title}>{selectedProduct.title}</Text>
        <Text style={styles.description}>{selectedProduct.description}</Text>
        <Text style={styles.price}>Price: ${selectedProduct.price}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        {renderOwnerSection()}
        {renderMap()}
        {renderOwnerActions()}
      </View>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
