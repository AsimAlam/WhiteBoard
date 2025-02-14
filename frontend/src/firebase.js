import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_project.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => console.log("User:", result.user))
        .catch((error) => console.error(error));
};

export { signIn };
