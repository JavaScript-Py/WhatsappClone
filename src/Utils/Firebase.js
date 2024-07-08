import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export class Firebase {
    constructor() {
        this.init();
    }

    init() {

        if (!window._initialized) {
            const firebaseConfig = {
                apiKey: "AIzaSyDn157ZL6Y9d-cvsdxKjagdy6kni8eI94Y",
                authDomain: "whatsapp-ac64a.firebaseapp.com",
                projectId: "whatsapp-ac64a",
                storageBucket: "whatsapp-ac64a.appspot.com",
                messagingSenderId: "307061575662",
    
            };

            const app = initializeApp(firebaseConfig);
            window._initialized = true;

            this._db = getFirestore(app);
            return this._db;
            
        }

    }

    static db() {
        let db;

        if (!window._initialized || !db) {
            const firebaseConfig = {
                apiKey: "AIzaSyDn157ZL6Y9d-cvsdxKjagdy6kni8eI94Y",
                authDomain: "whatsapp-ac64a.firebaseapp.com",
                projectId: "whatsapp-ac64a",
                storageBucket: "whatsapp-ac64a.appspot.com",
                messagingSenderId: "307061575662",
    
            };

            const app = initializeApp(firebaseConfig);
            window._initialized = true;

            db = getFirestore(app);
            return db;
        }
    }

    static hd() {
        const storage = getStorage(this._app, "gs://whatsapp-ac64a.appspot.com");
        return storage;
    }

    static async iniAuth() {
        let auth;
        if (!window._initialized || !auth) {
            const firebaseConfig = {
                apiKey: "AIzaSyDn157ZL6Y9d-cvsdxKjagdy6kni8eI94Y",
                authDomain: "whatsapp-ac64a.firebaseapp.com",
                projectId: "whatsapp-ac64a",
                storageBucket: "whatsapp-ac64a.appspot.com",
                messagingSenderId: "307061575662",

            };
            window._initialized = true;
            const app = initializeApp(firebaseConfig);
            auth = getAuth(app);

            const provider = new GoogleAuthProvider();

            return new Promise((s, f) => {

                signInWithPopup(auth, provider).then((result) => {

                    const user = result.user;

                    let credential = GoogleAuthProvider.credentialFromResult(result);

                    let token = credential.accessToken;


                    s({ user, token });

                }).catch((error) => {

                    let errorMessage = error.message;

                    console.log("Erro na autenticação:", errorMessage);

                    f(error);
                });
            });
        }
    }
}
