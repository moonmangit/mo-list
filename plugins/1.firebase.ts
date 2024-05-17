import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { defaultUserDoc } from "~/assets/libs/user";

export default defineNuxtPlugin(async (nuxtApp) => {
  const app = initializeApp(nuxtApp.$config.public.firebase);
  const db = getFirestore(app);
  const auth = getAuth(app);

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "localhost", 8080);
  }

  await new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      // Create user doc if not exists
      if (user) {
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists())
          await setDoc(doc(db, `users/${user.uid}`), defaultUserDoc);
      }
      useAuthStore().setUser(user);
      resolve(null);
    });
  });

  return {
    provide: {
      fb: {
        db,
        auth,
      },
    },
  };
});
