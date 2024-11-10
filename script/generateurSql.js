const btnGenerateur = document.querySelector("#btn");
const sqrText = document.querySelector("#qr_text");
const result = document.querySelector("#result");

// Récuperer l'id de l'utilisateur
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Fonction pour calculer la taille optimale du QR code en fonction de la longueur du texte
function calculateQRSize(textLength) {
    if (textLength <= 100) return 256;
    if (textLength <= 500) return 400;
    if (textLength <= 1000) return 512;
    return 800; // Pour les textes très longs
}

//  Fonction pour sauvegarder dans localStorage
function saveQRToLocalStorage(idUser, text, imageDate) {
    const qrData = {
        idUser: idUser,
        text: text,
        image: imageDate,
    };

    // Récupérer les QR codes existants ou initialiser un tableau vide
    const savedQRCodes = JSON.parse(localStorage.getItem("qrCodes")) || [];

    // Ajouter le nouveau QR code
    savedQRCodes.push(qrData);

    // Sauvegarder dans localstorage
    localStorage.setItem("qrCodes", JSON.stringify(savedQRCodes));
}

// Configuration initiale du QR Code avec l'email par défaut
new QRCode("qr-code", {
    text: "example@gmail.com",
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L,
    quietZone: 15,
    quietZoneColor: "#ffffff",
    utf8: true
});

btnGenerateur.addEventListener("click", (e) => {
    if (!sqrText.value) {
        result.innerHTML = "Saisissez un texte ou un lien";
        result.style.color = "red";
        setTimeout(() => {
            result.innerHTML = "";
        }, 1000);
        return;
    }

    try {
        // Nettoyer le conteneur précédent
        document.querySelector("#qr-code").innerHTML = "";

        const textLength = sqrText.value.length;
        const qrSize = calculateQRSize(textLength);

        // Créer le nouveau QR code avec une taille adaptée
        new QRCode("qr-code", {
            text: sqrText.value,
            width: qrSize,
            height: qrSize,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L,
            quietZone: 15,
            quietZoneColor: "#ffffff",
            utf8: true
        });

        // Attendre que le QR soit générer
        setTimeout(() => {
            // Récuperer l'image générer
            const qrImage = document.querySelector("#qr-code img");
            if (qrImage) {
                // SauveGarder dans localStorage
                saveQRToLocalStorage(id, sqrText.value, qrImage.src);
                console.log(qrImage.src)

                displayStoredQRCodes();
            }
        }, 100)

        setTimeout(() => {
            result.innerHTML = "";
        }, 2000);

    } catch (error) {
        console.error('Erreur:', error);
        result.innerHTML = "Erreur lors de la génération du QR Code. Essayez de réduire le texte.";
        result.style.color = "red";
        setTimeout(() => {
            result.innerHTML = "";
        }, 3000);
    }
});

// Style CSS pour le conteneur du QR code
const style = document.createElement('style');
style.textContent = `
    #qr-code {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px auto;
    }
    #qr-code img {
        max-width: 100%;
        height: auto;
    }
`;
document.head.appendChild(style);

// Fonction pour récupérer les QR codes sauvegardés
function getStoredQRCodes() {
    const savedQRCodes = JSON.parse(localStorage.getItem('qrCodes')) || [];

    return savedQRCodes;
}

// Fonction pour afficher les QR codes sauvegardés
function displayStoredQRCodes() {
    const savedQRCodes = getStoredQRCodes();
    const tbody = document.getElementById("tbody");

    if (!savedQRCodes.length) {
        tbody.innerHTML = `
        <tr>
            <td  colspan="3" class="text-center">Pas de contenu</td>
        </tr>
        `;
    } else {
        // reccupération de l'ID utilisateur pour gerer l'affichage de ces propre code
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        let htmlContent = '';
        let indice = 0;

        savedQRCodes.map((qr, index) => {
            if (qr.idUser === id) {
                indice++;
                htmlContent += `
                    <tr>
                        <td>${indice}</td>
                        <td class="text-center">
                            <img src="${qr.image}" alt="QRCode" width="30"/>
                        </td>
                        <td class="fs-3 text-center">
                            <span class="text-primary fs-4" role="button" onclick="displayQRCode('${qr.image}', '${qr.text}')"><ion-icon name="book-outline"></ion-icon></span>
                            <span class="text-success" role="button" onclick="downloadImageBrowser('${qr.image}')"><ion-icon name="download-outline"></ion-icon></span>
                            <span class="text-danger" role="button" onclick="deleteQRCode(${index})"><ion-icon name="trash-outline"></ion-icon></span>
                        </td>
                    </tr>
                `;
            }
        });
        tbody.innerHTML = htmlContent;
    }
}


// Appel de fonction afficher
displayStoredQRCodes();

// Fonction pour supprimer un QR code
function deleteQRCode(index) {
    const savedQRCodes = getStoredQRCodes();
    savedQRCodes.splice(index, 1);
    localStorage.setItem('qrCodes', JSON.stringify(savedQRCodes));

    //appel la méthode afficher pour réafficher lors de suppression
    displayStoredQRCodes();
}

// Fonction pour télécharger l'image du QR code
function downloadImageBrowser(imageUrl) {
    try {
        // Créer un élément a temporaire
        const downloadLink = document.createElement('a');

        // Si imageUrl est passé comme objet, le convertir en string
        const imgSrc = typeof imageUrl === 'object' ? imageUrl.toString() : imageUrl;

        // Configurer le lien de téléchargement
        downloadLink.href = imgSrc;

        // Générer un nom de fichier avec la date actuelle
        const date = new Date();
        const fileName = `qrcode_${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}${date.getDate()
                .toString()
                .padStart(2, '0')}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}.png`;

        downloadLink.download = fileName;

        // Ajouter temporairement le lien au document
        document.body.appendChild(downloadLink);

        // Déclencher le téléchargement
        downloadLink.click();

        // Retirer le lien du document
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        alert('Une erreur est survenue lors du téléchargement du QR code');
    }
}

// Créer la structure de la modale une seule fois au chargement de la page
const modalHTML = `
<div id="qrModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Détails du QR Code</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <div id="modal-qr-image"></div>
                <p id="modal-qr-text" class="mt-3"></p>
            </div>
        </div>
    </div>
</div>`;

// Ajouter la modale au document une seule fois lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('qrModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// Fonction pour afficher le QR code
function displayQRCode(image, text) { 
    // Sélectionner les éléments après leur création
    const modalImage = document.querySelector('#modal-qr-image');
    const modalText = document.querySelector('#modal-qr-text');
    
    if (modalImage && modalText) {
        // Afficher l'image en plus grande taille avec un style flexible
        modalImage.innerHTML = `<img src="${image}" alt="QR Code" class="img-fluid" style="max-width: 300px; max-height: 300px;">`;
        
        // Afficher le texte encodé
        modalText.textContent = `Texte encodé : ${text}`;
        
        // Afficher la modale
        const modal = new bootstrap.Modal(document.getElementById('qrModal'));
        modal.show();
    } else {
        console.error('Les éléments de la modale n\'ont pas été trouvés');
    }
}