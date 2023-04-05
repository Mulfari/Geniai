import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, storage } from './firebase/firebaseStorage';

const storage = getStorage(app);

export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
