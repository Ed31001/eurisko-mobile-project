import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SubmitButton } from '../ProductFormScreen';

describe('SubmitButton', () => {
  it('shows loading indicator and calls onPress', () => {
    const onPress = jest.fn();
    const styles = { submitButton: {}, disabledButton: {}, submitButtonText: {} };

    const { getByText, queryByTestId, rerender } = render(
      <SubmitButton loading={false} onPress={onPress} editing={false} styles={styles} />
    );
    fireEvent.press(getByText('Add Product'));
    expect(onPress).toHaveBeenCalled();

    rerender(<SubmitButton loading={true} onPress={onPress} editing={false} styles={styles} />);
    // Check for ActivityIndicator when loading
    expect(queryByTestId('submit-loading')).toBeTruthy();
  });
});
