import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CancelButton, SearchButton } from '../SearchModal';

describe('SearchModal Buttons', () => {
  it('calls onPress for CancelButton', () => {
    const onPress = jest.fn();
    const { getByText } = render(<CancelButton onPress={onPress} />);
    fireEvent.press(getByText('Cancel'));
    expect(onPress).toHaveBeenCalled();
  });

  it('calls onPress for SearchButton', () => {
    const onPress = jest.fn();
    const { getByText } = render(<SearchButton onPress={onPress} />);
    fireEvent.press(getByText('Search'));
    expect(onPress).toHaveBeenCalled();
  });
});
