// Import the functions you need from the SDKs you need
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { serverTimestamp as dbServerTimestamp, get, getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzt_7wGwrB_mpkR6A7nLGgMo7rcae6zOI",
  authDomain: "adbmg-a0618.firebaseapp.com",
  projectId: "adbmg-a0618",
  databaseURL: "https://adbmg-a0618-default-rtdb.firebaseio.com/", // Adicionar databaseURL para Realtime Database
  storageBucket: "adbmg-a0618.firebasestorage.app",
  messagingSenderId: "966966845858",
  appId: "1:966966845858:web:c320d349ed5e27949c92fb",
  measurementId: "G-H9VN98KLCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app); // Inicializa Realtime Database

// Função para alternar a exibição do campo Data de Batismo
function toggleDataBatismo() {
    const batizado = document.getElementById('batizado').value;
    const dataBatismo = document.getElementById('dataBatismo');
    if (batizado === 'sim') {
        dataBatismo.style.display = 'block';
        dataBatismo.required = true;
    } else {
        dataBatismo.style.display = 'none';
        dataBatismo.required = false;
        dataBatismo.value = '';
    }
}

// DOM carregado
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  // Verifica autenticação
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const userRef = ref(db, "usuarios/" + user.uid); // Referência ao Realtime Database
    const userSnap = await get(userRef); // Obter dados do Realtime Database

    if (userSnap.exists()) {
      const data = userSnap.val(); // Usar .val() para Realtime Database
      document.getElementById("nomeCompleto").value = data.nomeCompleto || "";
      document.getElementById("cpf").value = data.cpf || "";
      document.getElementById("rg").value = data.rg || "";
      document.getElementById("nascimento").value = data.nascimento || "";
      document.getElementById("nomePai").value = data.nomePai || "";
      document.getElementById("nomeMae").value = data.nomeMae || "";
      document.getElementById("funcao").value = data.funcao || "";
      document.getElementById("congregacao").value = data.congregacao || "";
      document.getElementById("cidade").value = data.cidade || ""; // Adiciona leitura da cidade
      if (data.batizado !== undefined) {
        document.getElementById("batizado").value = data.batizado ? "sim" : "nao";
        toggleDataBatismo();
        if (data.dataBatismo) {
          document.getElementById("dataBatismo").value = data.dataBatismo;
        }
      }
    } // FECHA if (userSnap.exists())
    // Envio do formulário
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const batizado = document.getElementById("batizado").value;
      const dataBatismo = batizado === "sim" ? document.getElementById("dataBatismo").value : null;

      const userData = {
        nomeCompleto: document.getElementById("nomeCompleto").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        rg: document.getElementById("rg").value.trim(),
        nascimento: document.getElementById("nascimento").value,
        nomePai: document.getElementById("nomePai").value.trim(),
        nomeMae: document.getElementById("nomeMae").value.trim(),
        funcao: document.getElementById("funcao").value,
        batizado: batizado === "sim",
        dataBatismo: dataBatismo,
        congregacao: document.getElementById("congregacao").value.trim(),
        cidade: document.getElementById("cidade").value.trim(), // Adiciona o campo cidade ao userData
        email: user.email,
        updatedAt: dbServerTimestamp()
      };

      if (!userSnap.exists()) {
        userData.createdAt = dbServerTimestamp();
      }

      try {
        await set(userRef, userData); // Usar set para Realtime Database
        alert("Perfil salvo com sucesso!");
        localStorage.setItem('profileSaved', 'true');
        localStorage.setItem('profileSavedTimestamp', Date.now().toString());
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar perfil. Verifique as permissões ou tente novamente.");
      }
    });
  });
}); // Fecha document.addEventListener("DOMContentLoaded")