// Pour une URL comme : https://monsite.com?id=123&name=john
const urlParams = new URLSearchParams(window.location.search);
const link = document.getElementById("link");
const link1 = document.getElementById("link1");


// Récupérer un paramètre spécifique
const id = urlParams.get('id');
if (!id) {
    document.location.href = `../index.html`;
}

const pageName = window.location.pathname;
// console.log(pageName)
if (pageName === "/lectureQrCode.html") {
    // // Lien de la page lecture qr vers connexion qr
    link1.addEventListener("click", (e) => {
        // alert("Bonjour !")
        document.location.href = `../generationCode.html?id=${id}`;
    })
} else if(pageName === "/generationCode.html"){
    // Lien génération vers La page de lecture QR
    link.addEventListener("click", (e) => {
        // alert("Bonjour !")
        document.location.href = `../lectureQrCode.html?id=${id}`;
    })
}



