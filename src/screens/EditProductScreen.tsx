import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { launchCamera, launchImageLibrary, PhotoQuality } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProductStackNavigationProp } from '../navigation/navigator/navigator';
import useEditProductScreenStyles from '../styles/EditProductScreenStyles';
import { productService } from '../services/productService';
import type { RouteProp } from '@react-navigation/native';
import type { ProductStackParamList } from '../navigation/navigator/navigator';
import { useProductStore } from '../store/useProductStore';

const editProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
});

type EditProductFormData = z.infer<typeof editProductSchema>;
type EditProductScreenRouteProp = RouteProp<ProductStackParamList, 'EditProduct'>;

const EditProductScreen = () => {
  const navigation = useNavigation<ProductStackNavigationProp>();
  const route = useRoute<EditProductScreenRouteProp>();
  const { product } = route.params;
  const { refreshProducts } = useProductStore();
  const styles = useEditProductScreenStyles();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [location, setLocation] = useState({
    name: product.location.name,
    latitude: product.location.latitude,
    longitude: product.location.longitude,
  });
  const [searchText, setSearchText] = useState(product.location.name);
  const [mapRegion] = useState({
    latitude: product.location.latitude,
    longitude: product.location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price.toString(),
    },
  });

  useEffect(() => {
    const existingImages = product.images.map((img: { url: string }) => ({
      uri: img.url.startsWith('http')
        ? img.url
        : `https://backend-practice.eurisko.me/${img.url.replace(/^\/+/, '').replace(/^api\//, '')}`,
      type: 'image/jpeg',
      name: 'existing-image.jpg',
    }));
    setImages(existingImages);
  }, [product.images]);

  const handleImagePick = async (type: 'camera' | 'gallery') => {
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
      const result = type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.assets && result.assets[0]) {
        const newImage = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || 'photo.jpg',
        };
        setImages(prev => [...prev, newImage]);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Product Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('gallery') },
      ]
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setLocation({
      name: searchText.trim() || 'Selected Location',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const handleLocationNameChange = (text: string) => {
    setSearchText(text);
    if (location) {
      setLocation({
        ...location,
        name: text.trim() || 'Selected Location',
      });
    }
  };

  const onSubmit = async (data: EditProductFormData) => {
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

      await productService.updateProduct(product._id, formData);
      await refreshProducts();
      Alert.alert('Success', 'Product updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Update product error:', err);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
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

        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.title && styles.errorInput]}
              placeholder="Product Title"
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
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Enter location name"
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

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating Product...' : 'Update Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProductScreen;
