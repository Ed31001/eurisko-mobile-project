import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProductListHeaderButtons from '../ProductListHeaderButtons';

describe('ProductListHeaderButtons', () => {
  it('calls onShowSearch and onShowSort when buttons are pressed', () => {
    const onShowSearch = jest.fn();
    const onShowSort = jest.fn();

    const { getAllByRole } = render(
      <NavigationContainer>
        <ProductListHeaderButtons onShowSearch={onShowSearch} onShowSort={onShowSort} />
      </NavigationContainer>
    );

    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]); // Search
    fireEvent.press(buttons[1]); // Sort

    expect(onShowSearch).toHaveBeenCalled();
    expect(onShowSort).toHaveBeenCalled();
  });
});
