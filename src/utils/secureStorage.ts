import * as Keychain from 'react-native-keychain';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await Keychain.setGenericPassword(accessToken, refreshToken);
};

export const getTokens = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return { accessToken: credentials.username, refreshToken: credentials.password };
  }
  return null;
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword();
};
