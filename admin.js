const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true';

let puppies = JSON.parse(localStorage.getItem("puppiesData"));
if (!puppies) {
  puppies = [
    { id: 1, defaultName: "Chiot 1", type: "Femelle bringée", name: "", status: "dispo", adoptant: {} },
    { id: 2, defaultName: "Chiot 2", type: "Mâle fauve", name: "", status: "dispo", adoptant: {} },
    { id: 3, defaultName: "Chiot 3", type: "Femelle fauve", name: "", status: "dispo", adoptant: {} },
    { id: 4, defaultName: "Chiot 4", type: "Mâle bringé", name: "", status: "dispo", adoptant: {} },
    { id: 5, defaultName: "Chiot 5", type: "Femelle bringée", name: "", status: "dispo", adoptant: {} },
    { id: 6, defaultName: "Chiot 6", type: "Mâle fauve", name: "", status: "dispo", adoptant: {} }
  ];
  savePuppies();
}

function savePuppies() {
  localStorage.setItem("puppiesData", JSON.stringify(puppies));
}

function renderPuppies() {
  const container = document.getElementById("puppies-container");
  if (!container) return;
  container.innerHTML = "";

  puppies.forEach(p => {
    const displayName = p.name ? p.name : p.defaultName;
    const badgeColor = p.status === "dispo" ? "var(--gold)" : "#a3a3a3";
    const badgeText = p.status === "dispo" ? "Dispo à l'adoption" : "Adopté";
    
    // Pour l'instant placeholder, remplacé par de vraies images plus tard
    const imgHTML = `
      <div class="photo-placeholder" style="aspect-ratio: 1; border-radius: 0; position:relative;">
        <div style="position:absolute; top:10px; right:10px; background:${badgeColor}; color:#fff; font-size:0.7rem; padding:0.2rem 0.6rem; border-radius:4px; font-weight:bold; z-index:10; text-transform:uppercase; letter-spacing:1px;">
          ${badgeText}
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span>${displayName}</span>
      </div>
    `;

    const card = document.createElement("div");
    card.className = "gallery-item";
    card.style.cursor = "pointer";
    card.innerHTML = `
      ${imgHTML}
      <div class="caption">
        <strong>${displayName}</strong><br>
        <span style="font-size:0.9em; opacity:0.8;">${p.type}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      if (isAdmin) {
        openAdminModal(p.id);
      } else {
        openPublicModal(p.id);
      }
    });

    container.appendChild(card);
  });
}

function openPublicModal(id) {
  const p = puppies.find(x => x.id === id);
  alert("Diaporama public pour " + (p.name || p.defaultName) + " (bientôt disponible)");
}

function openAdminModal(id) {
  const p = puppies.find(x => x.id === id);
  document.getElementById("admin-puppy-id").value = p.id;
  document.getElementById("admin-puppy-name").value = p.name || "";
  document.getElementById("admin-puppy-status").value = p.status;
  
  document.getElementById("ad-nom").value = p.adoptant.nom || "";
  document.getElementById("ad-prenom").value = p.adoptant.prenom || "";
  document.getElementById("ad-adresse").value = p.adoptant.adresse || "";
  document.getElementById("ad-tel").value = p.adoptant.tel || "";
  document.getElementById("ad-email").value = p.adoptant.email || "";
  document.getElementById("ad-id-piece").value = p.adoptant.idPiece || "";
  document.getElementById("ad-puce").value = p.adoptant.puce || "";
  document.getElementById("ad-montant").value = p.adoptant.montant || "";
  document.getElementById("ad-date-cec").value = p.adoptant.dateCec || "";
  document.getElementById("ad-date-depart").value = p.adoptant.dateDepart || "";
  
  document.getElementById("admin-modal").style.display = "flex";
}

function closeAdminModal() {
  document.getElementById("admin-modal").style.display = "none";
}

function saveAdminForm() {
  const id = parseInt(document.getElementById("admin-puppy-id").value);
  const p = puppies.find(x => x.id === id);
  
  p.name = document.getElementById("admin-puppy-name").value;
  p.status = document.getElementById("admin-puppy-status").value;
  
  p.adoptant = {
    nom: document.getElementById("ad-nom").value,
    prenom: document.getElementById("ad-prenom").value,
    adresse: document.getElementById("ad-adresse").value,
    tel: document.getElementById("ad-tel").value,
    email: document.getElementById("ad-email").value,
    idPiece: document.getElementById("ad-id-piece").value,
    puce: document.getElementById("ad-puce").value,
    montant: document.getElementById("ad-montant").value,
    dateCec: document.getElementById("ad-date-cec").value,
    dateDepart: document.getElementById("ad-date-depart").value
  };
  
  savePuppies();
  renderPuppies();
  closeAdminModal();
}

document.addEventListener("DOMContentLoaded", () => {
  renderPuppies();
});

function generateDocument(type) {
  const id = parseInt(document.getElementById("admin-puppy-id").value);
  const p = puppies.find(x => x.id === id);
  
  let docTitle = "";
  let docHtml = "";
  
  if (type === "cec") {
    docTitle = "Certificat d'Engagement et de Connaissance";
    docHtml = \`
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
        <h2 style="text-align:center; font-size:18px;">CERTIFICAT D'ENGAGEMENT ET DE CONNAISSANCE</h2>
        <h3 style="text-align:center; font-size:14px; font-weight:normal;">Visant à la responsabilisation de l’acquéreur d’un animal de compagnie<br/>(Loi n° 2021-1539 du 30 novembre 2021)</h3>
        
        <p style="margin-top:40px;"><strong>Je soussigné(e) :</strong></p>
        <p>
          Nom : \${p.adoptant.nom || "......................................."} &nbsp;&nbsp;&nbsp; Prénom : \${p.adoptant.prenom || "......................................."}<br/>
          Adresse : \${p.adoptant.adresse || "......................................................................................................."}<br/>
          Téléphone : \${p.adoptant.tel || "......................................."} &nbsp;&nbsp;&nbsp; E-mail : \${p.adoptant.email || "......................................."}
        </p>

        <p style="margin-top:20px;">Déclare par le présent document m'engager en toute connaissance de cause à accueillir un chien d'apparence de race "Boxer" issu de la portée née le 18 août 2026 chez Mme Anouck Mauger à Berd'huis (61).</p>
        <p>En signant ce certificat, je reconnais avoir pris pleinement connaissance des obligations suivantes liées à la détention d'un chien :</p>
        
        <p><strong>1. Besoins biologiques, physiologiques et comportementaux :</strong><br/>
        Le chien est un être vivant doué de sensibilité. Il a besoin d'une alimentation séquencée et adaptée, d'un accès constant à de l'eau propre, d'un abri tempéré et de sorties quotidiennes indispensables à sa socialisation et à sa santé mentale et physique, même s'il dispose d'un jardin.</p>

        <p><strong>2. Spécificités du Type Boxer :</strong><br/>
        Le Boxer est un chien dynamique, athlétique et joueur, nécessitant une éducation cohérente et bienveillante dès son plus jeune âge ainsi que des dépenses physiques régulières. C'est un animal très proche de sa famille qui supporte mal la solitude prolongée. En raison de sa morphologie (brachycéphale), il convient d'être vigilant en cas de fortes chaleurs. Son espérance de vie moyenne est de 10 à 12 ans.</p>

        <p><strong>3. Obligations financières et logistiques :</strong><br/>
        L'accueil d'un animal représente un coût financier annuel constant et important tout au long de sa vie (estimé entre 800 € et 1 500 € par an, hors imprévus médicaux) comprenant : la nourriture de qualité, l'identification obligatoire, les vaccins annuels, les traitements antiparasitaires réguliers (puces, tiques, vers) et les soins vétérinaires en cas de maladie ou d'accident. Il implique également d'anticiper la garde de l'animal lors des absences ou des vacances.</p>

        <p><strong>4. Conséquences de la détention :</strong><br/>
        Je m'engage à faire identifier et enregistrer l'animal au fichier national I-CAD. Le non-respect des besoins de l'animal ou son abandon sur la voie publique constituent des délits passibles de sanctions pénales.</p>

        <p style="margin-top:30px;">Fait à ..................................................., le ................................................... (Date de signature)</p>

        <p style="margin-top:30px; font-weight:bold;">[MENTION MANUSCRITE OBLIGATOIRE À RECOPIER PAR L'ADOPTANT] :</p>
        <p>« Je m'engage à respecter les besoins physiologiques, comportementaux et financiers de cet animal. »</p>
        <p>......................................................................................................................................................</p>

        <p style="margin-top:40px;"><strong>Signature de l'adoptant :</strong></p>
      </div>
    \`;
  } else if (type === "attestation") {
    docTitle = "Attestation d'Adoption et Transfert de Propriété";
    docHtml = \`
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000;">
        <h2 style="text-align:center; font-size:18px;">ATTESTATION D'ADOPTION & DE TRANSFERT DE PROPRIÉTÉ</h2>
        <h3 style="text-align:center; font-size:14px; font-weight:normal;">(À établir en deux exemplaires originaux, un pour chaque partie)</h3>
        
        <p style="margin-top:30px;">Le présent document officialise le transfert de garde et de responsabilité de l'animal décrit ci-dessous, conformément à la réglementation en vigueur.</p>

        <h4 style="margin-top:20px;">1. LES PARTIES</h4>
        <p><strong>Le Cédant (Propriétaire d'origine) :</strong><br/>Mme Anouck Mauger, Particulière passionnée, demeurant à Berd'huis (61340).</p>
        <p><strong>L'Adoptant (Nouveau Propriétaire) :</strong><br/>
        Nom : \${p.adoptant.nom || "......................................."} &nbsp;&nbsp;&nbsp; Prénom : \${p.adoptant.prenom || "......................................."}<br/>
        Adresse : \${p.adoptant.adresse || "......................................................................................................."}<br/>
        Téléphone : \${p.adoptant.tel || "......................................."} &nbsp;&nbsp;&nbsp; E-mail : \${p.adoptant.email || "......................................."}<br/>
        Pièce d'identité vérifiée (Nature & N°) : \${p.adoptant.idPiece || "............................................................................."}
        </p>

        <h4 style="margin-top:20px;">2. L'ANIMAL</h4>
        <p>
        Nom d'usage : \${p.name || "......................................."} &nbsp;&nbsp;&nbsp; Sexe : \${p.type.includes("Femelle") ? "Femelle" : "Mâle"}<br/>
        Date de naissance : 18 août 2026<br/>
        Espèce : Chien · Race : Non inscrit au LOF (Type / Apparence Boxer)<br/>
        Couleur de la robe / Signes particuliers : \${p.type}<br/>
        Numéro de puce électronique (I-CAD) : \${p.adoptant.puce || "..........................................................................."}
        </p>

        <h4 style="margin-top:20px;">3. CONDITIONS DE L'ADOPTION</h4>
        <p>- La cession de l'animal est effectuée ce jour à l'âge légal minimum de 8 semaines révolus.<br/>
        - L'adoption est consentie moyennant une participation forfaitaire aux frais réels d'élevage, de nourriture, de soins et d'identification s'élevant à : \${p.adoptant.montant || "................"} € (somme réglée ce jour).<br/>
        - L'Adoptant déclare avoir signé le Certificat d'Engagement et de Connaissance obligatoire en date du \${p.adoptant.dateCec || "............................"} (soit au minimum 7 jours avant ce jour).</p>

        <h4 style="margin-top:20px;">4. DOCUMENTS REMIS OBLIGATOIREMENT À L'ADOPTANT CE JOUR</h4>
        <p>[ ] Le document provisoire ou définitif d'identification I-CAD.<br/>
        [ ] Le certificat vétérinaire obligatoire de bonne santé établi le ............................ (moins de 3 mois).<br/>
        [ ] Le carnet de santé/passeport de l'animal mentionnant les premières vaccinations et vermifuges.<br/>
        [ ] Une fiche d'information conseil sur les besoins et l'alimentation de l'animal.</p>

        <h4 style="margin-top:20px;">5. ENGAGEMENTS DE L'ADOPTANT</h4>
        <p>L’Adoptant s’engage à détenir l’animal dans des conditions compatibles avec les besoins biologiques et comportementaux de son espèce, à lui donner des soins attentifs, à le traiter avec bienveillance et à procéder dans les plus brefs délais au changement de propriétaire officiel auprès des services de l'I-CAD.</p>

        <p style="margin-top:40px;">Fait à Berd'huis (61), le \${p.adoptant.dateDepart || "..................................................."} (Date du jour du départ)</p>

        <div style="display:flex; justify-content:space-between; margin-top:40px;">
          <div><strong>Signature du Cédant (Anouck Mauger) :</strong></div>
          <div><strong>Signature de l'Adoptant :</strong></div>
        </div>
      </div>
    \`;
  }
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(\`
    <html>
      <head>
        <title>\${docTitle}</title>
      </head>
      <body onload="window.print(); window.onafterprint = function(){ window.close(); }">
        \${docHtml}
      </body>
    </html>
  \`);
  printWindow.document.close();
}
