import 'react-native-get-random-values';
import React, { useState } from 'react';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import useAddProductScreenStyles from '../styles/AddProductScreenStyles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import { productService } from '../services/productService';

const addProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
});

type AddProductFormData = z.infer<typeof addProductSchema>;

const AddProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const styles = useAddProductScreenStyles();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [location, setLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [mapRegion] = useState({
    latitude: 33.8938,
    longitude: 35.5018,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  });

  const handleImagePick = async (type: 'camera' | 'gallery') => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 images allowed');
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8,
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
          name: result.assets[0].fileName || `photo-${Date.now()}.jpg`,
        };
        setImages((prev) => [...prev, newImage]);
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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddProductFormData) => {
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

      await productService.addProduct(formData);
      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Add product error:', err);
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddProductScreen;
