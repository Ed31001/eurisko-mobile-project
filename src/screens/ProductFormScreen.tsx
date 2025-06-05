import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { launchCamera, launchImageLibrary, PhotoQuality } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import useProductFormScreenStyles from '../styles/ProductFormScreenStyles';
import { productService, ProductDetails } from '../services/productService';
import notificationService from '../services/notificationService';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const styles = useProductFormScreenStyles();

  const editing = !!route?.params?.product;
  const product: ProductDetails | undefined = route?.params?.product;

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [location, setLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(
    product
      ? {
          name: product.location.name,
          latitude: product.location.latitude,
          longitude: product.location.longitude,
        }
      : null
  );
  const [searchText, setSearchText] = useState(product?.location.name || '');

  // Memoize mapRegion so it doesn't recalculate on every render
  const mapRegion = useMemo(
    () => ({
      latitude: product?.location.latitude || 33.8938,
      longitude: product?.location.longitude || 35.5018,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [product]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editing
      ? {
          title: product?.title || '',
          description: product?.description || '',
          price: product?.price?.toString() || '',
        }
      : undefined,
  });

  // Memoize existingImages to avoid recalculating in useEffect
  const existingImages = useMemo(() => {
    if (editing && product?.images) {
      return product.images.map((img: { url: string }) => ({
        uri: img.url.startsWith('http')
          ? img.url
          : `https://backend-practice.eurisko.me/${img.url.replace(/^\/+/, '').replace(/^api\//, '')}`,
        type: 'image/jpeg',
        name: 'existing-image.jpg',
      }));
    }
    return [];
  }, [editing, product]);

  useEffect(() => {
    if (editing && product?.images) {
      setImages(existingImages);
    }
  }, [editing, product, existingImages]);

  // Memoize handlers
  const handleImagePick = useCallback(
    async (type: 'camera' | 'gallery') => {
      if (images.length >= 5) {
        Alert.alert('Limit Reached', 'Maximum 5 images allowed');
        return;
      }
      const options = {
        mediaType: 'photo' as const,
        quality: 0.8 as PhotoQuality,
        maxWidth: 500,
        maxHeight: 500,
      };
      try {
        const result =
          type === 'camera'
            ? await launchCamera(options)
            : await launchImageLibrary(options);

        if (result.assets && result.assets[0]) {
          const newImage = {
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
            name: result.assets[0].fileName || `photo-${Date.now()}.jpg`,
          };
          setImages((prev) => [...prev, newImage]);
        }
      } catch (err) {
        console.error('Error picking image:', err);
        Alert.alert('Error', 'Failed to pick image');
      }
    },
    [images.length]
  );

  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      editing ? 'Edit Product Image' : 'Add Product Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('gallery') },
      ]
    );
  }, [editing, handleImagePick]);

  const removeImage = useCallback(
    (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    },
    []
  );

  const handleMapPress = useCallback(
    (event: MapPressEvent) => {
      const { coordinate } = event.nativeEvent;
      setLocation({
        name: searchText.trim() || 'Selected Location',
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    },
    [searchText]
  );

  const handleLocationNameChange = useCallback(
    (text: string) => {
      setSearchText(text);
      if (location) {
        setLocation({
          ...location,
          name: text.trim() || 'Selected Location',
        });
      }
    },
    [location]
  );

  const onSubmit = useCallback(
    async (data: ProductFormData) => {
      if (!location) {
        Alert.alert('Error', 'Please select a location');
        return;
      }
      if (images.length === 0) {
        Alert.alert('Error', 'Please add at least one image');
        return;
      }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('location', JSON.stringify(location));
        images.forEach((image) => {
          formData.append('images', image);
        });

        if (editing && product) {
          await productService.updateProduct(product._id, formData);
          notificationService.sendLocalNotification(product._id, data.title, { type: 'edit' });
          Alert.alert('Success', 'Product updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          const newProductResponse = await productService.addProduct(formData);
          const newProduct = newProductResponse.data;
          notificationService.sendLocalNotification(newProduct._id, newProduct.title, { type: 'add' });
          Alert.alert('Success', 'Product added successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } catch (err) {
        console.error('Product form error:', err);
        Alert.alert('Error', editing ? 'Failed to update product' : 'Failed to add product');
      } finally {
        setLoading(false);
      }
    },
    [editing, product, location, images, navigation]
  );

  const renderImages = () => (
    <View style={styles.imagesContainer}>
      {images.map((image, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => removeImage(index)}
          >
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
      {images.length < 5 && (
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={showImagePickerOptions}
        >
          <Text style={styles.addImageText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderForm = () => (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.title && styles.errorInput]}
            placeholder="Product Title"
            placeholderTextColor="gray"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.textArea, errors.description && styles.errorInput]}
            placeholder="Product Description"
            placeholderTextColor="gray"
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      <Controller
        name="price"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.price && styles.errorInput]}
            placeholder="Price"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
    </>
  );

  const renderLocationPicker = () => (
    <View style={styles.locationContainer}>
      <TextInput
        style={[styles.input, styles.locationInput]}
        placeholder="Enter location name"
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={handleLocationNameChange}
      />
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        onPress={handleMapPress}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
          />
        )}
      </MapView>
      {location && (
        <Text style={styles.locationText}>
          Selected: {location.name} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {renderImages()}
        {renderForm()}
        {renderLocationPicker()}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {editing ? 'Update Product' : 'Add Product'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProductFormScreen;
