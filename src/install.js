// install button
let installPrompt = null;
const installButton1 = document.getElementById("installBtn1");
const installButton2 = document.getElementById("installBtn2");

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton1.removeAttribute("hidden");
    installButton2.removeAttribute("hidden");
  });

  installButton1.addEventListener("click", install);
  installButton2.addEventListener("click", install);
});

async function install() {
  if (!installPrompt) {
    return;
  }
  await installPrompt.prompt();
  disableInAppInstallPrompt();
}

window.addEventListener("appinstalled", () => {
  disableInAppInstallPrompt();
});

function disableInAppInstallPrompt() {
  installPrompt = null;
  installButton1.setAttribute("hidden", "");
  installButton2.setAttribute("hidden", "");
  addServiceWorker()
}
