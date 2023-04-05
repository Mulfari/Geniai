import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const saveChatLog = async (chatLog) => {
  const storageRef = ref(storage, 'chat-logs');
  const chatLogRef = ref(storageRef, `${Date.now()}.json`);
  await uploadBytes(chatLogRef, new Blob([JSON.stringify(chatLog)], { type: 'application/json' }));
};
