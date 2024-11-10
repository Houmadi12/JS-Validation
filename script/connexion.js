// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAGOqFLYbevZC2D1KFfzGAwZhkiVoOFb-w",
  authDomain: "tarik-13cb9.firebaseapp.com",
  projectId: "tarik-13cb9",
  storageBucket: "tarik-13cb9.appspot.com",
  messagingSenderId: "484819518400",
  appId: "1:484819518400:web:ede714b74148bffab43e25",
  measurementId: "G-C47MRZBE2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Selecteurs
const formulaire = document.querySelector("#connexion");

// Selecteur formulaire
const email = document.querySelector("#email");
const psswrd = document.querySelector("#mdp");
const text = document.querySelector("#erreur");

// ============================
// Evenements*
// ============================

formulaire.addEventListener("submit",(e) => {
  e.preventDefault();
   const mail = email.value;
   const mdp = psswrd.value;
  //  alert(`Email: ${mail} et mdp ${mdp}`)
  if (mdp.trim() === "" || mail.trim() === "") {
    text.innerHTML = "Veuillez remplir tous les champs !";
    text.classList.add("text-danger");
    text.classList.add("text-center");
    alert("Veuillez remplir tous les champs !")
  }else{
    // alert("C'est bon");
    // Connexion
    signInWithEmailAndPassword(auth,mail, mdp)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        document.location.href=`../generationCode.html?id=${user.uid}`; 
      })
      .catch(() => {
        text.innerHTML = "Login où mot de passe incorrecte !";
        text.classList.add("text-danger");
        text.classList.add("text-center");
      });
  }
})
