import * as Keychain from 'react-native-keychain';

// 存储凭据
export async function saveCredentials(username: string, password: string) {
  try {
    return await Keychain.setGenericPassword(username, password);
  } catch (error) {
    console.error('Failed to save credentials', error);
    return false
  }
}

// 获取凭据
export async function getCredentials() {
  try {
    return await Keychain.getGenericPassword();
  } catch (error) {
    console.error('Failed to retrieve credentials', error);
    return false
  }
}

// 删除凭据
export async function deleteCredentials() {
  try {
    return await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Failed to delete credentials', error);
    return false
  }
}