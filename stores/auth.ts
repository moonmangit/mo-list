import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  type User,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

type _User = Pick<User, "uid" | "email" | "displayName" | "photoURL">;

export const useAuthStore = defineStore("Auth", () => {
  const data = ref<_User | null>(null);
  const isLoggedIn = computed(() => data.value !== null);
  const $reset = () => (data.value = null);

  function setUser(user: User | null) {
    if (user) {
      data.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      navigateTo("/dashboard");
    } else {
      $reset();
      navigateTo("/login");
    }
  }
  async function logInWithEmailPassword(email: string, password: string) {
    await signInWithEmailAndPassword(useNuxtApp().$fb.auth, email, password);
  }
  async function logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    await signInWithPopup(useNuxtApp().$fb.auth, provider);
  }
  async function registerWithEmailPassword(email: string, password: string) {
    await createUserWithEmailAndPassword(
      useNuxtApp().$fb.auth,
      email,
      password,
    );
  }
  async function logout() {
    await signOut(useNuxtApp().$fb.auth);
  }

  return {
    data,
    isLoggedIn,
    $reset,
    setUser,
    logInWithEmailPassword,
    logInWithGoogle,
    registerWithEmailPassword,
    logout,
  };
});
