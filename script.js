const replies = [
  "Claro. Puedo ayudarte a convertir esa idea en un plan sencillo y usable.",
  "Buena pregunta. Empieza por el objetivo, despues define el publico y luego el formato.",
  "Tengo una chispa para eso: divide el problema en pasos pequenos y prueba el primero hoy.",
  "Para mejorar el resultado, dame mas contexto: tema, tono y para quien va dirigido.",
  "Puedo ayudarte con textos, ideas, resumenes, codigo y conceptos visuales."
];

const authTabs = document.querySelectorAll("[data-auth-tab]");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const sessionBox = document.querySelector("#sessionBox");
const sessionName = document.querySelector("#sessionName");
const sessionEmail = document.querySelector("#sessionEmail");
const logoutBtn = document.querySelector("#logoutBtn");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatWindow = document.querySelector("#chatWindow");
const imageForm = document.querySelector("#imageForm");
const imagePrompt = document.querySelector("#imagePrompt");
const generatedImage = document.querySelector("#generatedImage");

const usersKey = "chispasia_users";
const sessionKey = "chispasia_session";

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem(sessionKey, JSON.stringify(user));
  renderSession();
}

function renderSession() {
  const session = JSON.parse(localStorage.getItem(sessionKey) || "null");

  if (!session) {
    sessionBox.hidden = true;
    return;
  }

  sessionName.textContent = session.name;
  sessionEmail.textContent = session.email;
  sessionBox.hidden = false;
}

function showAuthTab(tab) {
  authTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authTab === tab);
  });

  loginForm.classList.toggle("is-active", tab === "login");
  signupForm.classList.toggle("is-active", tab === "signup");
}

function addMessage(kind, text) {
  const message = document.createElement("article");
  message.className = `message ${kind}`;
  message.innerHTML = `<strong>${kind === "bot" ? "ChispasIA" : "Tu"}</strong><p></p>`;
  message.querySelector("p").textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function buildReply(input) {
  const normalized = input.toLowerCase();

  if (normalized.includes("imagen")) {
    return "Ve a Crear imagenes, escribe lo que quieres ver y te preparo un concepto visual.";
  }

  if (normalized.includes("github")) {
    return "Para GitHub Pages sube estos archivos al repositorio y activa Pages desde Settings.";
  }

  return replies[Math.floor(Math.random() * replies.length)];
}

function paletteFromText(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 9999;

  const palettes = [
    ["#3858e9", "#00a99d"],
    ["#ef476f", "#ffb000"],
    ["#151825", "#3858e9"],
    ["#00a99d", "#ffb000"],
    ["#5b2be0", "#ef476f"]
  ];

  return palettes[hash % palettes.length];
}

authTabs.forEach((button) => {
  button.addEventListener("click", () => showAuthTab(button.dataset.authTab));
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#signupName").value.trim();
  const email = document.querySelector("#signupEmail").value.trim().toLowerCase();
  const password = document.querySelector("#signupPassword").value;

  if (password.length < 6) {
    alert("La contrasena debe tener al menos 6 caracteres.");
    return;
  }

  const users = getUsers();
  if (users.some((user) => user.email === email)) {
    alert("Ese email ya esta registrado.");
    return;
  }

  const user = { name, email, password };
  saveUsers([...users, user]);
  setSession({ name, email });
  signupForm.reset();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  const user = getUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    alert("Email o contrasena incorrectos.");
    return;
  }

  setSession({ name: user.name, email: user.email });
  loginForm.reset();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(sessionKey);
  renderSession();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  chatInput.value = "";

  window.setTimeout(() => {
    addMessage("bot", buildReply(text));
  }, 450);
});

imageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = imagePrompt.value.trim();
  if (!prompt) return;

  const [a, b] = paletteFromText(prompt);
  generatedImage.classList.add("has-art");
  generatedImage.innerHTML = `
    <div class="generated-art" style="--art-a: ${a}; --art-b: ${b}">
      <strong>${prompt}</strong>
    </div>
    <p>Concepto visual generado desde tu descripcion.</p>
  `;
});

renderSession();
