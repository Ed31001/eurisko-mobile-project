import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductItem from '../ProductItem';

describe('ProductItem', () => {
  it('renders title and price and calls onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ProductItem
        title="Test Product"
        price={99}
        imageUrl="https://example.com/image.jpg"
        onPress={onPress}
      />
    );
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99')).toBeTruthy();
    fireEvent.press(getByText('Test Product'));
    expect(onPress).toHaveBeenCalled();
  });
});
