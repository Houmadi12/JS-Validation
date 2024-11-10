// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


// Selecteurs
const formulaire = document.querySelector("#inscription");

// Selecteur formulaire
const nom = document.querySelector("#nom");
const prenom = document.querySelector("#prenom");
const email = document.querySelector("#email");
const psswrd = document.querySelector("#mdp");
const text = document.querySelector("#erreur");

// ============================
// Evenements*
// ============================

// Evenement pour ajouter un utilisateur
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();

  const nm = nom.value;
  const prnom = prenom.value;
  const mail = email.value;
  const mdp = psswrd.value;

  if (nm.trim() === "" || prnom.trim() === "" || mail.trim() === "") {
    text.innerHTML = "Veuillez remplir tous les champs !";
    text.classList.add("text-danger");
    text.classList.add("text-center");
  } else {
    ajouterUser(nm, prnom, mail, mdp);

    // Creer un utilisateur firebase
    createUserWithEmailAndPassword(auth, mail, mdp)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
      })
      .catch((err) => {
        console.log(err.code);
        console.log(err.message);
      });

      nom.value = "";
      prenom.value = "";
      email.value = "";
      psswrd.value="";

      // Message de reussit
      text.innerHTML = "Inscritpion reussi !";
      text.classList.add("text-success");
      text.classList.add("text-center");
  }
});

// Function d'ajout
async function ajouterUser(name, lastnam, mail, motDEpasse) {

  // Add a new document with a generated id.
  try {
    const docRef = await addDoc(collection(db, "users"), {
      nom: name,
      prenom: lastnam,
      email: mail,
      password: motDEpasse
    });
  } catch (err) {
    console.log("Erreur d'ajout ", err);
  }
}
