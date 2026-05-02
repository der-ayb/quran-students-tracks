import "./style.css";
import "./fonts.css";
import "./yearpicker.css";
import "./yearpicker.js";
import "./pdfmake.js";
import "./vfs_fonts.js";

import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/ar-dz";
import "./flatpickr-hijri-calendar.js";
import { DateTime } from "luxon";
import "flatpickr/dist/flatpickr.css";
import "flatpickr-hijri-calendar/dist/flatpickr-hijri-calendar.css";
import { registerSW } from "virtual:pwa-register";

// --- Initialize the application (async) ---
window._toastQueue = window._toastQueue || [];
window._toastReady = false;
initializeToast();
const nav_bar = document.querySelector(".nav-bar");
if (localStorage.getItem("newUser") == true) {
  showTab("pills-splash");
} else {
  init();
}
function fromNow(date) {
  if (!date) return "غير معروف";

  const dt = DateTime.fromJSDate(new Date(date)).setLocale("ar");
  const now = DateTime.now().setLocale("ar");
  const diffHours = Math.abs(now.diff(dt, "hours").hours);

  if (diffHours < 48) {
    // Use luxon's relative time for short durations
    return dt.toRelative({ locale: "ar" });
  } else {
    // For longer durations, show relative time with days
    return dt.toRelative({ locale: "ar", unit: "days" });
  }
}
// Luxon locale is set to ar-DZ when creating DateTime instances
const devMode =
  window.location.hostname == "localhost" ||
  window.location.hostname.includes("ngrok-free");
let project_db, quran_db, SQL;
let db;
let currentUser;
let userIsAuth = false;
const quranData = {
  surahs: [],
  pages: [],
  ahzab: [],
  SURAH_NAME_MAP: new Map(),
};
let specialDates = [];
const DB_STORE_NAME = "my_sqlite-db";
const PROJECT_DB_KEY = "quranstudentsDB";
const QURAN_DB_KEY = "quranDB";
const evaluationLaddersValues = {
  retard: { initialPresenceMark: 30, retardPointsPerMinute: 0.4 },
  behavior: { ممتاز: 5, جيد: 4, متوسط: 3, سيء: -5, "سيئ جدا": -10 },
  clothing: { ممتاز: 5, جيد: 3, حسن: 2, "غير مقبول": -5 },
  haircut: { جيد: 5, متوسط: 2, "غير مقبول": -5 },
  requirments: { requirReducePerRepit: 10, requirReducePerAlert: 2 },
};
let workingClassroomId = localStorage.getItem("workingClassroomId");
let studentsTableDetailIsShow = false;
let studentsDayTableDetailIsShow = false;
let classroomsTableDetailIsShow = false;
let workingDay = new Date().toISOString().slice(0, 10);
let workingDayID = null;
let currentTabId = "pills-home";
let loadingModalShowNumber = [];
let isGirls = null;
const currentTime = { hours: 0, minutes: 0 };
let teachersPoints = {};

const loginStatus = document.getElementById("loginStatus");
const googleSigninBtn = document.getElementById("googleSigninBtn");

const tabTitleLabel = document.getElementById("tabTitleLabel");
const workingClassroomSelect = document.getElementById("workingClassroom");
const dayDateInput = document.getElementById("dayDate");
const dayNoteContainer = document.getElementById("dayNoteContainer");
const statisticsDateInput = document.getElementById("statisticsrange");
const addQuranSelectionBtn = document.getElementById("addQuranSelectionBtn");
const retardInput = document.getElementById("retard");

const requirementsTable = document.getElementById("requirementsTable");
const secondAyahSelect = document.getElementById("second-ayah");
const firstAyahSelect = document.getElementById("first-ayah");
const secondSurahSelect = document.getElementById("second-surah");
const firstSurahSelect = document.getElementById("first-surah");
const requirEvaluationInput = document.getElementById("requirEvaluation");
const requireBookInput = document.getElementById("requirBook");
const saveStateErrorsInput = document.getElementById("saveStateErrors");
const saveStateAlertsInput = document.getElementById("saveStateAlerts");
const requirMoyenneInput = document.getElementById("requirMoyenne");
const requirRepitInput = document.getElementById("requirRepit");
const requirTeacherInput = document.getElementById("requirTeacher");

const studentNameInput = document.getElementById("studentName");
const clothingInput = document.getElementById("clothing");
const haircutInput = document.getElementById("haircut");
const behaviorInput = document.getElementById("behavior");
const prayerInput = document.getElementById("prayer");
const addedPointsInput = document.getElementById("addedPoints");
const evalMoyenne = document.getElementById("evalMoyenne");

const requirsMoyenneInput = document.getElementById("requirsMoyenne");
const historyRequirBtn = document.getElementById("historyRequirBtn");
const requirQuantityDetailInput = document.getElementById(
  "requirQuantityDetail",
);
const requirQuantityInput = document.getElementById("requirQuantity");
const requirTypeInput = document.getElementById("requirType");

const classroomIdInput = document.getElementById("classroomId");
const mosqueInput = document.getElementById("mosque");
const placeInput = document.getElementById("place");
const sexInput = document.getElementById("sex");
const levelInput = document.getElementById("level");

const studentIdInput = document.getElementById("studentId");
const firstNameInput = document.getElementById("fname");
const lastNameInput = document.getElementById("lname");
const birthyearInput = document.getElementById("birthyear");
const parentPhoneInput = document.getElementById("parentPhone");

const newStudentInfosForm = document.getElementById("newStudentInfosForm");
const newClassroomInfosForm = document.getElementById("newClassroomInfosForm");
const studentDayForm = document.getElementById("studentDayForm");
const studentDayFormSubmitBtn = document.getElementById(
  "studentDayFormSubmitBtn",
);

const newStudentDayModalBody = document.getElementById(
  "newStudentDayModalBody",
);

let statisAllCheckbox = document.getElementById("statisAllCheckbox");
const statisticType = document.getElementById("statisticType");

const studentDayInfos = { start_time: null, isObligatory: false, dayNote: "" };
const themeSelector = document.getElementById("themeSelector");
const themeTag = document.getElementById("themeStylesheet");
const fontSelector = document.getElementById("fontSelect");
const outTimeInput = document.getElementById("outTimeInput");
const resumePagesCheck = document.getElementById("resumePagesCheck");
const signatureCheck = document.getElementById("signatureCheck");

const loadingModalText = document.getElementById("loadingText");
const loadingModalElement = document.getElementById("loadingModal");
const loadingModal = new bootstrap.Modal(loadingModalElement);

const studentDayModalElement = document.getElementById("newStudentDayModal");
const studentDayModal = new bootstrap.Modal(studentDayModalElement);

const maximizeModalBtn = document.getElementById("maximizeModalBtn");
const studentInfosModal = new bootstrap.Modal("#newStudentInfosModal");
const classroomInfosModal = new bootstrap.Modal("#newClassroomInfosModal");

const requirCollapse = new bootstrap.Collapse(
  document.getElementById("requirCollapse"),
);

const evaluationCollapse = new bootstrap.Collapse(
  document.getElementById("evaluationCollapse"),
);

function hideMaximizeModalBtn() {
  studentDayModalElement.style.display = "block";
  document.querySelector(".modal-backdrop")?.classList.remove("no-backdrop");
  maximizeModalBtn.style.display = "none";
}

maximizeModalBtn.onclick = hideMaximizeModalBtn;

function openAuthDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("auth-db", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("auth");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putToken(db, token) {
  const tx = db.transaction("auth", "readwrite");
  const store = tx.objectStore("auth");
  store.put(token, "idToken");
  await tx.done;
}

async function deleteToken(db) {
  const tx = db.transaction("auth", "readwrite");
  const store = tx.objectStore("auth");
  store.delete("idToken");
  await tx.done;
}

async function getToken(db) {
  return new Promise((resolve) => {
    const tx = db.transaction("auth", "readonly");
    const store = tx.objectStore("auth");
    const request = store.get("idToken");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function putAccessToken(db, token) {
  const tx = db.transaction("auth", "readwrite");
  const store = tx.objectStore("auth");
  store.put(token, "accessToken");
  await tx.done;
}

async function deleteAccessToken(db) {
  const tx = db.transaction("auth", "readwrite");
  const store = tx.objectStore("auth");
  store.delete("accessToken");
  await tx.done;
}

async function getAccessToken(db) {
  return new Promise((resolve) => {
    const tx = db.transaction("auth", "readonly");
    const store = tx.objectStore("auth");
    const request = store.get("accessToken");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

function codeJwt(payload) {
  const header = {
    alg: "none",
    typ: "JWT",
  };

  const headerStr = JSON.stringify(header);
  const payloadStr = JSON.stringify(payload);

  const encodedHeader = btoa(unescape(encodeURIComponent(headerStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const encodedPayload = btoa(unescape(encodeURIComponent(payloadStr)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.`;
}

// async function handleCredentialResponse(response) {
//   const idToken = response.credential;
//   user = decodeJwt(idToken);
//   userIsAuth = true;

//   await openAuthDB().then(async (res) => {
//     db = res;
//     await putToken(db, idToken);
//   });

//   loginStatus.textContent = `تم تسجيل الدخول لـ${user.name}`;

//   // Request access token for Google Drive
//   const client = google.accounts.oauth2.initTokenClient({
//     client_id:
//       "233292477998-p0cdmaicj108fcp76fk5tpisb6qdmmgc.apps.googleusercontent.com",
//     scope: "https://www.googleapis.com/auth/drive.file",
//     callback: async (tokenResponse) => {
//       if (tokenResponse && tokenResponse.access_token) {
//         await putAccessToken(db, tokenResponse.access_token);
//       }
//     },
//   });
//   client.requestAccessToken();
// }

function loginStatusElement(updateTime) {
  if (!currentUser) {
    const googleSigninBtn2 = googleSigninBtn.cloneNode(true);
    googleSigninBtn2.id = "googleSigninBtn2";
    loginStatus.innerHTML = `
            <div>
              ${googleSigninBtn2.outerHTML}
              <p class="card-text">${
                updateTime
                  ? `آخر تحديث من هذا الجهاز:${updateTime}`
                  : "لم تتم المزامنة بعد"
              }</p>
            </div>
          `;
    document
      .getElementById("googleSigninBtn2")
      .addEventListener("click", googleSignin);
    return;
  }

  loginStatus.innerHTML = `
          <div class="card mx-auto" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${currentUser.name || "غير معروف"}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">${
                currentUser.email || "غير معروف"
              }</h6>
              <p class="card-text">${
                updateTime ? `آخر تحديث:${updateTime}` : "لم تتم المزامنة بعد"
              }</p>
              <button id="asyncDBBtn" class="btn btn-sm btn-secondary">🔄 مزامنة</button>
              <button id="logoutBtn" class="btn btn-sm btn-warning">تسجيل الخروج</button>
            </div>
          </div>
        `;
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("asyncDBBtn").addEventListener("click", asyncDB);
}
async function initAuth() {
  await openAuthDB().then(async (res) => {
    db = res;
    const idToken = await getToken(db);
    if (idToken) {
      currentUser = decodeJwt(idToken);
      userIsAuth = true;
      if (navigator.onLine) {
        searchFileInDrive();
      } else {
        loginStatusElement(fromNow(localStorage.getItem("lastUpdateTime")));
      }
    } else {
      loginStatusElement(fromNow(localStorage.getItem("lastUpdateTime")));
    }
  });
}

openAuthDB().then(async (res) => {
  db = res;
});

async function logout() {
  google.accounts.id.disableAutoSelect();
  await deleteToken(db);
  await deleteAccessToken(db);
  currentUser = null;
  userIsAuth = false;
  loginStatusElement(fromNow(localStorage.getItem("lastUpdateTime")));
}

async function searchFileInDrive(accessToken = null) {
  if (loadingModalShowNumber.length)
    await showLoadingModal("جاري البحث عن قاعدة بيانات سابقة");
  if (!accessToken) accessToken = await getAccessToken(db);
  // Search for the file named 'quran_students.sqlite3'
  const query = encodeURIComponent(
    "name='quran_students.sqlite3' and trashed=false",
  );
  const listResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,modifiedTime)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  hideLoadingModal();

  if (!listResponse.ok) {
    await logout();
  }

  const listResult = await listResponse.json();
  if (!listResult.files || listResult.files.length === 0) {
    loginStatusElement(null);
    return [];
  }
  const file = listResult.files[0];
  const date = fromNow(new Date(file.modifiedTime));
  loginStatusElement(date);
  return [file, date];
}

// Reusable OAuth function
async function initializeGoogleAuth(callback) {
  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id:
        "233292477998-p0cdmaicj108fcp76fk5tpisb6qdmmgc.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            await putAccessToken(db, tokenResponse.access_token);
            const userInfoResponse = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              },
            );

            currentUser = await userInfoResponse.json();
            await openAuthDB().then(async (res) => {
              db = res;
              await putToken(db, codeJwt(currentUser));
            });
            userIsAuth = true;

            // Execute the provided callback with the token
            if (callback) {
              await callback(tokenResponse.access_token);
            }

            resolve(tokenResponse.access_token);
          } catch (error) {
            console.error("Auth initialization failed:", error);
            reject(error);
          }
        } else {
          reject(new Error("No access token received"));
        }
      },
      error_callback: async (type) => {
        hideLoadingModal();
        if (type.type == "popup_failed_to_open") {
          window.showToast("warning", "لاتوجد صلاحية للنوافذ المنبثقة");
        } else if (type.type == "unknown") {
          window.showToast("warning", "حدث خطأ.");
        }
      },
    });

    client.requestAccessToken();
  });
}

// Updated upload function
async function uploadDBtoDrive(data) {
  if (!userIsAuth) {
    throw new Error("عليك تسجيل الدخول أولا.");
  }

  const accessToken = await getAccessToken(db);

  if (!accessToken) {
    throw new Error("خطأ في المصادقة، يرجى إعادة تسجيل الدخول.");
  }
  let fileId = null;
  // Check if a file named 'quran_students.sqlite3' already exists.
  const [file, updateTime] = await searchFileInDrive(accessToken);
  if (file) {
    if (
      !confirm(`سيتم استبدال قاعدة البيانات التي في حسابك ⬆️, هل أنت موافق؟`)
    ) {
      return false;
    }
    fileId = file.id;
  }

  const metadata = {
    name: "quran_students.sqlite3",
    mimeType: "application/octet-stream",
  };

  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  formData.append(
    "file",
    new Blob([data], { type: "application/octet-stream" }),
  );

  let uploadUrl;
  let method;

  if (fileId) {
    // File exists, so update it.
    uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
    method = "PATCH";
  } else {
    // File doesn't exist, so create it.
    uploadUrl =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
    method = "POST";
  }

  const response = await fetch(uploadUrl, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("إنتهت صلاحية تسجيل الدخول، يرجى إعادة ذلك .");
    }
    throw new Error(`خطأ أثناء التحميل: ${response.statusText}`);
  }

  const result = await response.json();
  loginStatusElement(fromNow(new Date()));
  localStorage.setItem("lastUpdateTime", new Date());
  if (fileId) {
    console.log("📤 DB updated on Google Drive:", result.id);
  } else {
    console.log("📤 DB uploaded to Google Drive:", result.id);
  }
  return true;
}

// Updated download function
async function downloadDBfromDrive() {
  if (!userIsAuth) throw new Error("عليك تسجيل الدخول أولا.");

  const accessToken = await getAccessToken(db);

  if (!accessToken) {
    throw new Error("خطأ في المصادقة، يرجى إعادة تسجيل الدخول.");
  }

  const [file, updateTime] = await searchFileInDrive(accessToken);
  if (!file) {
    return null;
  }
  const fileId = file.id;

  if (
    !confirm(
      `تم العثور على قاعدة بيانات في حسابك ${updateTime}، هل تريد تنزيلها⬇️؟`,
    )
  ) {
    return false;
  }

  // Download the file content
  const downloadResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!downloadResponse.ok) {
    if (downloadResponse.status === 401) {
      throw new Error("إنتهت صلاحية تسجيل الدخول، يرجى إعادة ذلك .");
    }
    throw new Error(`Download failed: ${downloadResponse.statusText}`);
  }
  console.log("📥 DB downloaded from Google Drive for", currentUser.sub);
  return downloadResponse;
}

async function minimizeModal() {
  studentDayModalElement.style.display = "none";
  document.querySelector(".modal-backdrop")?.classList.add("no-backdrop");
  maximizeModalBtn.style.removeProperty("display");
  document
    .querySelector(".container-fluid.modal-open")
    .style.removeProperty("overflow");
}

async function initPlusMinusButtons(numberField) {
  const minusBtn = numberField.previousElementSibling;
  const plusBtn = numberField.nextElementSibling;

  minusBtn.addEventListener("click", () => {
    let currentValue = parseInt(numberField.value);
    if (!isNaN(currentValue) && currentValue > parseInt(numberField.min)) {
      numberField.value = currentValue - parseInt(numberField.step);
      numberField.dispatchEvent(new Event("change"));
    }
  });

  plusBtn.addEventListener("click", () => {
    let currentValue = parseInt(numberField.value);
    if (!isNaN(currentValue) && currentValue < parseInt(numberField.max)) {
      numberField.value = currentValue + parseInt(numberField.step);
      numberField.dispatchEvent(new Event("change"));
    } else if (isNaN(currentValue)) {
      // Handle empty field case
      numberField.value = parseInt(numberField.min) || 0;
      numberField.dispatchEvent(new Event("change"));
    }
  });
}

// back button event listenner
function isAnyOverlayOpen() {
  return (
    document.querySelector(
      '.modal.show:not(#loadingModal), .offcanvas.show, [role="dialog"]:not([aria-hidden="true"])',
    ) !== null
  );
}

function closeAnyOverlay() {
  // Bootstrap modal
  const modal = document.querySelector(".modal.show:not(#loadingModal)");
  if (modal && window.bootstrap) {
    bootstrap.Modal.getInstance(modal)?.hide();
    return true;
  }

  // Bootstrap offcanvas
  const offcanvas = document.querySelector(".offcanvas.show");
  if (offcanvas && window.bootstrap) {
    bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
    return true;
  }

  // Generic fallback (click close button)
  const closeBtn = document.querySelector(
    '[data-bs-dismiss], [aria-label="Close"], .close, .btn-close',
  );
  if (closeBtn) {
    closeBtn.click();
    return true;
  }

  return false;
}

let allowExit = false;
history.pushState({ pwa: true }, "");
window.addEventListener("popstate", () => {
  // 1️⃣ Close any open overlay
  if (isAnyOverlayOpen()) {
    closeAnyOverlay();
    history.pushState({ pwa: true }, "");
    return;
  }

  // 2️⃣ Ask exit confirmation
  if (!allowExit) {
    window.showToast("info", "اضغط مرة أخرى للخروج من التطبيق.", 1000, false);
    allowExit = true;
    history.back();
  } else {
    history.pushState({ pwa: true }, "");
  }
});

themeSelector.onchange = async function () {
  const theme = this.value;
  themeTag.href = `https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/${theme}/bootstrap.rtl.min.css`;
  localStorage.setItem("selectedTheme", theme);

  // Optimize theme-specific style injection/removal
  const styleId = "darkThemeStyle";
  let styleNode = document.getElementById(styleId);

  if (
    themeSelector.options[themeSelector.selectedIndex].text.includes("(dark)")
  ) {
    if (!styleNode) {
      styleNode = document.createElement("style");
      styleNode.id = styleId;
      styleNode.textContent = `
        .btn, .form-select,.form-control, .input-group-text {
          padding-bottom: 5px !important;
          padding-top: 5px !important;
        }
      `;
      document.head.appendChild(styleNode);
    }
    document.getElementById("classroomsListTable").classList.add("table-dark");
    document.getElementById("studentsListTable").classList.add("table-dark");
    document.getElementById("dayListTable").classList.add("table-dark");
    document.getElementById("statisticsTable").classList.add("table-dark");
  } else {
    if (styleNode) styleNode.remove();
    document
      .getElementById("classroomsListTable")
      .classList.remove("table-dark");
    document.getElementById("studentsListTable").classList.remove("table-dark");
    document.getElementById("dayListTable").classList.remove("table-dark");
    document.getElementById("statisticsTable").classList.remove("table-dark");
  }
};

outTimeInput.onchange = async function () {
  const outTime = this.value;
  localStorage.setItem("selectedOutTime", outTime);
};

fontSelector.onchange = async function () {
  const font = this.value;
  document.body.style.fontFamily = font;
  localStorage.setItem("selectedFont", font);
};

// Initialize
document.addEventListener("DOMContentLoaded", async function () {
  // theme selector
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    themeSelector.value = savedTheme;
    themeSelector.dispatchEvent(new Event("change"));
  }

  const savedOutTime = localStorage.getItem("selectedOutTime");
  if (savedOutTime) {
    outTimeInput.value = savedOutTime;
  }

  // font change
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    fontSelector.value = savedFont;
    fontSelector.dispatchEvent(new Event("change"));
  }

  // set birthyear input limits
  const today = new Date();
  $("#birthyear").yearpicker({
    endYear: today.getFullYear() - 3,
    startYear: today.getFullYear() - 97,
  });

  // init Plus Minus buttons
  initPlusMinusButtons(saveStateErrorsInput);
  initPlusMinusButtons(saveStateAlertsInput);
  initPlusMinusButtons(addedPointsInput);
  initPlusMinusButtons(prayerInput);
  initPlusMinusButtons(requirMoyenneInput);
  initPlusMinusButtons(requirRepitInput);
  // parse evaluation ladder selects
  populateEvalSelects();
});

// --- IndexedDB Promisified ---
function openDatabaseAsync() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROJECT_DB_KEY, 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        db.createObjectStore(DB_STORE_NAME);
      }
    };
    request.onsuccess = function () {
      resolve(request.result);
    };
    request.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

async function saveToIndexedDB(data, db_key = PROJECT_DB_KEY) {
  const idb = await openDatabaseAsync();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(DB_STORE_NAME, "readwrite");
    const store = tx.objectStore(DB_STORE_NAME);
    store.put(data, db_key);
    tx.oncomplete = () => {
      idb.close();
      if (db_key == PROJECT_DB_KEY) {
        localStorage.setItem("lastSaveAt", new Date());
        localStorage.setItem("newSaveExists", true);
      }
      resolve();
    };
    tx.onerror = (e) => {
      idb.close();
      reject(e.target.error);
    };
  });
}

async function loadFromIndexedDB(callback) {
  const idb = await openDatabaseAsync();
  return new Promise((resolve) => {
    const tx = idb.transaction(DB_STORE_NAME, "readonly");
    const store = tx.objectStore(DB_STORE_NAME);
    const getProjectRequest = store.get(PROJECT_DB_KEY);
    const getQuranRequest = store.get(QURAN_DB_KEY);

    let projectResult, quranResult;
    let projectDone = false,
      quranDone = false;

    function maybeCallback() {
      if (projectDone && quranDone) {
        callback(projectResult, quranResult);
        resolve();
        idb.close();
      }
    }

    getProjectRequest.onsuccess = () => {
      projectResult = getProjectRequest.result || null;
      projectDone = true;
      maybeCallback();
    };
    getQuranRequest.onsuccess = () => {
      quranResult = getQuranRequest.result || null;
      quranDone = true;
      maybeCallback();
    };

    getProjectRequest.onerror = () => {
      projectResult = null;
      projectDone = true;
      maybeCallback();
    };
    getQuranRequest.onerror = () => {
      quranResult = null;
      quranDone = true;
      maybeCallback();
    };
  });
}

// --- File Reading Async ---
async function loadDBFromFile(file, downloaded = false) {
  const arrayBuffer = await file.arrayBuffer();
  try {
    project_db = new SQL.Database(new Uint8Array(arrayBuffer));
    await saveToIndexedDB(project_db.export());
    if (downloaded) localStorage.removeItem("newSaveExists");
    window.showToast("success", "تم تحميل قاعدة البيانات.");
    setTimeout(() => window.location.reload(), 1000);
  } catch (e) {
    hideLoadingModal();
    console.error("Error loading DB from file:", e);
    throw e;
  }
}

// --- Fetch and Read File Async ---
async function fetchAndPutIntoIndexedDBFile(
  db_key,
  url,
  onSuccessCallback = function () {},
) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch file from:" + url);
    const blob = await response.blob();
    const uInt8Array = new Uint8Array(await blob.arrayBuffer());
    const db = new SQL.Database(uInt8Array);
    await saveToIndexedDB(db.export(), db_key);
    onSuccessCallback(db);
    return true;
  } catch (error) {
    console.error("Error reading file:" + error);
    return false;
  }
}

// --- Export DB Async ---
async function exportDB() {
  const data = project_db.export();
  download(data, "quran_students.sqlite3", "application/x-sqlite3");
}

async function addServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      swal({
        title: "تم التماس تحديث جديد",
        text: "هل تريد تحديث التطبيق ؟",
        icon: "info",
        buttons: ["لا", "نعم"],
      }).then((willReload) => {
        if (willReload) {
          updateSW(true); // This triggers the SW to skip waiting and reload the page
        }
      });
    },
    onRegistered(r) {
      document.getElementById("checkForUpdatesBtn").onclick =
        async function () {
          if (!navigator.onLine) {
            showToast("warning", "لا يوجد اتصال بالإنترنت.");
            return;
          }
          await showLoadingModal("جاري التحقق من التحديثات");
          r.update();
          hideLoadingModal();
        };
    },
  });
}

// --- Initialization Async ---
async function init() {
  SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`,
  });

  await loadFromIndexedDB(async (savedProjectData, savedQuranData) => {
    if (savedProjectData) {
      project_db = new SQL.Database(new Uint8Array(savedProjectData));
      if (savedQuranData) {
        quran_db = new SQL.Database(new Uint8Array(savedQuranData));
      } else {
        if (!(await downloadQuranDB())) {
          window.showToast(
            "error",
            "فشل في إنشاء قاعدة بيانات جديدة، تأكد من الاتصال بالإنترنت.",
          );
          return;
        }
      }
      localStorage.setItem("newUser", false);
      await initializeAyatdata(quran_db);
      initEvaluationLaddersValues(project_db);
      await InitDatePickers();
      showTab("pills-home");
      nav_bar.style.removeProperty("display");
      addServiceWorker();
      // display synchronization badge
      if (localStorage.getItem("newSaveExists"))
        document.querySelectorAll(".syncBadge").forEach((syncBadge) => {
          syncBadge.style.removeProperty("display");
        });
    } else {
      showTab("pills-splash");
    }
  });
}

// --- Download Quran DB Async ---
async function downloadQuranDB() {
  return await fetchAndPutIntoIndexedDBFile(
    QURAN_DB_KEY,
    "/quran.sqlite",
    async (db) => {
      quran_db = db;
      await initializeAyatdata(db);
      await InitDatePickers();
    },
  );
}

// --- Async Utility for DataTable Reload ---
async function initOrReloadDataTable(
  selector,
  tableData,
  tableColumns,
  options = {},
  TableDetailIsShow = false,
  shoulDestroy = false,
  getTable = false,
) {
  if ($.fn.DataTable.isDataTable(selector)) {
    if (shoulDestroy) {
      $(selector).DataTable().destroy();
      $(selector).empty();
    } else {
      return $(selector).DataTable().clear().rows.add(tableData).draw();
    }
  }
  let table;
  if (typeof tableColumns[0] === "object") {
    table = new DataTable(selector, {
      data: tableData,
      columns: tableColumns,
      ...options,
    });
  } else {
    function isHijriDate(text) {
      const hijriRegex =
        /(?:الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)[\s\u200F]*(\d{1,2})[\s\u200F]+(محرم|صفر|ربيع الأول|ربيع الآخر|جمادى الأولى|جمادى الآخرة|رجب|شعبان|رمضان|شوال|ذو القعدة|ذو الحجة)[\s\u200F]+(\d{4})[\s\u200F]*هـ/;

      return hijriRegex.test(text);
    }
    function parseHijri(text) {
      const hijriRegex =
        /(?:الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)[\s\u200F]*(\d{1,2})[\s\u200F]+(محرم|صفر|ربيع الأول|ربيع الآخر|جمادى الأولى|جمادى الآخرة|رجب|شعبان|رمضان|شوال|ذو القعدة|ذو الحجة)[\s\u200F]+(\d{4})[\s\u200F]*هـ/;
      const match = text.match(hijriRegex);
      if (!match) return null;

      return {
        day: match[0].split(" ")[0] + " " + match[1],
        month: match[2],
        year: match[3],
      };
    }

    function buildMonthGroups(headers) {
      const groups = [];
      let current = null;

      headers.forEach((h) => {
        if (isHijriDate(h)) {
          const { year, month } = parseHijri(h);
          const key = `${year}-${month}`;

          if (!current || current.key !== key) {
            current = {
              key,
              year,
              month,
              count: 1,
            };
            groups.push(current);
          } else {
            current.count++;
          }
        } else {
          current = null;
        }
      });

      return groups;
    }

    function buildThead(headers) {
      const thead = document.createElement("thead");
      const trMonths = document.createElement("tr");
      const trDays = document.createElement("tr");

      const monthGroups = buildMonthGroups(headers);
      let monthIndex = 0;

      headers.forEach((h) => {
        const isDate = isHijriDate(h);

        // ───── MONTH ROW ─────
        if (!isDate) {
          const th = document.createElement("th");
          th.className = `text-center ${[0, 1].includes(headers.indexOf(h)) ? "" : "header-rotated"}`;
          th.rowSpan = 2;
          th.textContent = h;
          trMonths.appendChild(th);
        } else {
          const g = monthGroups[monthIndex];
          if (g) {
            const th = document.createElement("th");
            th.className = `text-center no-sort`;
            th.colSpan = g.count;

            const monthName = g.month;
            th.textContent = `${monthName} ${g.year} هـ`;

            trMonths.appendChild(th);
            monthIndex++;
          }
        }

        // ───── DAY ROW ─────
        if (isDate) {
          const { day } = parseHijri(h);
          const th = document.createElement("th");
          th.textContent = day;
          trDays.appendChild(th);
        }
      });

      thead.appendChild(trMonths);
      thead.appendChild(trDays);
      return thead;
    }

    function buildTbody(data, headers) {
      const tbody = document.createElement("tbody");

      data.forEach((row) => {
        const tr = document.createElement("tr");

        headers.forEach((h) => {
          const td = document.createElement("td");
          td.className = "text-center";
          td.textContent = row[h] ?? "";
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      return tbody;
    }

    const tableEl = document.getElementById("statisticsTable");
    tableEl.innerHTML = "";
    tableEl.appendChild(buildThead(tableColumns));
    tableEl.appendChild(buildTbody(tableData, tableColumns));
    table = new DataTable(tableEl, {
      ...options,
    });
  }

  if (TableDetailIsShow) table.buttons(0).trigger();
  if (getTable) return table;
}

// show loading modal
function setLoadingModalText(text) {
  if (text) {
    loadingModalText.style.display = "block";
    loadingModalText.innerText = text + "...";
  } else {
    loadingModalText.style.display = "none";
  }
}

function showLoadingModal(text = null) {
  setLoadingModalText(text);
  loadingModalShowNumber.push(text);
  if (loadingModalShowNumber.length > 1) return;

  return new Promise((resolve) => {
    // Listen for when modal is fully shown
    const handleShown = () => {
      loadingModalElement.removeEventListener("shown.bs.modal", handleShown);
      resolve(loadingModal);
    };

    loadingModalElement.addEventListener("shown.bs.modal", handleShown);
    loadingModal.show();
  });
}

async function hideLoadingModal() {
  loadingModalShowNumber.pop();
  if (!loadingModalShowNumber.length) {
    loadingModal.hide();
  } else {
    setLoadingModalText(
      loadingModalShowNumber[loadingModalShowNumber.length - 1],
    );
  }
}

// --- Event Handlers Async ---
async function createNewDB() {
  if (
    project_db &&
    !confirm("سيتم استبدال قاعدة البيانات الحالية. هل أنت متأكد؟")
  ) {
    return;
  }
  await showLoadingModal("جاري إنشاء قاعدة بيانات جديدة");
  if (
    !(await fetchAndPutIntoIndexedDBFile(
      PROJECT_DB_KEY,
      "/default.sqlite3",
      (db) => {
        project_db = db;
      },
    )) ||
    !(await downloadQuranDB())
  ) {
    hideLoadingModal();
    window.showToast(
      "error",
      "فشل في إنشاء قاعدة بيانات جديدة، تأكد من الاتصال بالإنترنت.",
    );
    return;
  }
  window.showToast("success", "تم إنشاء قاعدة بيانات جديدة.");
  localStorage.removeItem("workingClassroomId");
  window.location.reload();
}

async function googleSignin() {
  if (!navigator.onLine) {
    window.showToast("warning", "لا يوجد اتصال بالإنترنت.");
    return;
  }
  await showLoadingModal("جاري تسجيل الدخول");
  await initializeGoogleAuth(async (accessToken) => {
    if (project_db && workingClassroomId) {
      await asyncDB();
    } else {
      try {
        const downloadResult = await downloadDBfromDrive();
        if (downloadResult == null) {
          if (confirm(`لاتوجد ملفات سابقة، هل تريد إنشاء قاعدة جديدة؟`)) {
            await createNewDB();
          }
        } else if (downloadResult == false) {
          ("pass");
        } else {
          await loadDBFromFile(downloadResult, true);
        }
      } catch (e) {
        console.log(e.message);
        window.showToast("error", e.message);
        hideLoadingModal();
      }
    }
  });
  hideLoadingModal();
}

document.getElementById("downloadDBbtn").onclick = exportDB;
document.getElementById("importDBbtn").onchange = async (e) => {
  if (e.target.files) {
    if (
      project_db &&
      !confirm("سيتم استبدال قاعدة البيانات الحالية. هل أنت متأكد؟")
    ) {
      e.target.value = "";
      return;
    }
    await showLoadingModal("جاري استيراد قاعدة البيانات");
    try {
      await loadDBFromFile(e.target.files[0]);
    } catch (e) {
      window.showToast(
        "error",
        "فشل في استرداد قاعدة البيانات. تأكد من صحة الملف.",
      );
    }
  }
};

async function asyncDB() {
  if (!navigator.onLine) {
    window.showToast("warning", "لا يوجد اتصال بالإنترنت.");
    return;
  }

  if (project_db) {
    await showLoadingModal("جاري المزامنة");
    try {
      if (await uploadDBtoDrive(project_db.export())) {
        window.showToast("success", "تمت المزامنة بنجاح.");
        localStorage.removeItem("newSaveExists");
        document.querySelectorAll(".syncBadge").forEach((syncBadge) => {
          syncBadge.style.display = "none";
        });
      }
    } catch (e) {
      console.log(e);
      window.showToast("error", e.message);
    }
    hideLoadingModal();
  }
}
// classrooms tab
workingClassroomSelect.onchange = async function () {
  workingClassroomId = this.value;
  localStorage.setItem("workingClassroomId", workingClassroomId);
  isGirls = this.options[this.selectedIndex].dataset.sex === "إناث";
  haircutInput.disabled = isGirls;
  reinitStatisticTable();
  getStudyDays();
  const radioBtn = document.getElementById(`classRadio-${workingClassroomId}`);
  if (radioBtn) radioBtn.checked = true;
};

async function getStudyDays() {
  if (typeof statisticsDateInput._flatpickr === "undefined") return;
  const result = project_db.exec(
    `SELECT date FROM education_day WHERE class_room_id = ${workingClassroomId};`,
  );
  specialDates =
    result.length && result[0].values.length
      ? result[0].values.map((row) => row[0])
      : [];
  statisticsDateInput._flatpickr.setDate(
    statisticsDateInput._flatpickr.selectedDates.length
      ? [
          statisticsDateInput._flatpickr.selectedDates[0],
          statisticsDateInput._flatpickr.selectedDates.at(-1),
        ]
      : [workingDay, workingDay],
    true,
  );
}

newClassroomInfosForm.onsubmit = (e) => {
  e.preventDefault();
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  const mosque = mosqueInput.value;
  const place = placeInput.value;
  const sex = sexInput.value;
  const level = levelInput.value;

  if (!mosque || !place || !sex || !level) {
    window.showToast("error", "الرجاء ملء جميع الحقول.");
    return;
  }
  try {
    if (classroomIdInput.value) {
      project_db.run(
        "UPDATE class_rooms SET mosque = ?, place = ?, sex = ? ,level = ? WHERE id = ?;",
        [mosque, place, sex, level, classroomIdInput.value],
      );
      window.showToast("success", "تم تعديل القسم بنجاح.");
    } else {
      project_db.run(
        "INSERT INTO class_rooms (mosque, place, sex, level) VALUES (?, ?, ?,?);",
        [mosque, place, sex, level],
      );
      newClassroomInfosForm.reset();
      window.showToast("success", `تم إضافة القسم بنجاح.`);
    }
    saveToIndexedDB(project_db.export());
    classroomInfosModal.hide();
    loadClassRoomsList();
  } catch (e) {
    window.showToast("error", "Error: " + e.message);
  }
};

async function loadClassRoomsList() {
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  try {
    workingClassroomSelect.options.length = 0;
    const results = project_db.exec("SELECT * FROM class_rooms;");
    const data = [];
    if (results.length) {
      const result = results[0];
      // Cache commonly used references
      const columns = result.columns;
      const columnIndexes = {
        id: columns.indexOf("id"),
        mosque: columns.indexOf("mosque"),
        place: columns.indexOf("place"),
        sex: columns.indexOf("sex"),
        level: columns.indexOf("level"),
      };

      result.values.forEach((row) => {
        // Create button group once
        const button_group = document.createElement("div");
        button_group.className = "btn-group btn-group-sm";
        button_group.setAttribute("role", "group");
        button_group.setAttribute("aria-label", "Basic example");

        // Extract values once
        const classroomId = row[columnIndexes.id];
        const mosque = row[columnIndexes.mosque];
        const place = row[columnIndexes.place];
        const sex = row[columnIndexes.sex];
        const level = row[columnIndexes.level];

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-info btn-sm";
        editBtn.innerHTML = "تعديل";
        editBtn.onclick = () => {
          classroomInfosModal.show();
          classroomIdInput.value = classroomId;
          mosqueInput.value = mosque;
          placeInput.value = place;
          sexInput.value = sex;
          levelInput.value = level;
        };
        button_group.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.innerHTML = "حذف";
        CreateOnClickUndo(deleteBtn, () => {
          if (!confirm("هل أنت متأكد أنك تريد حذف هذا القسم؟") || !project_db) {
            return;
          }
          try {
            project_db.run("DELETE FROM class_rooms WHERE id = ?;", [
              classroomId,
            ]);
            saveToIndexedDB(project_db.export());
            deleteTableRow("#classroomsListTable", "id", classroomId);
            window.showToast("success", `تم حذف القسم بنجاح.`);
          } catch (e) {
            window.showToast("warning", "Error: " + e.message);
          }
        });
        button_group.appendChild(deleteBtn);

        // Add data row
        data.push({
          id: classroomId,
          mosque,
          place,
          sex,
          level,
          actions: button_group,
        });

        // Add select option
        const displayText = [mosque, place, sex, level].join(" - ");
        const option = new Option(displayText, classroomId);
        Object.assign(option.dataset, { sex });
        workingClassroomSelect.add(option);
      });
      if (workingClassroomId) {
        workingClassroomSelect.value = workingClassroomId;
        isGirls =
          workingClassroomSelect.options[workingClassroomSelect.selectedIndex]
            .dataset.sex === "إناث";
        haircutInput.disabled = isGirls;
      } else {
        workingClassroomSelect.options[0].selected = true;
        workingClassroomSelect.dispatchEvent(new Event("change"));
      }
    }
    await initOrReloadDataTable(
      "#classroomsListTable",
      data,
      [
        { data: "id" },
        { data: "mosque" },
        { data: "place" },
        { data: "sex" },
        { data: "level" },
        { data: "actions", className: "py-1" },
      ],
      {
        select: {
          style: "multi",
          selector: "td:first-child",
          headerCheckbox: "select-page",
        },
        destroy: true,
        columnDefs: [
          { visible: false, targets: [0, 4, 5] },
          {
            targets: 5,
            orderable: false,
          },
        ],
        searching: false,
        scrollX: true,
        info: false,
        oLanguage: {
          sSearch: "بحث",
          emptyTable: "لا توجد بيانات في الجدول.",
        },
        paging: false,
        responsive: true,

        layout: {
          topStart: {
            buttons: [
              {
                text: '<i class="fa-solid fa-table-cells"></i>',
                action: async function (e, dt, button, config) {
                  const columns = dt.columns([0, 4, 5]);
                  const isVisible = dt.column(columns[0][0]).visible();

                  columns.visible(!isVisible);
                  classroomsTableDetailIsShow = !isVisible;
                  dt.button(0).text(
                    isVisible
                      ? '<i class="fa-solid fa-table-cells">'
                      : '<i class="fa-solid fa-table"></i>',
                  );
                },
              },
              {
                text: '<i class="fa-solid fa-thumbtack"></i>',
                action: async function (e, dt) {
                  const selectedRows = dt
                    .rows({ selected: true })
                    .data()
                    .toArray();
                  if (selectedRows.length === 0) {
                    window.showToast("info", "الرجاء اختيار أقسام أولاً.");
                    return;
                  }

                  if (tabTitleLabel.nextElementSibling)
                    tabTitleLabel.nextElementSibling.remove();

                  let element = `
                      <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                      `;
                  selectedRows.forEach((row) => {
                    element += `
                        <input type="radio" class="btn-check" name="btnradio" id="classRadio-${row.id}" autocomplete="off" onchange="workingClassroomSelect.value = '${row.id}';workingClassroomSelect.dispatchEvent(new Event('change'));showTab();" ${workingClassroomId == row.id ? "checked" : ""}>
                        <label class="btn btn-outline-primary" for="classRadio-${row.id}">${row.sex}</label>
                    `;
                  });
                  element += `
                      </div>`;
                  tabTitleLabel.parentElement.insertAdjacentHTML(
                    "beforeend",
                    element,
                  );
                },
              },
              {
                text: "إضافة ✚",
                className: "btn btn-primary",
                attr: {
                  "data-bs-toggle": "modal",
                  "data-bs-target": "#newClassroomInfosModal",
                },
              },
            ],
          },
        },
      },
      classroomsTableDetailIsShow,
    );
  } catch (e) {
    window.showToast("warning", "Error: " + e.message);
  }
}
// students tab
async function loadStudentsList() {
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  try {
    const results = project_db.exec(
      "SELECT * FROM students WHERE class_room_id = ?;",
      [workingClassroomId],
    );
    const data = [];
    if (results.length) {
      const result = results[0];
      result.values.forEach((row) => {
        // action buttons
        const action_button_group = document.createElement("div");
        action_button_group.className = "btn-group btn-group-sm";
        action_button_group.setAttribute("role", "group");
        action_button_group.setAttribute("aria-label", "Basic example");
        // Edit
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-info btn-sm";
        editBtn.innerHTML = '<i class="fa-solid fa-user-pen"></i> تعديل';
        editBtn.onclick = function () {
          studentInfosModal.show();
          const studentId = row[0];
          const result = project_db.exec(
            "SELECT * FROM students WHERE id = ?;",
            [studentId],
          );
          studentIdInput.value = studentId;
          firstNameInput.value =
            result[0].values[0][result[0].columns.indexOf("fname")];
          lastNameInput.value =
            result[0].values[0][result[0].columns.indexOf("lname")];
          birthyearInput.value =
            result[0].values[0][result[0].columns.indexOf("birthyear")];
          parentPhoneInput.value =
            result[0].values[0][result[0].columns.indexOf("parent_phone")];
        };
        action_button_group.appendChild(editBtn);
        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.innerHTML = '<i class="fa-solid fa-user-slash"></i> حذف';
        CreateOnClickUndo(deleteBtn, function () {
          const studentId = row[0];
          if (!confirm(`هل أنت متأكد أنك تريد حذف هذا الطالب؟`)) {
            return;
          }
          if (!project_db) {
            window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
            return;
          }
          try {
            project_db.run("DELETE FROM students WHERE id = ?;", [studentId]);
            saveToIndexedDB(project_db.export());
            deleteTableRow("#studentsListTable", "id", row[0]);
            window.showToast(
              "success",
              `تم حذف الطالب${isGirls ? "ة" : ""} بنجاح.`,
            );
          } catch (e) {
            window.showToast("warning", "Error: " + e.message);
          }
        });
        action_button_group.appendChild(deleteBtn);

        // phone buttons
        let phone_button_group = "غير متوفر";
        if (row[result.columns.indexOf("parent_phone")]) {
          phone_button_group = document.createElement("div");
          phone_button_group.className = "btn-group btn-group-sm";
          phone_button_group.setAttribute("role", "group");
          phone_button_group.setAttribute("aria-label", "Basic example");
          // call
          const callBtn = document.createElement("a");
          callBtn.href = "tel:" + row[result.columns.indexOf("parent_phone")];
          callBtn.className = "btn btn-success btn-sm";
          callBtn.innerHTML = '<i class="fa-solid fa-phone-flip"></i>';
          phone_button_group.appendChild(callBtn);
          // sms
          const smsBtn = document.createElement("a");
          smsBtn.href = "sms:" + row[result.columns.indexOf("parent_phone")];
          smsBtn.className = "btn btn-info btn-sm";
          smsBtn.innerHTML = '<i class="fa-solid fa-comment-sms"></i>';
          phone_button_group.appendChild(smsBtn);
        }

        data.push({
          select: "",
          id: row[0],
          num: data.length + 1,
          name:
            row[result.columns.indexOf("fname")] +
            " " +
            row[result.columns.indexOf("lname")],
          history: `<i onclick="showRequirementsHistory(${row[0]})" class="fa-solid fa-clock-rotate-left"></i>`,
          age: Math.abs(
            Math.floor(
              DateTime.now().diff(
                DateTime.fromJSDate(
                  new Date(row[result.columns.indexOf("birthyear")]),
                ),
                "years",
              ).years,
            ),
          ),
          parentPhone: phone_button_group,
          actions: action_button_group,
        });
      });
    }

    await initOrReloadDataTable(
      "#studentsListTable",
      data,
      [
        { data: "select" },
        { data: "id" },
        { data: "num", className: "text-center" },
        { data: "name" },
        { data: "history", className: "text-right px-0" },
        { data: "age", className: "text-center px-0" },
        { data: "parentPhone", className: "py-1" },
        { data: "actions", className: "py-1" },
      ],
      {
        select: {
          style: "multi",
          selector: "td:first-child",
          headerCheckbox: "select-page",
        },
        destroy: true,
        order: [[2, "asc"]],
        columnDefs: [
          {
            targets: 0,
            render: DataTable.render.select(),
          },
          { visible: false, targets: [1, 7] },
          {
            targets: [0, 4, 6, 7],
            orderable: false,
          },
          {
            targets: [4],
            width: "5px",
          },
        ],
        searching: false,
        scrollX: true,
        info: false,
        oLanguage: {
          sSearch: "بحث",
          emptyTable: "لا توجد بيانات في الجدول.",
        },
        paging: false,
        responsive: true,

        layout: {
          topStart: {
            buttons: [
              {
                text: '<i class="fa-solid fa-table-cells">',
                action: async function (e, dt) {
                  const columns = dt.columns([7]);
                  const isVisible = dt.column(columns[0][0]).visible();

                  columns.visible(!isVisible);
                  studentsTableDetailIsShow = !isVisible;
                  dt.button(0).text(
                    isVisible
                      ? '<i class="fa-solid fa-table-cells">'
                      : '<i class="fa-solid fa-table"></i>',
                  );
                },
              },
              {
                text: '<i class="fa-solid fa-comment-sms">',
                action: async function (e, dt) {
                  const selectedRows = dt
                    .rows({ selected: true })
                    .data()
                    .toArray();
                  if (selectedRows.length === 0) {
                    window.showToast("info", "الرجاء اختيار طلاب أولاً.");
                    return;
                  }
                  const phones = selectedRows
                    .map((row) => row.parentPhone)
                    .filter((row) => typeof row !== "string")
                    .map((row) =>
                      row.querySelector("a").href.replace("tel:", ""),
                    )
                    .toString();

                  window.location.href = `sms:${phones}`;
                },
              },
              {
                text: "إضافة ✚",
                className: "btn btn-primary",
                attr: {
                  "data-bs-toggle": "modal",
                  "data-bs-target": "#newStudentInfosModal",
                },
              },
            ],
          },
        },
      },
      studentsTableDetailIsShow,
    );
  } catch (e) {
    window.showToast("warning", "Error: " + e.message);
  }
}

// day students list tab
newStudentInfosForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  const fname = firstNameInput.value;
  const lname = lastNameInput.value;
  const birthyear = birthyearInput.value;
  const parentPhone = parentPhoneInput.value || null;

  if (!fname || !birthyear || !lname) {
    window.showToast("error", "الرجاء ملء جميع الحقول.");
    return;
  }
  if (parentPhone && !/^(05|06|07)\d{8}$/.test(parentPhone)) {
    window.showToast(
      "error",
      "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام.",
    );
    return;
  }
  try {
    if (studentIdInput.value) {
      project_db.run(
        "UPDATE students SET fname = ?,lname = ?, birthyear = ?, parent_phone = ? WHERE id = ?;",
        [fname, lname, birthyear, parentPhone, studentIdInput.value],
      );
      window.showToast(
        "success",
        `تم تعديل الطالب${isGirls ? "ة" : ""} بنجاح.`,
      );
    } else {
      project_db.run(
        "INSERT INTO students (fname,lname, birthyear, parent_phone, class_room_id) VALUES (?, ?,?, ?,?);",
        [fname, lname, birthyear, parentPhone, workingClassroomId],
      );
      newStudentInfosForm.reset();
      studentIdInput.value = "";
      window.showToast(
        "success",
        `تم إضافة الالطالب${isGirls ? "ة" : ""} بنجاح.`,
      );
    }
    saveToIndexedDB(project_db.export());
    studentInfosModal.hide();
    loadStudentsList();
  } catch (e) {
    window.showToast("error", "Error: " + e.message);
  }
});

document
  .getElementById("newStudentInfosModal")
  .addEventListener("show.bs.modal", function () {
    newStudentInfosForm.reset();
    studentIdInput.value = "";
  });

document
  .getElementById("newClassroomInfosModal")
  .addEventListener("show.bs.modal", function () {
    newClassroomInfosForm.reset();
    classroomIdInput.value = "";
  });

document
  .getElementById("newStudentInfosModal")
  .addEventListener("show.bs.modal", function () {
    const submitButton = document.querySelector(
      "#newStudentInfosModal [type='submit']",
    );
    if (studentIdInput.value) {
      submitButton.textContent = "تحديث";
    } else {
      submitButton.textContent = "إضافة";
    }
  });

document
  .getElementById("newClassroomInfosModal")
  .addEventListener("show.bs.modal", function () {
    const submitButton = document.querySelector(
      "#newClassroomInfosModal [type='submit']",
    );
    if (classroomIdInput.value) {
      submitButton.textContent = "تحديث";
    } else {
      submitButton.textContent = "إضافة";
    }
  });

requireBookInput.onchange = function () {
  const quranSelectionSection = document.getElementById(
    "quranSelectionSection",
  );

  if (this.value === "القرآن الكريم") {
    quranSelectionSection.style.removeProperty("display");
    requirQuantityDetailInput.style.display = "none";
    requirQuantityInput.readOnly = true;
  } else {
    requirQuantityDetailInput.style.removeProperty("display");
    quranSelectionSection.style.display = "none";
    requirQuantityInput.readOnly = false;
  }
  requirQuantityDetailInput.value = "";
  requirEvaluationInput.value = "10.00";
  saveStateErrorsInput.value = "0";
  saveStateAlertsInput.value = "0";
  requirRepitInput.value = "0";
};

function setAttendanceValue(value) {
  let radioId = null;
  switch (value) {
    case 1:
      radioId = "present";
      break;
    case 0:
      radioId = "JustifiedAbsence";
      break;
    default:
      radioId = "UnjustifiedAbsence";
  }
  const radio = document.getElementById(radioId);
  radio.checked = true;
  onChangeAttendanceState(radio);
}

function getAttendanceValue() {
  switch (document.querySelector(`input[name=attendance]:checked`).id) {
    case "present":
      return 1;
      break;
    case "JustifiedAbsence":
      return 0;
      break;
    default:
      return 2;
  }
}

function onChangeAttendanceState(radio = null) {
  const selectedRadio =
    radio || document.querySelector(`input[name=attendance]:checked`);
  if (!selectedRadio) {
    return;
  }
  if (selectedRadio.id !== "present") {
    newStudentDayModalBody.style.display = "none";
  } else {
    try {
      evalMoyenne.value = calcEvaluationMoyenne(
        retardInput.value,
        clothingInput.value,
        haircutInput.value,
        behaviorInput.value,
        prayerInput.value,
        addedPointsInput.value,
      );
    } catch (e) {
      console.log(e);
    }
    newStudentDayModalBody.style.display = "block";
  }
}

function calcEvaluationMoyenne(
  retard,
  clothing,
  haircut,
  behavior,
  prayer,
  addedPoints,
) {
  let moyenne = 0;
  moyenne +=
    evaluationLaddersValues["retard"]["initialPresenceMark"] -
    parseInt(retard > -1 ? retard : 0) *
      evaluationLaddersValues["retard"]["retardPointsPerMinute"];
  moyenne += parseInt(clothing) || 0;
  moyenne += parseInt(haircut) || 0;
  moyenne += parseInt(behavior) || 0;
  moyenne += parseInt(prayer) || 0;
  moyenne += parseFloat(addedPoints) || 0;
  return moyenne.toFixed(2);
}

function calcRequirementMoyenne(quantity, evaluation, type, repit) {
  let value = 0;
  if (type === "حفظ") {
    value = evaluation * (quantity / 2);
  } else {
    value = evaluation * (quantity / 4);
  }

  const isUpdate = addQuranSelectionBtn.innerText === "تحديث";
  const rows = requirementsTable.querySelectorAll("tbody tr");
  let position;
  if (!isUpdate) {
    position = rows.length + 1;
  } else {
    position =
      Array.from(rows).findIndex((tr) =>
        tr.querySelector(".btn-success:disabled"),
      ) + 1;
  }
  const baseQuantity = type === "حفظ" ? quantity : quantity / 2;
  value += baseQuantity / position;

  return (
    value > 0
      ? value -
        repit *
          (evaluationLaddersValues.requirments?.requirReducePerRepit || 10)
      : 0
  ).toFixed(2);
}

function calcRequirementsMoyenne() {
  const headers = Array.from(
    requirementsTable.querySelectorAll("thead th"),
  ).map((header) => header.textContent.trim());
  const moyenneIndex = headers.indexOf("المعدل");

  let moyenne = 0;

  requirementsTable.querySelectorAll("tbody tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (moyenneIndex !== -1) {
      moyenne += parseFloat(cells[moyenneIndex]?.textContent.trim() || "0");
    }
  });

  return (moyenne ? moyenne : 0).toFixed(2);
}

function calcRequirementEvaluation(
  requirQuantity,
  requirType,
  saveStateErrors,
  saveStateAlerts,
) {
  const errorValue = parseFloat(
    10 / (requirQuantity * (requirType === "حفظ" ? 2 : 1)),
  );
  const alertsValue = parseFloat(
    10 / (requirQuantity * (requirType === "حفظ" ? 8 : 4)),
  );
  const result = parseFloat(
    10 -
      errorValue * parseFloat(saveStateErrors) -
      alertsValue * parseFloat(saveStateAlerts),
  );
  return result > 0 ? result.toFixed(2) : 0;
}

function calcGlobalMoyenne(requirsMoyenne, evalMoyenne) {
  let globalEvaluation = 0;
  globalEvaluation = requirsMoyenne + evalMoyenne;
  globalEvaluation = globalEvaluation > 0 ? globalEvaluation : 0;
  return globalEvaluation.toFixed(2);
}

$([
  retardInput,
  behaviorInput,
  prayerInput,
  clothingInput,
  haircutInput,
  addedPointsInput,
]).on("change input", () => {
  studentDayFormSubmitBtn.disabled = false;
  studentDayFormSubmitBtn.nextElementSibling.disabled = false;

  evalMoyenne.value = calcEvaluationMoyenne(
    retardInput.value,
    clothingInput.value,
    haircutInput.value,
    behaviorInput.value,
    prayerInput.value,
    addedPointsInput.value,
  );
});

function setRequirEvalInput() {
  requirEvaluationInput.value = calcRequirementEvaluation(
    requirQuantityInput.value,
    requirTypeInput.value,
    saveStateErrorsInput.value,
    saveStateAlertsInput.value,
  );
  requirMoyenneInput.value = calcRequirementMoyenne(
    requirQuantityInput.value,
    requirEvaluationInput.value,
    requirTypeInput.value,
    requirRepitInput.value,
  );
  document.getElementById("audioFileBtn").href =
    `quran://surah/${firstSurahSelect.value}/ayah/${firstAyahSelect.value}`;
}

$([
  requirTypeInput,
  saveStateErrorsInput,
  saveStateAlertsInput,
  requirRepitInput,
]).on("change input", setRequirEvalInput);

function update_student_day_notes(studentId, working_day_id) {
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }

  const attendanceValue = getAttendanceValue();

  // Helper function to build requirements list
  const buildRequirList = () => {
    const requirList = [];
    const headers = Array.from(
      requirementsTable.querySelectorAll("thead th"),
    ).map((header) => header.textContent.trim());
    const rows = requirementsTable.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const rowData = {};
      cells.forEach((cell, index) => {
        const key = headers[index];
        if (key) rowData[key] = cell.textContent.trim();
      });
      requirList.push(rowData);
    });
    return requirList;
  };

  // Handle requirements insertion for present students
  if (attendanceValue === 1) {
    const requirList = buildRequirList();
    if (requirList.length) {
      project_db.run(
        "INSERT OR REPLACE INTO day_requirements (student_id, day_id, detail, moyenne) VALUES (?, ?, ?, ?);",
        [
          studentId,
          working_day_id,
          JSON.stringify(requirList),
          requirsMoyenneInput.value || "0",
        ],
      );
    } else {
      project_db.run(
        `DELETE FROM day_requirements WHERE student_id = ? AND day_id = ?;`,
        [studentId, working_day_id],
      );
    }
  }

  // Insert or update evaluations for present or justified absence
  if (attendanceValue === 0 || attendanceValue === 1) {
    project_db.run(
      "INSERT OR REPLACE INTO day_evaluations (student_id, day_id, attendance, retard, clothing, haircut, behavior, prayer, added_points, moyenne) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [
        studentId,
        working_day_id,
        attendanceValue,
        attendanceValue === 1 ? retardInput.value : null,
        parseInt(clothingInput.value) || null,
        parseInt(haircutInput.value) || null,
        parseInt(behaviorInput.value) || null,
        parseInt(prayerInput.value) || null,
        parseInt(addedPointsInput.value) || null,
        attendanceValue === 1 ? evalMoyenne.value : 0,
      ],
    );
  }

  // Delete evaluations for unjustified absence
  if (attendanceValue === 2) {
    project_db.run(
      "DELETE FROM day_evaluations WHERE student_id = ? AND day_id = ?;",
      [studentId, working_day_id],
    );
  }

  // Delete requirements for any absence
  if (attendanceValue === 0 || attendanceValue === 2) {
    project_db.run(
      "DELETE FROM day_requirements WHERE student_id = ? AND day_id = ?;",
      [studentId, working_day_id],
    );
  }

  Object.keys(teachersPoints).forEach((key) => {
    project_db.run(
      `UPDATE day_evaluations SET added_points = COALESCE(added_points, 0) + ? ,
                                  moyenne = COALESCE(moyenne, 0) + ?
                                  WHERE student_id = ?  
                                  AND day_id = ?;`,
      [teachersPoints[key], teachersPoints[key], key, working_day_id],
    );
  });
  teachersPoints = {};

  saveToIndexedDB(project_db.export());
  loadDayStudentsList();
}

function calcRetardTime() {
  let retardTime = 0;
  const now = DateTime.now();
  const startTime = DateTime.fromFormat(studentDayInfos.start_time, "HH:mm");
  // For accurate diff calculation, set the date to today for both
  const startTimeToday = now.set({
    hour: startTime.hour,
    minute: startTime.minute,
  });
  return Math.round(now.diff(startTimeToday, "minutes").minutes);
}

function checkAuthorizedOut(time, requirsMoyenne, minutesToAdd) {
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const [h, m] = time.split(":").map(Number);
  const newTimeObj =
    h * 60 + m + (minutesToAdd + outTimeInput.valueAsNumber || 0);
  const difference = newTimeObj - currentTotalMinutes;
  return requirsMoyenne && difference < 0;
}

async function showOffCanvas(title, body, side = "top") {
  const myOffcanvas = document.getElementById("offcanvasTop");
  myOffcanvas.classList.remove(
    "offcanvas-top",
    "offcanvas-end",
    "offcanvas-start",
    "offcanvas-bottom",
  );
  myOffcanvas.classList.add(`offcanvas-${side}`);
  document.getElementById("offcanvasTopLabel").textContent = `${title}:`;
  document.getElementById("offcanvas-body").innerHTML = body;
  if (!myOffcanvas.classList.contains("show"))
    new bootstrap.Offcanvas(myOffcanvas).show();
}

window.markPresence = async function (studentId) {
  const retard_time = calcRetardTime();
  project_db.run(
    "INSERT OR REPLACE INTO day_evaluations (student_id, day_id, attendance,retard,clothing,haircut,behavior,added_points,moyenne) VALUES (?,?, ?,?, ?,?,?,?,?);",
    [
      studentId,
      workingDayID,
      1,
      retard_time,
      null,
      null,
      null,
      null,
      calcEvaluationMoyenne(retard_time, null, null, null, null, null),
    ],
  );
  saveToIndexedDB(project_db.export());
  await loadDayStudentsList();
};

function showApopintmentTimePicker(initialTime = null) {
  setApointementTimeToNow();
  updateAppointmentTimeDisplay();
  new bootstrap.Modal("#timeModal").show();
}

function updateAppointmentTimeDisplay() {
  const h = currentTime.hours.toString().padStart(2, "0");
  const m = currentTime.minutes.toString().padStart(2, "0");
  document.getElementById("timeDisplay").textContent = `${h}:${m}`;
}

function adjustApointementTimeMinutes(minutes) {
  currentTime.minutes = Math.floor(currentTime.minutes / 15) * 15;
  if (currentTime.minutes === 60) {
    currentTime.hours++;
    currentTime.minutes = 0;
  }
  currentTime.minutes += minutes;

  // Handle overflow/underflow
  while (currentTime.minutes >= 60) {
    currentTime.hours++;
    currentTime.minutes -= 60;
  }
  while (currentTime.minutes < 0) {
    currentTime.hours--;
    currentTime.minutes += 60;
  }

  // Wrap hours
  if (currentTime.hours < 0) currentTime.hours = 23;
  if (currentTime.hours > 23) currentTime.hours = 0;

  updateAppointmentTimeDisplay();
}

function setApointementTimeToNow() {
  const now = new Date();
  currentTime.hours = now.getHours();
  currentTime.minutes = now.getMinutes();
  updateAppointmentTimeDisplay();
}

async function addNewStudyDay() {
  if (!project_db) {
    indow.showToast("info", "لا يوجد قاعدة بيانات مفتوحة....");
    return;
  }

  const h = currentTime.hours.toString().padStart(2, "0");
  const m = currentTime.minutes.toString().padStart(2, "0");
  const appointment_time = `${h}:${m}`;
  if (appointment_time == null) {
    window.showToast("error", "يرجى اختيار وقت البدء.");
    return;
  } else if (!/^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(appointment_time)) {
    window.showToast("error", "يرجى اختيار وقت صحيح.");
    return;
  }
  try {
    project_db.run(
      "INSERT OR REPLACE INTO education_day (date,time, notes,class_room_id,evaluation_ladder_id,isObligatory) VALUES (?,?, ?,?,(SELECT id FROM evaluation_ladder ORDER BY rowid DESC LIMIT 1),?);",
      [
        workingDay,
        appointment_time,
        null,
        workingClassroomId,
        document.getElementById("obligatoryCheck").checked,
      ],
    );
  } catch (error) {
    if (
      String(error).includes(
        "table education_day has no column named isObligatory",
      )
    ) {
      project_db.run(
        "ALTER TABLE education_day ADD COLUMN isObligatory BOOLEAN DEFAULT 1;",
      );
      project_db.run(
        "INSERT OR REPLACE INTO education_day (date,time, notes,class_room_id,evaluation_ladder_id,isObligatory) VALUES (?,?, ?,?,(SELECT id FROM evaluation_ladder ORDER BY rowid DESC LIMIT 1),?);",
        [
          workingDay,
          appointment_time,
          null,
          workingClassroomId,
          document.getElementById("obligatoryCheck").checked,
        ],
      );
    }
  }
  studentDayInfos.start_time = appointment_time;
  saveToIndexedDB(project_db.export());
  getStudyDays();
  await loadDayStudentsList();
}

function setOrGetOptionValueByText(selector, text, get = false) {
  for (let i = 0; i < selector.options.length; i++) {
    if (selector.options[i].text === text) {
      if (!get) {
        selector.selectedIndex = i;
        selector.dispatchEvent(new Event("change"));
        return;
      } else {
        return selector.options[i].value;
      } // Exit the loop once the option is found and selected
    }
  }
}

async function showStudentDayModal(isUniqueStudent = true) {
  studentDayModal.show();
  studentDayModalElement.dispatchEvent(new Event("show.bs.modal"));
  studentDayFormSubmitBtn.disabled = true;
  studentDayFormSubmitBtn.nextElementSibling.disabled = true;

  newStudentDayModalBody.style.display = "block";
  if (isUniqueStudent) {
    document
      .getElementById("present")
      .parentElement.style.removeProperty("display");
  } else {
    evaluationCollapse.show();
    document.getElementById("present").parentElement.style.display = "none";
  }
  document.getElementById("requirCollapse").parentElement.style.display =
    isUniqueStudent ? "block" : "none";
  evalMoyenne.disabled = !isUniqueStudent;
  retardInput.disabled = !isUniqueStudent;
}

function parseRequirment(requir, book, bulletin = false) {
  if (book !== "القرآن الكريم")
    return `${book} ${bulletin ? ")" : "("} ${requir.length > 35 ? requir.slice(0, 35) + "... " : requir}${bulletin ? "(" : ")"}`;
  const reqlist = requir.split(" ");
  if (reqlist[0] == reqlist[4]) {
    const numberOfAyahs = quranData.surahs.find(
      (surah) => surah.name == reqlist[0],
    ).numberOfAyahs;
    if (numberOfAyahs == reqlist[6]) {
      if (reqlist[2] == 1)
        return `سورة ${reqlist[0]} ${bulletin ? ")" : "("}كاملة${bulletin ? "(" : ")"}`;
      else
        return `سورة ${reqlist[0]} ${bulletin ? ") " : "("}${reqlist[2]} -  النهاية${bulletin ? "(" : ")"}`;
    }
    return `سورة ${reqlist[0]} ${bulletin ? ") " : "("}${reqlist[2]} - ${reqlist[6]}${bulletin ? " (" : ")"}`;
  } else {
    const numberOfAyahs = quranData.surahs.find(
      (surah) => surah.name == reqlist[4],
    ).numberOfAyahs;
    return `من ${reqlist[0]} (${reqlist[2]})  إلى ${reqlist[4]} ${bulletin ? ") " : "("}${numberOfAyahs == reqlist[6] ? "النهاية" : reqlist[6]}${bulletin ? "(" : ")"}`;
  }
}

window.showRequirementsHistory = function (student_id, page = 1) {
  let requirs = [];
  let requirsDates = [];
  project_db
    .exec(
      ` SELECT dr.detail,(SELECT date FROM education_day WHERE id = dr.day_id) AS day_date FROM day_requirements dr
        WHERE dr.student_id = ${student_id} ORDER BY dr.day_id DESC
        LIMIT ${page * 5}`,
    )[0]
    ?.values.forEach((row) => {
      requirs.push(row[0]);
      requirsDates.push(row[1]);
    });
  requirsDates = requirsDates.map((date) => new Date(date));
  showOffCanvas(
    "المتطلبات السابقة",
    `<ul> ${requirs
      .map(
        (i, index) =>
          `<li><strong>${new Intl.DateTimeFormat(
            "ar-DZ-u-ca-islamic-umalqura",
            {
              day: "numeric",
              month: "long",
              weekday: "long",
            },
          ).format(
            requirsDates[index],
          )} (${DateTime.fromJSDate(requirsDates[index]).hasSame(DateTime.now(), "day") ? "اليوم" : fromNow(requirsDates[index]).replace("منذ", "قبل")})</strong>` +
          `<ul>` +
          JSON.parse(i)
            .map(
              (i) =>
                `<li>${i["النوع"]} - ${parseRequirment(i["التفاصيل"], i["الكتاب"])}</li>`,
            )
            .reverse()
            .join("") +
          `</ul></li>`,
      )
      .join(
        "",
      )}</ul><button class="btn btn-link" onclick="showRequirementsHistory(${student_id},${page + 1})">أقدم...</button>
      `,
    "start",
  );
};

function changeObligatory(switchElement) {
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  try {
    project_db.run("UPDATE education_day SET isObligatory = ? WHERE id = ?;", [
      switchElement.checked,
      workingDayID,
    ]);
    saveToIndexedDB(project_db.export());
  } catch (e) {
    window.showToast("error", "Error: " + e.message);
  }
}

async function loadDayStudentsList() {
  dayNoteContainer.style.display = "none";
  if (!project_db) {
    window.showToast("info", "لا توجد قاعدة بيانات مفتوحة....");
    return;
  }

  const dayResult = project_db.exec(
    `SELECT * FROM education_day WHERE class_room_id = ? AND date = ?`,
    [workingClassroomId, workingDay],
  );
  if (!dayResult.length) {
    if ($.fn.DataTable.isDataTable("#dayListTable")) {
      $("#dayListTable").DataTable().destroy();
    }
    addNewDayBtn.style.display = "block";
    document.getElementById("dayListTable").style.display = "none";
    return;
  }

  // fill evaluation ladder
  const newEvalLaddersValues = JSON.parse(
    project_db.exec("SELECT detail FROM evaluation_ladder WHERE id = ?;", [
      dayResult[0].values[0][
        dayResult[0].columns.indexOf("evaluation_ladder_id")
      ],
    ])[0].values[0],
  );

  const updateEvaluation = () => {
    if (newEvalLaddersValues !== evaluationLaddersValues) {
      Object.assign(evaluationLaddersValues, newEvalLaddersValues);
      populateEvalSelects();
    }
  };

  if (
    !studentDayModalElement.classList.contains("show") &&
    maximizeModalBtn.style.display === "none"
  ) {
    updateEvaluation();
  } else {
    studentDayModalElement.addEventListener("show.bs.modal", updateEvaluation, {
      once: true,
    });
  }

  workingDayID = dayResult[0].values[0][dayResult[0].columns.indexOf("id")];
  studentDayInfos.start_time =
    dayResult[0].values[0][dayResult[0].columns.indexOf("time")] || null;

  studentDayInfos.dayNote =
    dayResult[0].values[0][dayResult[0].columns.indexOf("notes")] || "";
  dayNoteContainer.style.display = studentDayInfos.dayNote ? "block" : "none";
  dayNoteContainer.innerHTML = `<em>${studentDayInfos.dayNote}</em>`;

  studentDayInfos.isObligatory =
    dayResult[0].values[0][dayResult[0].columns.indexOf("isObligatory")];
  document.getElementById("dayListTable").style.display = "block";
  addNewDayBtn.style.display = "none";

  try {
    const results = project_db.exec(`
      SELECT 
          s.id AS studentId,  
          s.fname AS studentFName,
          s.lname AS studentLName,
          s.parent_phone AS parentPhone,
          dr.detail AS "detail",
          dr.moyenne AS "requirsMoyenne",
          de.attendance AS "attendance",
          de.retard AS "retard",
          de.clothing AS "clothing", 
          de.haircut AS "haircut",
          de.behavior AS "behavior",
          de.prayer AS "prayer",
          de.added_points AS "added_points",
          de.moyenne AS "evalMoyenne"
      FROM students s
      LEFT JOIN day_requirements dr ON s.id = dr.student_id AND dr.day_id = '${workingDayID}'
      LEFT JOIN day_evaluations de ON s.id = de.student_id AND de.day_id = '${workingDayID}'
      WHERE s.class_room_id = ${workingClassroomId}
      GROUP BY s.id, studentFName , studentLName
      ORDER BY s.id
      LIMIT 100`);

    const data = [];
    requirTeacherInput.options.length = 0;
    requirTeacherInput.add(new Option("المعلم", "0", true));
    if (results.length) {
      const result = results[0];
      result.values.forEach((row) => {
        const student_id = row[result.columns.indexOf("studentId")];
        const attendance = row[result.columns.indexOf("attendance")];
        const retardValue = row[result.columns.indexOf("retard")];
        const full_name =
          row[result.columns.indexOf("studentFName")] +
          " " +
          row[result.columns.indexOf("studentLName")];

        // fill teacher options
        if (
          attendance == "1" &&
          !Array.from(requirTeacherInput.options)
            .map((option) => option.value)
            .includes(student_id)
        ) {
          requirTeacherInput.add(new Option(full_name, student_id));
        }

        function editStudentDay(isEvaluation = true) {
          teachersPoints = {};
          hideMaximizeModalBtn();
          showStudentDayModal(true);

          for (const option of requirTeacherInput.options) {
            option.disabled = option.value == student_id;
          }

          studentNameInput.value = full_name;

          if (isEvaluation) {
            evaluationCollapse.show();
            requirCollapse.hide();
          } else {
            evaluationCollapse.hide();
            requirCollapse.show();
            setTimeout(() => {
              requireBookInput.scrollIntoView();
            }, 500);
          }

          setAttendanceValue(attendance);
          retardInput.value =
            retardValue !== null ? retardValue : calcRetardTime();
          clothingInput.value = row[result.columns.indexOf("clothing")] || "0";
          haircutInput.value = row[result.columns.indexOf("haircut")] || "0";
          behaviorInput.value = row[result.columns.indexOf("behavior")] || "0";
          prayerInput.value = row[result.columns.indexOf("prayer")] || "0";
          addedPointsInput.value =
            row[result.columns.indexOf("added_points")] || "0";
          evalMoyenne.value =
            row[result.columns.indexOf("evalMoyenne")]?.toFixed(2) ||
            calcEvaluationMoyenne(
              retardInput.value,
              clothingInput.value,
              haircutInput.value,
              behaviorInput.value,
              prayerInput.value,
              addedPointsInput.value,
            );

          historyRequirBtn.onclick = () =>
            window.showRequirementsHistory(student_id);

          requirsMoyenneInput.value =
            row[result.columns.indexOf("requirsMoyenne")] || "0.00";
          requirementsTable.querySelector("tbody").innerHTML = "";
          JSON.parse(row[result.columns.indexOf("detail")] || "[]").forEach(
            (item, index, arr) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${item["الكتاب"]}</td>
                <td>${item["النوع"]}</td>
                <td class="d-none">${item["المقدار"]}</td>
                <td style="white-space: normal;">${item["التفاصيل"]}</td>
                <td>${item["التقدير"]}</td>
                <td>${item["الأخطاء"] || ""}</td>
                <td>${item["التنبيهات"] || ""}</td>
                <td>${item["المعدل"]}</td>
                <td>${item["المعرض"] || ""}</td>
                <td>${item["الإعادة"] || ""}</td>
                <td><div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button type="button" class="btn btn-success" onclick="editRequirement(this);"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="removeRequirItem(this,${student_id})"><i class="fa-solid fa-xmark"></i></button></td></div>`;
              requirementsTable.querySelector("tbody").appendChild(row);
              if (index === arr.length - 1) {
                initRequirementFields({
                  الكتاب: item["الكتاب"],
                  النوع: item["النوع"],
                  التفاصيل: item["التفاصيل"],
                });
              }
            },
          );
          if (
            !JSON.parse(row[result.columns.indexOf("detail")] || "[]").length
          ) {
            const lsR = project_db.exec(`
                    SELECT dr.detail
                    FROM day_requirements dr
                    INNER JOIN education_day ed ON dr.day_id = ed.id
                    WHERE dr.student_id = ${student_id}
                    ORDER BY ed.date DESC
                    LIMIT 1;`);
            initRequirementFields(
              lsR.length ? JSON.parse(lsR[0].values[0][0]).at(-1) : null,
            );
          }

          const working_day_id = workingDayID;
          studentDayFormSubmitBtn.onclick = async function () {
            if (!project_db) {
              window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
              return;
            }
            update_student_day_notes(student_id, working_day_id);
            this.disabled = true;
            this.nextElementSibling.disabled = true;
          };
        }

        const attendance_value = attendance;
        // edit button
        const evaluationDayContainer = document.createElement("div");
        const evaluationDayIcon = document.createElement("i");
        evaluationDayIcon.className = "fa-solid fa-pen-to-square";
        evaluationDayIcon.onclick = () => editStudentDay(true);
        if (!attendance_value) {
          ("pass");
        } else if (
          row[result.columns.indexOf("clothing")] == null &&
          row[result.columns.indexOf("haircut")] == null &&
          row[result.columns.indexOf("behavior")] == null
        ) {
          evaluationDayIcon.textContent =
            "   " + row[result.columns.indexOf("evalMoyenne")];
        } else {
          evaluationDayContainer.append(
            row[result.columns.indexOf("evalMoyenne")] + "   ",
          );
        }
        evaluationDayContainer.append(evaluationDayIcon);

        const requirmentsDayValue = `${
          attendance_value
            ? row[result.columns.indexOf("requirsMoyenne")] || "0.00"
            : ""
        }    <i onclick="showRequirementsHistory(${student_id})" class="fa-solid fa-clock-rotate-left"></i>`;

        const editBtn = attendance_value ? document.createElement("i") : "";
        if (attendance_value) {
          editBtn.className = "fa-solid fa-square-plus";
          editBtn.style.cssText = "transform: scale(1.5); cursor: pointer;";
          editBtn.onclick = () => editStudentDay(false);
        }

        const thisDay = new Date().toISOString().slice(0, 10);
        data.push({
          select: "",
          id: student_id,
          student: full_name,
          attendance:
            attendance_value == 1
              ? (retardValue < 0
                  ? `قبل ${retardValue * -1} د `
                  : retardValue == 0
                    ? `في الوقت `
                    : `بعد ${retardValue} د `) +
                (thisDay == workingDay &&
                checkAuthorizedOut(
                  studentDayInfos.start_time,
                  row[result.columns.indexOf("requirsMoyenne")],
                  retardValue,
                )
                  ? "🟢"
                  : "")
              : attendance_value == 0
                ? "غياب مبرر"
                : `<button onclick="const cscy=window.scrollY;markPresence(${student_id});window.scrollTo({top: cscy,behavior: 'instant'});" class="btn fa-solid fa-square-check px-1" style="transform: scale(1.3); cursor: pointer;"></button>` +
                  (row[result.columns.indexOf("parentPhone")]
                    ? `<input type="checkbox" id="sms_btn${student_id}" onclick="window.location.href='sms:${
                        row[result.columns.indexOf("parentPhone")]
                      }?body=ليكن في علمكم أن إبن${isGirls ? "ت" : ""}كم ${
                        row[result.columns.indexOf("studentFName")]
                      } غائب${
                        isGirls ? "ة" : ""
                      } عن حصة تحفيظ القرآن اليوم'" class="btn-check" autocomplete="off">
                    <label class="btn fa-solid fa-comment-sms px-2" for="sms_btn${student_id}"></label>`
                    : ""),
          evaluation: attendance_value
            ? calcGlobalMoyenne(
                row[result.columns.indexOf("requirsMoyenne")],
                row[result.columns.indexOf("evalMoyenne")],
              )
            : null,
          evalMoyenne: evaluationDayContainer,
          requirsMoyenne: requirmentsDayValue,
          actions: editBtn,
        });
      });
    } else {
      window.showToast("success", "لا يوجد تلاميذ.");
      showTab("pills-students");
      return;
    }
    await initOrReloadDataTable(
      "#dayListTable",
      data,
      [
        { data: "select" },
        { data: "id", visible: false },
        { data: "student" },
        {
          data: "attendance",
          className: "text-start",
          type: "num",
          render: function (data, type, row) {
            if (type === "sort") {
              const data1 = data.replace("🟢", "");
              if (data1.includes("في الوقت")) return 0;
              else if (data1.includes("بعد")) {
                return parseInt(data1.replace("بعد", "").replace("د", ""));
              } else if (data1.includes("قبل")) {
                return parseInt(data1.replace("قبل", "").replace("د", "")) * -1;
              } else if (data1.includes("غياب مبرر")) {
                return "";
              } else {
                return null;
              }
            }
            return data;
          },
        },
        {
          data: "evaluation",
          className: "text-center fw-bold fs-5",
          type: "num",
          defaultContent: "/",
          render: function (data, type, row) {
            if (type === "sort" && !data) {
              return 0;
            }
            return data;
          },
        },
        {
          data: "evalMoyenne",
          className: "text-center",
          type: "num",
          defaultContent: "/",
          render: function (data, type, row) {
            if (type === "sort") {
              if (!data || data === "/") return 0;
              else if (typeof data === "object")
                return parseFloat(data.innerHTML.split("  ")[0]);
            }
            return data;
          },
        },
        {
          data: "requirsMoyenne",
          className: "text-center",
          type: "num",
          defaultContent: "/",
          render: function (data, type, row) {
            if (type === "sort") {
              if (!data) return 0;
              else return parseFloat(data.split("    ")[0]);
            }
            return data;
          },
        },
        { data: "actions" },
      ],
      {
        select: {
          style: "multi",
          selector: "td:first-child",
          headerCheckbox: "select-page",
        },
        fixedHeader: true,
        destroy: true,
        searching: false,
        scrollX: true,
        info: false,
        oLanguage: {
          sSearch: "بحث",
          emptyTable: "لا توجد بيانات في الجدول.",
        },
        fixedColumns: {
          start: 0,
          end: 1,
        },
        paging: false,
        responsive: true,
        order: [[1, "asc"]],
        columnDefs: [
          {
            targets: 0,
            render: DataTable.render.select(),
          },
          // { visible: false, targets: [-3, -2] },
          { targets: [0, 1, -1], orderable: false },
        ],
        layout: {
          topStart: {
            buttons: [
              {
                extend: "colvis",
                text: '<i class="fa-solid fa-table"></i>',
              },
              {
                text: '<i class="fa-solid fa-pen-to-square"></i>',
                action: async function (e, dt) {
                  const selectedRows = dt
                    .rows({ selected: true })
                    .data()
                    .toArray();

                  if (selectedRows.length === 0) {
                    window.showToast("info", "الرجاء اختيار تلاميذ.");
                    return;
                  }
                  for (let selectedRow of selectedRows) {
                    if (selectedRow.attendance.includes("markPresence(")) {
                      window.showToast("info", "الرجاء اختيار تلاميذ حاضرين.");
                      return;
                    }
                  }

                  showStudentDayModal(false);

                  studentNameInput.value = `${selectedRows.length} طالب${
                    isGirls ? "ة" : ""
                  }`;

                  clothingInput.value = "0";
                  haircutInput.value = "0";
                  behaviorInput.value = "0";
                  prayerInput.value = "0";
                  addedPointsInput.value = "0";

                  const working_day_id = workingDayID;
                  studentDayFormSubmitBtn.onclick = async function () {
                    if (!project_db) {
                      window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
                      return;
                    }
                    selectedRows.forEach((selectedRow) => {
                      if (!project_db) {
                        window.showToast(
                          "info",
                          "لا يوجد قاعدة بيانات مفتوحة.",
                        );
                        return;
                      }

                      // Build UPDATE query dynamically
                      const updates = [];
                      const values = {
                        clothing: parseInt(clothingInput.value) || 0,
                        haircut: parseInt(haircutInput.value) || 0,
                        behavior: parseInt(behaviorInput.value) || 0,
                        prayer: parseInt(prayerInput.value) || 0,
                        added_points: parseFloat(addedPointsInput.value) || 0,
                      };

                      // Add non-zero values to update array
                      if (values.clothing)
                        updates.push(`clothing = ${values.clothing}`);
                      if (values.haircut)
                        updates.push(`haircut = ${values.haircut}`);
                      if (values.behavior)
                        updates.push(`behavior = ${values.behavior}`);
                      if (values.prayer)
                        updates.push(
                          `prayer = COALESCE(prayer,0) + ${values.prayer}`,
                        );
                      if (values.added_points)
                        updates.push(
                          `added_points = COALESCE(added_points,0) + ${values.added_points}`,
                        );

                      // Calculate total moyenne adjustment
                      const moyenneAdjustment = (
                        values.clothing +
                        values.haircut +
                        values.behavior +
                        values.prayer +
                        values.added_points
                      ).toFixed(2);

                      // Add moyenne update
                      updates.push(`moyenne = moyenne + ${moyenneAdjustment}`);

                      // Execute update if there are changes
                      if (updates.length) {
                        project_db.run(`
                          UPDATE day_evaluations 
                          SET ${updates.join(", ")}
                          WHERE student_id = ${selectedRow.id} 
                          AND day_id = ${working_day_id}
                        `);
                      }
                    });
                    saveToIndexedDB(project_db.export());
                    loadDayStudentsList();
                    studentDayModal.hide();
                  };
                },
              },
              {
                text: '<i class="fa-solid fa-arrows-rotate"></i>',
                action: async function () {
                  await loadDayStudentsList();
                },
              },
              {
                extend: "collection",
                text: "المزيد",
                buttons: [
                  {
                    text: '<i class="fa-regular fa-comment"></i> ملاحظة اليوم',
                    action: async function () {
                      swal("أكتب ملاحظة:", {
                        content: {
                          element: "input",
                          attributes: {
                            placeholder: studentDayInfos.dayNote,
                          },
                        },
                        buttons: [
                          {
                            text: "إلغاء",
                            value: false,
                            visible: true,
                            className: "",
                            closeModal: true,
                          },
                          "حفظ",
                        ],
                      }).then((value) => {
                        if (value !== false) {
                          if (!project_db) {
                            window.showToast(
                              "info",
                              "لا يوجد قاعدة بيانات مفتوحة.",
                            );
                            return;
                          }
                          try {
                            project_db.run(
                              "UPDATE education_day SET notes = ? WHERE id = ?;",
                              [value || null, workingDayID],
                            );
                            saveToIndexedDB(project_db.export());
                            dayNoteContainer.style.display = value
                              ? "block"
                              : "none";
                            dayNoteContainer.innerHTML = `<em>${value}</em>`;
                            studentDayInfos.dayNote = value;
                          } catch (e) {
                            window.showToast("error", "Error: " + e.message);
                          }
                        }
                      });
                    },
                  },
                  {
                    text: '<i class="fa-solid fa-circle-info"></i> معلومات الحصة',
                    action: async function () {
                      showOffCanvas(
                        "معلومات الحصة",
                        `<div class="mx-3">
                          <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" onchange="changeObligatory(this)" ${studentDayInfos.isObligatory ? "checked" : ""}>
                            <label class="form-check-label" >حصة إلزامية</label>
                          </div>
                          <p>وقت بدء الحصة: <strong>${
                            studentDayInfos.start_time || "غير محدد"
                          }</strong><br>
                          عدد التلاميذ الحاضرين: <strong>${
                            project_db.exec(
                              `SELECT COUNT(*) FROM day_evaluations WHERE day_id = ${workingDayID} AND attendance = 1;`,
                            )[0].values[0][0]
                          }</strong><br>
                          ملاحظة اليوم: <em>${studentDayInfos.dayNote || "لا توجد ملاحظة"}</em><br>
                          </p>
                        </div>
                      `,
                      );
                    },
                  },
                  {
                    text: "❌ إلغاء اليوم",
                    action: async function () {
                      if (confirm("هل تريد إلغاء هذا اليوم ؟")) {
                        project_db.run(
                          `DELETE FROM day_evaluations WHERE day_id = ?;`,
                          [workingDayID],
                        );
                        project_db.run(
                          `DELETE FROM day_requirements WHERE day_id = ?;`,
                          [workingDayID],
                        );
                        project_db.run(
                          "DELETE FROM education_day WHERE id = ?;",
                          [workingDayID],
                        );
                        saveToIndexedDB(project_db.export());
                        getStudyDays();
                        loadDayStudentsList();
                      }
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      studentsDayTableDetailIsShow,
    );
  } catch (e) {
    window.showToast("error", "Error: " + e.message);
  }
}

async function InitDatePickers() {
  // day date picker
  // const script = document.createElement("script");
  // script.src = "src/flatpickr-hijri-calendar.js";
  // script.onload = () => {
  function formatHijriDate(date, isRange = false) {
    date.setHours(new Date().getHours());
    const formatter = new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
    });
    return `${formatter.format(date)} ${isRange ? "" : `(${DateTime.fromJSDate(date).hasSame(DateTime.now(), "day") ? "اليوم" : fromNow(date).replace("منذ", "قبل")})`}`;
  }
  dayDateInput._flatpickr = flatpickr(dayDateInput, {
    mode: "single",
    altInput: true,
    altFormat: "D j F",
    dateFormat: "Y-m-d",
    maxDate: "today",
    onDayCreate: async function (dObj, dStr, fp, dayElem) {
      if (specialDates.includes(fp.formatDate(dayElem.dateObj, "Y-m-d"))) {
        dayElem
          .querySelector(".flatpickr-hijri-date-date")
          .classList.add("fs-6", "fw-bold");
      } else {
        dayElem
          .querySelector(".flatpickr-hijri-date-date")
          .classList.remove("fs-6", "fw-bold");
      }
    },
    onChange: async function (selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        if (dateStr == new Date().toISOString().slice(0, 10)) {
          document
            .getElementsByClassName("date-icon")[0]
            .style.removeProperty("color");
        } else {
          document.getElementsByClassName("date-icon")[0].style.color =
            "#00ff4c";
        }
        workingDay = dateStr;
        // maximizeModalBtn.style.display = "none";
        await loadDayStudentsList();
        instance.altInput.value = formatHijriDate(selectedDates[0]);
      }
    },
    disableMobile: "true",
    locale: {
      ...flatpickr.l10ns.ar,
      firstDayOfWeek: 6,
    },
    plugins: [
      hijriCalendarPlugin(DateTime, {
        showHijriDates: true,
        showHijriToggle: false,
      }),
    ],
  });
  // statistics date picker
  const islamicDateFormatter = new Intl.DateTimeFormat(
    "ar-DZ-u-ca-islamic-umalqura",
    {
      day: "numeric",
    },
  );

  const getIslamicDayOfMonth = (date) =>
    parseInt(islamicDateFormatter.format(date));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(
    Math.min(today.getTime(), new Date(workingDay).getTime()),
  );
  const todayIslamicDay = getIslamicDayOfMonth(today);

  // Get current Islamic month start
  const currentMonthStart = new Date(today);
  currentMonthStart.setDate(today.getDate() - (todayIslamicDay - 1));

  // Get previous Islamic month dates
  const previousMonthEnd = new Date(currentMonthStart);
  previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);

  const previousMonthStartIslamicDay = getIslamicDayOfMonth(previousMonthEnd);
  const previousMonthStart = new Date(previousMonthEnd);
  previousMonthStart.setDate(
    previousMonthStart.getDate() - (previousMonthStartIslamicDay - 1),
  );

  const firstDayOfLastOctober = new Date(
    today.getMonth() < 10 ? today.getFullYear() - 1 : today.getFullYear(),
    9,
    1,
  );

  // Helper function for date manipulation
  const fp_incr = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Helper for getting last Saturday (week end in your logic)
  const getLastSaturday = (date) => {
    const result = new Date(date);
    const day = result.getDay(); // 0 = Sunday, 6 = Saturday
    result.setDate(result.getDate() - day + (day === 6 ? 0 : -1));
    return result;
  };

  const lastSaturday = getLastSaturday(today);
  const prevWeekSaturday = new Date(lastSaturday);
  prevWeekSaturday.setDate(prevWeekSaturday.getDate() - 7);

  statisticsDateInput._flatpickr = flatpickr(statisticsDateInput, {
    mode: "range",
    altInput: true,
    dateFormat: "Y-m-d",
    maxDate: "today",
    onDayCreate: async function (dObj, dStr, fp, dayElem) {
      if (specialDates.includes(fp.formatDate(dayElem.dateObj, "Y-m-d"))) {
        dayElem
          .querySelector(".flatpickr-hijri-date-date")
          .classList.add("fs-6", "fw-bold");
      } else {
        dayElem
          .querySelector(".flatpickr-hijri-date-date")
          .classList.remove("fs-6", "fw-bold");
      }
    },
    onChange: async function (selectedDates, dateStr, instance) {
      if (
        ![
          "اليوم",
          "أمس",
          "الأسبوع الحالي",
          "الأسبوع الماضي",
          "الشهر الحالي",
          "الشهر الماضي",
        ].includes(instance.altInput.value)
      )
        if (selectedDates.length === 2) {
          const startHijri = formatHijriDate(selectedDates[0], true);
          const endHijri = formatHijriDate(selectedDates[1], true);
          instance.altInput.value = `${startHijri} - ${endHijri}`;
        } else if (selectedDates.length === 1) {
          instance.altInput.value = formatHijriDate(selectedDates[0], true);
        }
      reinitStatisticTable();
    },
    disableMobile: "true",
    locale: {
      ...flatpickr.l10ns.ar,
      firstDayOfWeek: 6,
    },
    plugins: [
      hijriCalendarPlugin(DateTime, {
        showHijriDates: true,
        showHijriToggle: false,
      }),
      rangeFlatpickrPlugin,
    ],
    ranges: {
      اليوم: [endDate, endDate],
      "الأسبوع الحالي": [lastSaturday, endDate],
      "الأسبوع الماضي": [prevWeekSaturday, fp_incr(prevWeekSaturday, 6)],
      "الشهر الحالي": [currentMonthStart, endDate],
      "الشهر الماضي": [previousMonthStart, previousMonthEnd],
      "الموسم الحالي": [firstDayOfLastOctober, endDate],
    },
    rangesOnly: false, // only show the ranges menu unless the custom range button is selected
    rangesAllowCustom: true, // adds a Custom Range button to show the calendar
    rangesCustomLabel: "تخصيص",
  });
  getStudyDays();
  // };
  // document.body.appendChild(script);
}

function initializeToast() {
  window.showToast = function (type, message, delay = 4000, closeBtn = true) {
    if (!window._toastReady) {
      window._toastQueue.push({ message, type, delay, closeBtn });
      return;
    }
    window._realShowToast(message, type, delay, closeBtn);
  };

  function createToastElement(message, type, closeBtn) {
    const el = document.createElement("div");
    const bg =
      type === "error"
        ? "bg-danger text-white"
        : type === "success"
          ? "bg-success text-white"
          : type === "warning"
            ? "bg-warning text-dark"
            : "bg-info text-white";
    el.className = `toast ${bg} border-0`;
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    el.innerHTML = `
          <div class="d-flex">
            <div class="toast-body text-center">${message}</div>
            ${closeBtn ? `<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>` : ""}
          </div>
        `;
    return el;
  }
  window._realShowToast = function (
    message,
    type,
    delay = 4000,
    closeBtn = true,
  ) {
    if (!toastWrapper) {
      alert(message);
      return;
    }
    const el = createToastElement(message, type, closeBtn);
    toastWrapper.appendChild(el);

    if (window.bootstrap && typeof window.bootstrap.Toast === "function") {
      try {
        const bsToast = new bootstrap.Toast(el, { delay });
        bsToast.show();
        el.addEventListener("hidden.bs.toast", () => el.remove());
        return;
      } catch (err) {
        console.warn("bootstrap.Toast threw, falling back:", err);
      }
    }

    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 10);
    setTimeout(() => el.remove(), delay + 250);
  };

  window._toastReady = true;
  if (Array.isArray(window._toastQueue) && window._toastQueue.length) {
    window._toastQueue.forEach((t) =>
      window._realShowToast(t.message, t.type, t.delay),
    );
    window._toastQueue.length = 0;
  }
}

function initRequirementFields(detail = null) {
  if (detail) {
    requireBookInput.value = detail["الكتاب"];
    requireBookInput.dispatchEvent(new Event("change"));
    const Type = detail["النوع"];
    const startSurahName = detail["التفاصيل"].split(" ").at(0);
    const finishSurahName = detail["التفاصيل"].split(" ").at(-3);
    if (detail["الكتاب"] == "القرآن الكريم") {
      setOrGetOptionValueByText(firstSurahSelect, finishSurahName);
      firstAyahSelect.value =
        parseInt(detail["التفاصيل"].split(" ").at(-1)) + 1;
      if (!firstAyahSelect.value) {
        if (Type == "حفظ") {
          requirTypeInput.value = "حصيلة";
          firstAyahSelect.value = "1";
        } else {
          requirTypeInput.value = Type == "حصيلة" ? "حفظ" : "مراجعة";
          if (Type == "مراجعة" && startSurahName !== finishSurahName) {
            setOrGetOptionValueByText(firstSurahSelect, startSurahName);
          }
          firstSurahSelect.value =
            firstSurahSelect.options[firstSurahSelect.selectedIndex - 1].value;
          firstSurahSelect.dispatchEvent(new Event("change"));
        }
      } else {
        requirTypeInput.value = Type;
      }
      firstAyahSelect.dispatchEvent(new Event("change"));
    } else {
      requirTypeInput.value = Type;
      requirQuantityInput.value = "0";
    }
  } else {
    requireBookInput.value = "";
    requireBookInput.dispatchEvent(new Event("change"));
  }
  requirTeacherInput.value = "0";
}

window.editRequirement = function (button) {
  const row = button.closest("tr");
  if (addQuranSelectionBtn.innerText == "تحديث") {
    requirementsTable
      .querySelectorAll("tbody tr")
      .forEach(
        (r) =>
          (r.lastElementChild.querySelector(".btn-success").disabled = false),
      );
  } else addQuranSelectionBtn.innerText = "تحديث";
  row.lastElementChild.querySelector(".btn-success").disabled = true;
  requireBookInput.value = row.firstElementChild.textContent;
  // requireBookInput.dispatchEvent(new Event("change"));
  requirTypeInput.value = row.firstElementChild.nextElementSibling.textContent;
  // requirTypeInput.dispatchEvent(new Event("change"));
  const detail =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();

  if (requireBookInput.value == "القرآن الكريم") {
    const startSurahName = detail.split(" ").at(0);
    const finishSurahName = detail.split(" ").at(-3);
    setOrGetOptionValueByText(firstSurahSelect, startSurahName);
    setOrGetOptionValueByText(secondSurahSelect, finishSurahName);
    firstAyahSelect.value = detail.split(" ").at(2);
    secondAyahSelect.value = detail.split(" ").at(-1);
    secondAyahSelect.dispatchEvent(new Event("change"));
  } else {
    requirQuantityDetailInput.value = detail;
    requirQuantityInput.value =
      row.firstElementChild.nextElementSibling.nextElementSibling.textContent;
  }
  const saveStateErrors =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim() ||
    "0";
  saveStateErrorsInput.value = !saveStateErrors.includes("+")
    ? saveStateErrors
    : parseInt(saveStateErrors.split(" ")[0]) +
      parseInt(saveStateErrors.split(" ")[4]);
  saveStateAlertsInput.value =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim() ||
    "0";

  requirRepitInput.value =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim() ||
    "0";

  const teacherName =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();

  setOrGetOptionValueByText(requirTeacherInput, teacherName);
  setRequirEvalInput();
  requireBookInput.scrollIntoView();

  if (requirTeacherInput.value !== "0") {
    teachersPoints[requirTeacherInput.value] =
      (teachersPoints[requirTeacherInput.value] || 0) -
      Math.floor(parseFloat(requirQuantityInput.value));
  }

  addQuranSelectionBtn.onclick = () => {
    addRequirToTable(row);
    addQuranSelectionBtn.innerText = "إضافة";
    addQuranSelectionBtn.onclick = () => addRequirToTable();
  };
  studentDayModalElement.addEventListener(
    "hide.bs.modal",
    (event) => {
      addQuranSelectionBtn.innerText = "إضافة";
      addQuranSelectionBtn.onclick = () => addRequirToTable();
    },
    { once: true },
  );
};

window.removeRequirItem = function (button, student_id = null) {
  const row = button.closest("tr");
  const quantity =
    row.firstElementChild.nextElementSibling.nextElementSibling.textContent;
  const teacherName =
    row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();

  if (teacherName !== "المعلم") {
    teachersPoints[
      setOrGetOptionValueByText(requirTeacherInput, teacherName, true)
    ] =
      (teachersPoints[
        setOrGetOptionValueByText(requirTeacherInput, teacherName, true)
      ] || 0) - Math.floor(parseFloat(quantity));
  }
  row.remove();
  requirsMoyenneInput.value = calcRequirementsMoyenne();
  studentDayFormSubmitBtn.disabled = false;
  studentDayFormSubmitBtn.nextElementSibling.disabled = false;

  if (requirementsTable.rows.length >= 2) {
    initRequirementFields({
      الكتاب:
        requirementsTable.rows[requirementsTable.rows.length - 1]
          .firstElementChild.textContent,
      النوع:
        requirementsTable.rows[requirementsTable.rows.length - 1]
          .firstElementChild.nextElementSibling.textContent,
      التفاصيل:
        requirementsTable.rows[requirementsTable.rows.length - 1]
          .firstElementChild.nextElementSibling.nextElementSibling
          .nextElementSibling.textContent,
    });
  } else {
    requireBookInput.value = row.firstElementChild.textContent;
    requireBookInput.dispatchEvent(new Event("change"));
    requirTypeInput.value =
      row.firstElementChild.nextElementSibling.textContent;
    requirTypeInput.dispatchEvent(new Event("change"));
    const detail =
      row.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();

    const startSurahName = detail.split(" ").at(0);
    if (requireBookInput.value == "القرآن الكريم") {
      setOrGetOptionValueByText(firstSurahSelect, startSurahName);
      firstSurahSelect.dispatchEvent(new Event("change"));
      firstAyahSelect.value = detail.split(" ").at(2);
      firstAyahSelect.dispatchEvent(new Event("change"));
    }
    requirTeacherInput.value = "0";
  }
};

function addRequirToTable(row = false) {
  if (
    !requireBookInput.value ||
    !requirQuantityDetailInput.value ||
    !requirTypeInput.value ||
    !requirQuantityInput.value ||
    !requirEvaluationInput.value
  ) {
    window.showToast("error", "الرجاء إدخال الحقول اللازمة.");
    return;
  }
  const newRow = document.createElement("tr");
  const removeBtnId = `removeRequirBtn-${requirementsTable.querySelectorAll("tbody tr").length + 1}`;
  newRow.innerHTML = `
    <td>${requireBookInput.value}</td>
    <td>${requirTypeInput.value}</td>
    <td class="d-none">${requirQuantityInput.value}</td>
    <td style="white-space: normal;">${requirQuantityDetailInput.value}</td>
    <td>${requirEvaluationInput.value}</td>
    <td>
      ${saveStateErrorsInput.value}
    </td>
    <td>
      ${saveStateAlertsInput.value}
    </td>
    <td>
      ${requirMoyenneInput.value}
    </td>
    <td>
      ${requirTeacherInput.options[requirTeacherInput.selectedIndex].text}
    </td>
    <td>
      ${requirRepitInput.value}
    </td>
    <td>
    <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
      <button type="button" class="btn btn-success" onclick="editRequirement(this);"><i class="fa-solid fa-pen-to-square"></i></button>
      <button id="${removeBtnId}" class="btn btn-danger btn-sm"><i class="fa-solid fa-xmark"></i></button>
    </div>
    </td>`;
  if (!row) requirementsTable.querySelector("tbody").appendChild(newRow);
  else row.replaceWith(newRow);
  document.getElementById(removeBtnId).onclick = async (e) => {
    teachersPoints[requirTeacherInput.value] =
      teachersPoints[requirTeacherInput.value] -
      Math.floor(
        parseFloat(
          e.target.parentNode.parentNode.previousElementSibling
            .previousElementSibling.previousElementSibling
            .previousElementSibling.previousElementSibling
            .previousElementSibling.previousElementSibling.textContent,
        ),
      );
    removeRequirItem(e.target);
  };
  requirementsTable.scrollIntoView();
  if (requirTeacherInput.value !== "0") {
    teachersPoints[requirTeacherInput.value] =
      (teachersPoints[requirTeacherInput.value] || 0) +
      Math.floor(parseFloat(requirQuantityInput.value));
  }

  requirsMoyenneInput.value = calcRequirementsMoyenne();
  studentDayFormSubmitBtn.disabled = false;
  studentDayFormSubmitBtn.nextElementSibling.disabled = false;
  initRequirementFields({
    الكتاب: requireBookInput.value,
    النوع: requirTypeInput.value,
    التفاصيل: requirQuantityDetailInput.value,
  });
}

addQuranSelectionBtn.onclick = () => addRequirToTable();

// Evaluation Ladder
async function initEvaluationLaddersValues(db) {
  try {
    Object.assign(
      evaluationLaddersValues,
      JSON.parse(
        db.exec(
          "SELECT detail FROM evaluation_ladder ORDER BY rowid DESC LIMIT 1;",
        )[0].values[0],
      ),
    );
  } catch (error) {
    if (String(error).includes("no such table")) {
      db.run(
        `CREATE TABLE "evaluation_ladder" (
            "id"	integer NOT NULL,
            "detail"	text NOT NULL CHECK((JSON_VALID("detail") OR "detail" IS NULL)),
            PRIMARY KEY("id" AUTOINCREMENT)
          );
          INSERT INTO evaluation_ladder (detail) VALUES ('${JSON.stringify(
            evaluationLaddersValues,
          )}');
          -- 1. Create a temporary table with all current data
          CREATE TABLE education_day_backup AS 
          SELECT * FROM education_day;
          -- 2. Drop the original table
          DROP TABLE education_day;
          -- 3. Create new table with the foreign key
          CREATE TABLE education_day (
              "id"	integer NOT NULL,
              "date"	date NOT NULL,
              "time"	time NOT NULL,
              "notes"	text,
              "class_room_id"	bigint NOT NULL,
              -- New column with constraints
              evaluation_ladder_id INTEGER NOT NULL DEFAULT 1,
              -- Foreign key constraint
              CONSTRAINT "unique_education_day" UNIQUE("date","class_room_id"),
              PRIMARY KEY("id" AUTOINCREMENT),
              FOREIGN KEY("class_room_id") REFERENCES "class_rooms"("id") DEFERRABLE INITIALLY DEFERRED
                      
              FOREIGN KEY (evaluation_ladder_id) REFERENCES evaluation_ladder(id)
          );
          -- 4. Copy data from backup (excluding the new column)
          INSERT INTO education_day (id, date,time,notes,class_room_id)
          SELECT id, date,time,notes,class_room_id
          FROM education_day_backup;
          -- 5. Drop the backup table
          DROP TABLE education_day_backup;`,
      );
      saveToIndexedDB(db.export());
    }
  }
}

function populateEvalSelects() {
  for (const type of ["behavior", "clothing", "haircut"]) {
    const select = document.getElementById(type);
    select.innerHTML = "";
    for (const [key, value] of Object.entries(evaluationLaddersValues[type])) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      select.appendChild(option);
    }
    select.innerHTML += '<option value="0" selected>بدون تقييم</option>';
  }
}

function displayEvalLadder(evalLaddersValues = null) {
  if (!evalLaddersValues) evalLaddersValues = evaluationLaddersValues;
  document.getElementById("initialPresenceMark").value =
    evalLaddersValues.retard.initialPresenceMark;
  document.getElementById("retardPointsPerMinute").value =
    evalLaddersValues.retard.retardPointsPerMinute;
  document.getElementById("requirReducePerRepit").value =
    evalLaddersValues.requirments?.requirReducePerRepit || 10;
  document.getElementById("requirReducePerAlert").value =
    evalLaddersValues.requirments?.requirReducePerAlert || 2;
  for (const type of ["behavior", "clothing", "haircut"]) {
    const list = document.getElementById(type + "-marksList");
    list.innerHTML = "";

    for (const [key, value] of Object.entries(evalLaddersValues[type])) {
      const item = document.createElement("div");
      item.className = "input-group mb-3";
      item.innerHTML = `
                    <input type="text" class="form-control text-center px-0 w-25" id="${type}_key-${key}" value="${key}" placeholder="Mark name">
                    <input type="number" class="form-control text-center px-0" id="${type}_value-${key}" value="${value}" placeholder="Value">
                    <button class="btn btn-danger px-1" onclick="removeEvalLadder('${type}','${key}')">حذف</button>
                `;
      list.appendChild(item);
    }
  }
}

function updateEvalLadder() {
  const newLadders = {
    retard: {
      initialPresenceMark: document.getElementById("initialPresenceMark").value,
      retardPointsPerMinute: document.getElementById("retardPointsPerMinute")
        .value,
    },
    requirments: {
      requirReducePerRepit: document.getElementById("requirReducePerRepit")
        .value,
      requirReducePerAlert: document.getElementById("requirReducePerAlert")
        .value,
    },
  };
  for (const type of ["behavior", "clothing", "haircut"]) {
    const oldLadders = Object.keys(evaluationLaddersValues[type]);
    newLadders[type] = {};

    for (const oldKey of oldLadders) {
      const keyInput = document.getElementById(`${type}_key-${oldKey}`);
      const valueInput = document.getElementById(`${type}_value-${oldKey}`);

      if (keyInput && valueInput) {
        const newKey = keyInput.value.trim().toLowerCase();
        const newValue = parseFloat(valueInput.value);

        if (newKey && !isNaN(newValue)) {
          newLadders[type][newKey] = newValue;
        }
      }
    }
  }
  Object.keys(evaluationLaddersValues).forEach(
    (key) => delete evaluationLaddersValues[key],
  );
  Object.assign(evaluationLaddersValues, newLadders);

  project_db.run(
    `INSERT INTO evaluation_ladder (detail) VALUES ('${JSON.stringify(
      evaluationLaddersValues,
    )}');`,
  );
  saveToIndexedDB(project_db.export());
  displayEvalLadder();
  // hideMaximizeModalBtn();

  window.showToast("info", "تم تحديث سلم النقيط بنجاح!");
}

function addEvalLadder(type) {
  const markName = prompt("اسم الملاحظة:");
  if (markName && markName.trim()) {
    const trimmedName = markName.trim().toLowerCase();
    if (evaluationLaddersValues[type].hasOwnProperty(trimmedName)) {
      alert("هذه الملاحظة موجودة من قبل!");
      return;
    }
    const markValue = prompt(`أدخل القيمة`, "0");
    if (markValue !== null && !isNaN(markValue)) {
      evaluationLaddersValues[type][trimmedName] = parseFloat(markValue);
      displayEvalLadder();
    }
  }
}

window.removeEvalLadder = function (type, key) {
  if (Object.keys(evaluationLaddersValues[type]).length > 2) {
    delete evaluationLaddersValues[type][key];
    displayEvalLadder();
  }
};

async function initBullentinConfigs() {
  const resumePagesCheck = localStorage.getItem("bulletinResumPage");
  const signatureCheck = localStorage.getItem("bulletinSignature");
  if (resumePagesCheck) resumePagesCheck.checked = resumePagesCheck === "true";
  if (signatureCheck) signatureCheck.checked = signatureCheck === "true";
}

async function showTab(tabId = null) {
  if (!tabId) tabId = currentTabId || "pills-home";
  currentTabId = tabId;
  document
    .querySelectorAll(".tab-pane:not(#statisticsTabContent .tab-pane)")
    .forEach((el) => el.classList.remove("show", "active"));
  document.getElementById(tabId).classList.add("show", "active");

  if (tabId === "pills-splash") {
    nav_bar.style.display = "none";
  } else if (tabId === "pills-home") {
    tabTitleLabel.innerText = "الرئيسية";
    await loadClassRoomsList();
  } else if (tabId === "pills-preferences") {
    tabTitleLabel.innerText = "التفضيلات";
    if (!document.getElementById("behavior-marksList").innerHTML) {
      displayEvalLadder(
        JSON.parse(
          project_db.exec(
            "SELECT detail FROM evaluation_ladder ORDER BY rowid DESC LIMIT 1;",
          )[0]?.values[0] || null,
        ),
      );
    }
    if (
      loginStatus.innerHTML.includes("progress-bar") ||
      loginStatus.innerText.includes("لايوجد اتصال بالانترنيت")
    ) {
      if (navigator.onLine) initAuth();
      else loginStatus.innerHTML = "<p>لايوجد اتصال بالانترنيت</p>";
    }
  } else if (workingClassroomId) {
    if (tabId === "pills-students") {
      tabTitleLabel.innerText = "الطلبة";
      await loadStudentsList();
      newStudentInfosForm.reset();
      studentIdInput.value = "";
    } else if (tabId === "pills-new_day") {
      tabTitleLabel.innerText = "التقييم";
      dayDateInput._flatpickr.setDate(workingDay, true);
      if (maximizeModalBtn.style.display === "none") studentDayModal.hide();
    } else if (tabId === "pills-statistics") {
      tabTitleLabel.innerText = "الإحصائيات";
      fillStatistiscStudentsList();
      if (devMode && 4 == 5)
        showStudentsBulletins(
          [
            "2026-02-20",
            "2026-02-21",
            "2026-02-25",
            "2026-02-26",
            "2026-02-27",
            "2026-02-28",
            "2026-03-02",
            "2026-03-03",
            "2026-03-04",
          ],
          // "83,82,84",
          // "43,76",
        );
    }
  } else {
    showTab("pills-home");
    window.showToast("warning", "الرجاء إختيار قسم.");
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function getDatesInRange() {
  const result = project_db.exec(
    `SELECT date FROM education_day WHERE class_room_id = ${workingClassroomId};`,
  );
  if (result.length && result[0].values.length) {
    const selectedDates = statisticsDateInput._flatpickr.selectedDates;
    if (selectedDates.length < 2) return [];
    const startDate = DateTime.fromJSDate(selectedDates[0])
      .startOf("day")
      .toJSDate();
    const endDate = DateTime.fromJSDate(selectedDates[1])
      .startOf("day")
      .toJSDate();

    return [
      result[0].values
        .map((row) => row[0])
        .filter((dateStr) => {
          const currentDate = new Date(dateStr);
          currentDate.setHours(0, 0, 0, 0);
          return currentDate >= startDate && currentDate <= endDate;
        }),
      startDate.getMonth() == endDate.getMonth() &&
        startDate.getFullYear() == endDate.getFullYear() &&
        startDate.getDate() == 1 &&
        endDate.getDate() ==
          new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate(),
    ];
  }
  return [[], null];
}

statisticType.onchange = async function () {
  document
    .querySelectorAll("#statisticsTabContent .tab-pane")
    .forEach((el) => el.classList.remove("show", "active"));
  document.getElementById("verse-grid").innerHTML = "";
  switch (this.value) {
    case "attendance":
      if (!statisAllCheckbox) fillStatistiscStudentsList();
      await showLoadingModal("جاري تحميل الإحصائيات");
      document
        .getElementById("statisticsTable-tab-pane")
        .classList.add("show", "active");
      showAttendanceStatistics();
      hideLoadingModal();
      break;
    case "results":
      if (!statisAllCheckbox) fillStatistiscStudentsList();
      await showLoadingModal("جاري تحميل الإحصائيات");
      document
        .getElementById("statisticsTable-tab-pane")
        .classList.add("show", "active");
      showResultsStatistics();
      hideLoadingModal();
      break;
    case "avance_chart":
      if (statisAllCheckbox) fillStatistiscStudentsList(true);
      await showLoadingModal("جاري تحميل الإحصائيات");
      document
        .getElementById("avance_chart-tab-pane")
        .classList.add("show", "active");
      showAvanceChart();
      hideLoadingModal();
      break;
    default:
      if (!statisAllCheckbox) fillStatistiscStudentsList();
      document.getElementById("empty-tab-pane").classList.add("show", "active");
      if ($.fn.DataTable.isDataTable("#statisticsTable")) {
        $("#statisticsTable").DataTable().destroy();
        $("#statisticsTable").empty();
      }
  }
};

async function reinitStatisticTable() {
  statisticType.value = "0";
  statisticType.dispatchEvent(new Event("change"));
}

// statistics students list
async function fillStatistiscStudentsList(uniqueStudent = false) {
  if (!project_db) {
    window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
    return;
  }
  try {
    const results = project_db.exec(
      "SELECT id,fname,lname FROM students WHERE class_room_id = ?;",
      [workingClassroomId],
    );
    const data = [];
    if (results.length) {
      const result = results[0];
      const dropdown = document.querySelector(".statisticsStudentsMenu");
      dropdown.innerHTML =
        `<button id="fillStudentOkBtn" class="btn btn-sm btn-secondary mb-2 w-100">موافق</button>` +
        (!uniqueStudent
          ? `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="statisAllCheckbox" onchange="statisStudentToggleAll()" checked>
            <label class="form-check-label">الجميع</label>
        </div>
        <hr class="my-0">`
          : "");
      document.getElementById("fillStudentOkBtn").onclick = () =>
        statisticType.dispatchEvent(new Event("change"));
      statisAllCheckbox = document.getElementById("statisAllCheckbox");
      result.values.forEach((row) => {
        const newItem = document.createElement("div");
        newItem.className = "form-check";
        newItem.innerHTML = `
                      <input class="form-check-input statisStudentItem" ${
                        !uniqueStudent
                          ? `type="checkbox"`
                          : `type="radio" name="radioDefault"`
                      } value="${row[0]}" checked>
                      <label class="form-check-label">${
                        row[result.columns.indexOf("fname")] +
                        " " +
                        row[result.columns.indexOf("lname")]
                      }</label>
                  `;
        dropdown.append(newItem);
      });
    }
  } catch (e) {
    window.showToast("warning", "Error: " + e.message);
  }
}

function statisStudentToggleAll() {
  document.querySelectorAll(".statisStudentItem").forEach((item) => {
    item.checked = statisAllCheckbox.checked;
  });
  reinitStatisticTable();
}

function statisStudentUpdateAll() {
  const items = document.querySelectorAll(".statisStudentItem");
  const allChecked =
    items.length ===
    document.querySelectorAll(".statisStudentItem:checked").length;
  if (statisAllCheckbox) statisAllCheckbox.checked = allChecked;
  reinitStatisticTable();
}

function getStatisticsSelectedStudentsId() {
  const selected = Array.from(
    document.querySelectorAll(".statisStudentItem:checked"),
  ).map((item) => item.value);
  return selected.join(", ");
}

async function showStudentsBulletins(dates, studentsIDS = null) {
  const studentsList = studentsIDS || getStatisticsSelectedStudentsId();
  if (!studentsList) {
    window.showToast("warning", "يرجى اخيار طلاب من القائمة.");
    return;
  }

  const usedevaluationLaddersValues = {};
  const studentsAppends = localStorage.getItem("studentsAppends")
    ? JSON.parse(localStorage.getItem("studentsAppends"))
    : {};

  const tableWithins = {
    resumePagesChecked: resumePagesCheck.checked,
    withinSignature: signatureCheck.checked,
  };

  try {
    const attendanceRes = {};
    project_db
      .exec(
        `
      WITH ${dates
        .map(
          (date, index) =>
            `day_id${index} AS ( SELECT id FROM education_day WHERE date = '${date}' )`,
        )
        .join(",\n")}
      SELECT
          s.id,
          -- مجموع الحضور (Total Present Days Count)
          (${dates
            .map(
              (_, index) =>
                `CASE WHEN de${index}.attendance = 0 THEN 1 ELSE 0 END`,
            )
            .join(" +\n        ")}) as "المجموع (/${dates.length})"
      FROM students s
      ${dates
        .map(
          (date, index) =>
            `LEFT JOIN day_evaluations de${index} ON s.id = de${index}.student_id AND de${index}.day_id IN (SELECT id FROM day_id${index})`,
        )
        .join("\n")}
      WHERE s.id in (${studentsList})
      GROUP BY s.id
      ORDER BY s.id;`,
      )[0]
      .values.forEach((row) => {
        const studentId = row[0];
        const totalPresent = row[1];
        attendanceRes[studentId] = dates.length - totalPresent;
      });

    // Get all student IDs from the table
    const dateCtes = dates
      .map(
        (date, index) =>
          `day_id${index} AS ( SELECT id FROM education_day WHERE date = '${date}' )`,
      )
      .join(", \n");

    // Generate sum expressions for المجموع
    const sumExpressions = dates
      .map(
        (date, index) =>
          `(SELECT COALESCE(SUM(de.moyenne), 0) FROM day_evaluations de 
          WHERE de.student_id = s.id AND de.day_id IN (SELECT id FROM day_id${index}))
          + 
          (SELECT COALESCE(SUM(dr.moyenne), 0) FROM day_requirements dr 
          WHERE dr.student_id = s.id AND dr.day_id IN (SELECT id FROM day_id${index}))
        `,
      )
      .join(" +\n        ");

    const results = project_db.exec(`
      WITH ${dateCtes}
      SELECT 
      s.id, s.fname, s.lname,
          -- المجموع (sum)
          COALESCE( ROUND(
              (${sumExpressions})
          , 2), 0 )  as "المجموع"
      FROM students s 
      LEFT JOIN day_evaluations de ON s.id = de.student_id 
      LEFT JOIN day_requirements dr ON dr.student_id = s.id 
      WHERE s.id in (${studentsList})
      GROUP BY s.id, s.fname, s.lname
      ORDER BY fname, lname;
      `);

    if (!results.length || !results[0].values.length) {
      window.showToast("warning", "لا يوجد طلاب في هذا القسم.");
      return;
    }

    let students = results[0].values.map((row) => {
      const name = `${row[1]} ${row[2]}`;
      const fullAddedPoints = studentsAppends[name]?.points || 0;
      const order = (
        (row[3] + fullAddedPoints) /
        attendanceRes[row[0]]
      ).toFixed(2);
      return {
        id: row[0],
        name: name,
        order: order,
      };
    });

    students = [...students]
      .sort((a, b) => parseFloat(b.order) - parseFloat(a.order))
      .reduce((acc, item, index, arr) => {
        const rank =
          index === 0 ||
          parseFloat(item.order) !== parseFloat(arr[index - 1].order)
            ? index + 1
            : acc[acc.length - 1].order;
        acc.push({ ...item, order: rank.toString() });
        return acc;
      }, []);

    // Collect data for all students
    const allStudentData = [];
    for (const student of students) {
      const studentData = await getStudentData(student.id, dates);
      if (studentData.length > 0) {
        allStudentData.push({
          studentId: student.id,
          studentName: student.name,
          studentOrder: student.order,
          data: studentData,
        });
      }
    }

    if (allStudentData.length === 0) {
      window.showToast("warning", "لا توجد بيانات للطلاب في هذه الفترة.");
      return;
    }

    project_db
      .exec(
        `
      SELECT ed.date, el.detail FROM evaluation_ladder el
      LEFT JOIN education_day ed ON el.id = ed.evaluation_ladder_id
      WHERE class_room_id=${workingClassroomId} AND date in (${dates.map((date) => `'${date}'`).join(", ")}) ;
      `,
      )[0]
      .values.forEach((row) => {
        usedevaluationLaddersValues[row[0]] = JSON.parse(row[1]);
      });

    // Create single PDF with all students
    createMultiStudentPDF(allStudentData, dates);
  } catch (error) {
    console.error("Error generating PDF:", error);
    window.showToast("warning", "حدث خطأ في إنشاء كشوف النقاط");
  }

  // Get data for a single student
  async function getStudentData(studentId, dates) {
    const dateList = dates.map((date) => `'${date}'`).join(", ");

    const query = `
        SELECT 
            ed.date as day,
            s.fname || ' ' || s.lname as student_name,
            dr.detail,
            de.prayer,
            de.haircut,
            de.behavior,
            de.clothing,
            de.retard,
            de.attendance,
            de.added_points,
            dr.moyenne as requirements_score,
            de.moyenne as evaluation_score
        FROM education_day ed
        LEFT JOIN day_requirements dr ON ed.id = dr.day_id AND dr.student_id = ${studentId}
        LEFT JOIN day_evaluations de ON ed.id = de.day_id AND de.student_id = ${studentId}
        LEFT JOIN students s ON s.id = ${studentId}
        WHERE ed.date IN (${dateList})
        AND ed.class_room_id = ${workingClassroomId}
        ORDER BY ed.date
    `;

    const results = project_db.exec(query);
    if (!results.length) return [];

    const result = results[0];
    const columns = result.columns;
    const values = result.values;

    return values.map((row) => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  // Create multi-student PDF with one student per page
  function createMultiStudentPDF(allStudentData, dates) {
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    const content = [];

    // First, collect all student data lengths and create pairs
    const studentPages = createStudentPagesWithPairs(allStudentData);

    // Create content for each page
    studentPages.forEach((pageStudents, pageIndex) => {
      if (pageIndex > 0) {
        content.push({ text: "", pageBreak: "before" });
      }

      // Create stacked students (one under another)
      const pageContent = [];
      pageStudents.forEach((studentReport, studentIndex) => {
        if (studentIndex > 0) {
          // Add separator between students (except for the first one)
          content.push({
            text: "ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ",
            bold: true,
            absolutePosition: {
              y: 841.89 / 2 - 7,
              x: 20,
            },
          });
        }

        // Add student content
        if (studentReport) {
          pageContent.push(
            ...createStudentContent(
              studentReport,
              dates,
              studentIndex > 0,
              pageStudents.length > 1,
            ),
          );
        }
      });

      content.push(...pageContent);
    });

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 0, 20, 0],
      pageOrientation: "portrait",
      content: content,
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          // color: "#2c3e50",
        },
        subheader: {
          fontSize: 10,
          bold: true,
          // color: "#34495e",
          margin: [0, 2, 0, 2],
        },
        tableHeader: {
          fontSize: 8,
          bold: true,
          // color: "#2c3e50",
          fillColor: "#ecf0f1",
        },
        tableCell: {
          fontSize: 8,
          lineHeight: 1.1,
        },
        summary: {
          fontSize: 10,
          bold: true,
          margin: [0, 8, 0, 4],
          // color: "#2c3e50",
        },
      },
      defaultStyle: {
        alignment: "right",
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  // Create student pages by first collecting all data lengths and pairing students with <10 records
  function createStudentPagesWithPairs(allStudentData) {
    // Create arrays for students with less than 10 records and those with 10 or more
    const studentsWithFewRecords = [];
    const studentsWithManyRecords = [];

    // First pass: categorize all students by their data length
    allStudentData.forEach((studentReport) => {
      const studentDataRecordsLength = studentReport.data
        .map((i) => JSON.parse(i.detail)?.length ?? 1)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      if (tableWithins.resumePagesChecked && studentDataRecordsLength <= 20) {
        studentsWithFewRecords.push(studentReport);
      } else if (studentDataRecordsLength < 52) {
        studentsWithManyRecords.push(studentReport);
      } else {
        throw new Error("عدد الصفوف تجاوز الحد الأقصى");
      }
    });

    const pages = [];

    // Pair students with few records (2 per page)
    for (let i = 0; i < studentsWithFewRecords.length; i += 2) {
      if (i + 1 < studentsWithFewRecords.length) {
        // Pair two students on one page
        pages.push([studentsWithFewRecords[i], studentsWithFewRecords[i + 1]]);
      } else {
        // Last student with few records (odd number)
        pages.push([studentsWithFewRecords[i], null]);
      }
    }

    // Add students with many records (1 per page)
    studentsWithManyRecords.forEach((studentReport) => {
      pages.push([studentReport]);
    });

    return pages;
  }

  // Create student content (reusable for both single and stacked layouts)
  function createStudentContent(
    studentReport,
    dates,
    isSecond,
    isStacked = false,
  ) {
    const { data, studentName, studentOrder, studentId } = studentReport;
    const recordCounts =
      data
        .map((i) => {
          return i.detail ? JSON.parse(i.detail).length : 1;
        })
        .reduce((accumulator, current) => accumulator + current, 0) + 3;
    const tableCellHeight = isStacked ? 5 : 33 - recordCounts / 2;
    const tableBody = createTableBody(data, tableCellHeight / 3, isStacked);

    const content = [
      // Student header
      {
        text: reverseArabicWords(
          `تقرير  متابعة الطالب${isGirls ? "ة" : ""} في حفظ القرآن الكريم`,
        ),
        style: "header",
        alignment: "center",
        fontSize: isStacked ? 14 : 14,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 15,
        },
      },
      {
        text: reverseArabicWords(`الطالب${isGirls ? "ة" : ""}: ${studentName}`),
        style: "subheader",
        alignment: "right",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
        },
      },
      {
        text: reverseArabicWords(
          workingClassroomSelect.selectedOptions[0].text
            .split("-")
            .slice(0, 2)
            .join(" -") + "-",
        ),
        style: "subheader",
        alignment: "center",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
        },
      },
      {
        text: reverseArabicWords(
          `حرر  يوم: ${new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          }).format()}`,
        ),
        style: "subheader",
        alignment: "left",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
          x: 18,
        },
      },
      // Table
      {
        table: {
          headerRows: 2,
          heights: tableCellHeight,
          widths: [32, 26, 30, 30, 20, 50, 35, 218, 35, 20],
          body: tableBody,
        },
        absolutePosition: {
          y:
            (isStacked
              ? 841.89 / 4 + (isSecond ? 841.89 / 2 : 0) - 10
              : 841.89 / 2 -
                (recordCounts <= 25 ? -1.5 * recordCounts : recordCounts / 2)) -
            (recordCounts / (isStacked ? 2 : recordCounts)) *
              (isStacked ? 13 : 345),
          x: 18,
        },
        layout: {
          paddingLeft: function (i, node) {
            return 3;
          },
          paddingRight: function (i, node) {
            return 3;
          },
          hLineWidth: function (i, node) {
            return 0.3;
          },
          vLineWidth: function (i, node) {
            return 0.3;
          },
          hLineColor: function (i, node) {
            return "#aaaaaa";
          },
          vLineColor: function (i, node) {
            return "#aaaaaa";
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#f8f9fa" : null;
          },
        },
        margin: [0, 0, 0, 8],
      },

      // Summary section
      ...createCompactSummarySection(data, studentOrder, isSecond, isStacked),
    ];

    return content;
  }

  // Create compact table body for stacked layout
  function createTableBody(studentData, marginTop, isStacked = false) {
    // Arabic headers - two rows for date
    const topHeaderRows = [
      {
        text: "المجموع",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop * 4,
        marginBottom: -2,
        rowSpan: 2,
      },
      {
        text: "التقييم",
        style: "tableHeader",
        alignment: "center",
        colSpan: 4,
        marginTop: marginTop,
        marginBottom: -2,
      },
      {},
      {},
      {},
      {
        text: "المطلوب",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
        colSpan: 3,
      },
      {},
      {},
      {
        text: "اليوم",
        style: "tableHeader",
        alignment: "center",
        colSpan: 2,
        rowSpan: 2,
        marginTop: marginTop * 4,
        marginBottom: -2,
      },
      {}, // empty for the second part of date
    ];
    const headerRows = [
      {},
      {
        text: "إضافية",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "الهندام",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "السلوك",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "التأخر",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "التقدير",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "المقدار",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "التفصيل",
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "اليوم",
        style: "tableHeader",
        alignment: "center",
        colSpan: 2,
        marginTop: marginTop,
        marginBottom: -2,
      },
      {}, // empty for the second part of date
    ];

    // Group records by month and year
    const groupedRecords = groupRecordsByMonthYear(studentData);

    // Create table body
    const body = [];

    groupedRecords.forEach((monthGroup) => {
      const { monthYear, records } = monthGroup;
      const monthRowSpan = calculateMonthRowSpan(records);
      const monthMarginTop =
        marginTop + (isStacked ? 10 : marginTop * 3) * (monthRowSpan / 2);

      records.forEach((record, recordIndex) => {
        const day = new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          day: "numeric",
          weekday: "short",
        })
          .format(new Date(record.day))
          .replace("،", "");

        // Handle absence
        if (record.attendance !== 1) {
          const row = createEmptyArray(10); // Create array with correct number of columns

          // Set values for the row (RTL order - from right to left)
          const baseIndex = 9;

          row[baseIndex] =
            recordIndex === 0
              ? {
                  text: monthYear,
                  style: "tableCell",
                  alignment: "center",
                  rowSpan: monthRowSpan,
                  margin: [-2, monthMarginTop, -1, -3],
                }
              : {};

          row[baseIndex - 1] = {
            text: day,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          row[0] = {
            text:
              "غــــــــــــــــــــــــــــــــــــائــــــــــــــــــب" +
              (isGirls ? "ــــــة" : ""),
            style: "tableCell",
            alignment: "center",
            bold: true,
            colSpan: 8,
            margin: [0, marginTop, 0, -2],
          };

          body.push(row);
          return;
        }

        record.detail = JSON.parse(record.detail || "[]");
        const recordDetailLength = record.detail.length;
        const clothingValue =
          Object.keys(usedevaluationLaddersValues[record.day].clothing).find(
            (k) =>
              usedevaluationLaddersValues[record.day].clothing[k] ===
              record.clothing,
          ) || "-";

        const behaviorValue =
          Object.keys(usedevaluationLaddersValues[record.day].behavior).find(
            (k) =>
              usedevaluationLaddersValues[record.day].behavior[k] ===
              record.behavior,
          ) || "-";

        const retardOption =
          parseInt(record.retard) > 0
            ? `${parseInt(record.retard)}  د`
            : "بلا  تأخر";

        if (recordDetailLength < 2) {
          const row = createEmptyArray(10);
          const baseIndex = 9;

          // Month (only for first record in month group)
          row[baseIndex] =
            recordIndex === 0
              ? {
                  text: monthYear,
                  style: "tableCell",
                  alignment: "center",
                  rowSpan: monthRowSpan,
                  margin: [-2, monthMarginTop, -1, -3],
                }
              : {};

          // Day
          row[baseIndex - 1] = {
            text: day,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // Details
          row[baseIndex - 2] = {
            text: formatDetail(record.detail[0]),
            style: "tableCell",
            alignment: "right",
            margin: [0, marginTop, 0, -2],
          };
          row[baseIndex - 3] = {
            text: recordDetailLength ? formatQuantity(record.detail[0]) : "-",
            style: "tableCell",
            alignment: "center",
            margin: [-3, marginTop, -3, -2],
          };
          row[baseIndex - 4] = {
            text: recordDetailLength ? formatEval(record.detail[0]) : "-",
            style: "tableCell",
            bold: true,
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // retard
          row[baseIndex - 5] = {
            text: retardOption,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // Behavior
          const behaviorIndex = baseIndex - 6;
          row[behaviorIndex] = {
            text: behaviorValue,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // Clothing
          const clothingIndex = baseIndex - 7;
          row[clothingIndex] = {
            text: clothingValue,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // Additional points
          const pointsIndex = baseIndex - 8;
          row[pointsIndex] = {
            text: record.added_points ? record.added_points : "-",
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          // day moyenne points
          row[baseIndex - 9] = {
            text: (
              (record.requirements_score || 0) + (record.evaluation_score || 0)
            ).toFixed(2),
            bold: true,
            style: "tableCell",
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          body.push(row);
        } else {
          const marginTopMulti =
            marginTop +
            (isStacked ? 7 : marginTop * 3) *
              (recordDetailLength / (isStacked ? 1.5 : 2.5));
          // For multiple details, create multiple rows
          record.detail.forEach((detail, detailIndex) => {
            const row = createEmptyArray(10);
            const baseIndex = 9;

            // Month (only for first record and first detail in month group)
            row[baseIndex] =
              recordIndex === 0 && detailIndex === 0
                ? {
                    text: monthYear,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: monthRowSpan,
                    margin: [-2, monthMarginTop, -1, -3],
                  }
                : {};

            // Day (only for first detail in the record)
            row[baseIndex - 1] =
              detailIndex === 0
                ? {
                    text: day,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            // Detail
            row[baseIndex - 2] = {
              text: formatDetail(detail),
              style: "tableCell",
              alignment: "right",
              margin: [0, marginTop, 0, -2],
            };
            row[baseIndex - 3] = {
              text: formatQuantity(detail),
              style: "tableCell",
              alignment: "center",
              margin: [-3, marginTop, -3, -2],
            };
            row[baseIndex - 4] = {
              text: formatEval(detail) || "-",
              style: "tableCell",
              bold: true,
              alignment: "center",
              margin: [-2, marginTop, -2, -2],
            };

            // retard
            row[baseIndex - 5] =
              detailIndex === 0
                ? {
                    text: retardOption,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            // Behavior (only for first detail)
            const behaviorIndex = baseIndex - 6;
            row[behaviorIndex] =
              detailIndex === 0
                ? {
                    text: behaviorValue,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            // Clothing (only for first detail)
            const clothingIndex = baseIndex - 7;
            row[clothingIndex] =
              detailIndex === 0
                ? {
                    text: clothingValue,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            // Additional points (only for first detail)
            const pointsIndex = baseIndex - 8;
            row[pointsIndex] =
              detailIndex === 0
                ? {
                    text: record.added_points ? record.added_points : "-",
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            // day moyenne  (only for first detail)
            const moyenneIndex = baseIndex - 9;
            row[moyenneIndex] =
              detailIndex === 0
                ? {
                    text: (
                      (record.requirements_score || 0) +
                      (record.evaluation_score || 0)
                    ).toFixed(2),
                    bold: true,
                    style: "tableCell",
                    alignment: "center",
                    rowSpan: recordDetailLength,
                    margin: [-2, marginTopMulti, -2, -2],
                  }
                : {};

            body.push(row);
          });
        }
      });
    });

    const fullAddedPoints =
      studentsAppends[studentData[0].student_name]?.points || 0;
    const totalDays =
      studentData.length -
      studentData.filter((record) => record.attendance == 0).length;
    const validRecords = studentData.filter(
      (record) => record.attendance !== null,
    );

    if (totalDays === 0) return [];

    const total = validRecords.reduce(
      (sum, record) =>
        sum + (record.requirements_score || 0) + (record.evaluation_score || 0),
      0,
    );
    const resultRows = [
      {
        text: total.toFixed(2),
        style: "tableHeader",
        alignment: "center",
        marginTop: marginTop,
        marginBottom: -2,
        marginRight: -3,
        fontSize: 9,
        border: [true, true, false, true],
      },
      {
        text: "المجموع العام:",
        style: "tableHeader",
        alignment: "left",
        border: [false, true, true, true],
        fontSize: 9,
        marginTop: marginTop,
        marginBottom: -2,
        marginLeft: -3,
        colSpan: 2,
      },
      {},
      ...[
        fullAddedPoints > 0
          ? {
              text: fullAddedPoints,
              style: "tableHeader",
              alignment: "right",
              marginTop: marginTop,
              marginBottom: -2,
              border: [true, true, false, true],
            }
          : { border: [true, true, false, false], text: "" },
      ],
      ...[
        fullAddedPoints > 0
          ? {
              text: "رصيد إضافي:",
              style: "tableHeader",
              alignment: "left",
              marginTop: marginTop,
              marginLeft: -3,
              colSpan: 2,
              marginBottom: -2,
              border: [false, true, true, true],
            }
          : { colSpan: 2, border: [false, true, false, false], text: "" },
      ],
      {},
      { text: "", border: [false, true, false, false] },
      { text: "", border: [false, true, false, false] },
      { text: "", border: [false, true, false, false] },
      { text: "", border: [false, true, false, false] }, // empty for the second part of date
    ];

    return [topHeaderRows, headerRows, ...body, resultRows];
  }

  // Helper function to create an empty array with specified length
  function createEmptyArray(length) {
    return new Array(length).fill({});
  }

  // Helper function to group records by month and year
  function groupRecordsByMonthYear(studentData) {
    const groups = {};

    studentData.forEach((record) => {
      const recordDate = new Date(record.day);
      const monthYear = `${
        new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          year: "numeric",
        })
          .format(recordDate)
          .split(" ")[0]
      } ${reverseArabicWords(
        new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          month: "long",
        }).format(recordDate),
      )}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
    });

    // Convert to array and sort by date
    return Object.keys(groups)
      .map((monthYear) => ({
        monthYear,
        records: groups[monthYear].sort(
          (a, b) => new Date(a.day) - new Date(b.day),
        ),
      }))
      .sort((a, b) => new Date(a.records[0].day) - new Date(b.records[0].day));
  }

  // Helper function to calculate total rowSpan for a month group
  function calculateMonthRowSpan(records) {
    let totalRows = 0;

    records.forEach((record) => {
      if (record.attendance !== 1) {
        totalRows += 1; // Absent records take 1 row
      } else {
        // Parse detail if it's a string
        let detailArray = record.detail;
        if (typeof detailArray === "string") {
          try {
            detailArray = JSON.parse(detailArray);
          } catch (e) {
            detailArray = [detailArray];
          }
        }
        totalRows +=
          detailArray && Array.isArray(detailArray) ? detailArray.length : 1;
      }
    });

    return totalRows;
  }

  // Create compact summary section
  function createCompactSummarySection(
    studentData,
    studentOrder,
    isSecond,
    isStacked = false,
  ) {
    const totalDays = studentData.length;
    const validRecords = studentData.filter(
      (record) => record.attendance !== null,
    );

    if (totalDays === 0) return [];

    const fullAddedPoints =
      studentsAppends[studentData[0].student_name]?.points || 0;
    const presentDays = validRecords.filter(
      (record) => record.attendance === 1,
    ).length;

    const totalSaveQuantity = (
      validRecords.reduce(
        (sum, record) =>
          sum +
          (record.detail?.reduce(
            (acc, val) =>
              acc +
              (val["النوع"] === "حفظ" ? parseFloat(val["المقدار"] || 0) : 0),
            0,
          ) || 0),
        0,
      ) / 15
    ).toFixed(1);
    const totalReviseQuantity = (
      validRecords.reduce(
        (sum, record) =>
          sum +
          (record.detail?.reduce(
            (acc, val) =>
              acc +
              (val["النوع"] !== "حفظ" ? parseFloat(val["المقدار"] || 0) : 0),
            0,
          ) || 0),
        0,
      ) / 15
    ).toFixed(1);

    const totalQuantity =
      (totalSaveQuantity > 0 ? totalSaveQuantity + "  حفظ" : "") +
      (totalReviseQuantity > 0
        ? (totalSaveQuantity > 0 ? " و " : "") +
          totalReviseQuantity +
          "  مراجعة"
        : "");

    const total =
      validRecords.reduce(
        (sum, record) =>
          sum +
          (record.requirements_score || 0) +
          (record.evaluation_score || 0),
        0,
      ) + (fullAddedPoints || 0);
    const totalMoyenne =
      total /
      (totalDays -
        studentData.filter((record) => record.attendance == 0).length);

    const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);
    const fullNote = studentsAppends[studentData[0].student_name]?.note || "";

    // Full summary for single student view
    return [
      {
        text: reverseArabicWords("الملخص"),
        style: "summary",
        margin: [0, 5, 0, 8],
        alignment: "center",
        absolutePosition: {
          y:
            841.89 / (isStacked && !isSecond ? 2 : 1) -
            (tableWithins.withinSignature || fullNote ? 75 : 55),
        },
      },
      {
        table: {
          widths: [
            70,
            100,
            totalSaveQuantity > 0 && totalReviseQuantity > 0 ? 180 : 140,
            90,
            "*",
          ],
          body: [
            [
              {
                text: `الترتيب: ${studentOrder}/${
                  studentsList.split(",").length
                }`,
                style: "tableCell",
                bold: true,
                alignment: "center",
                border: [true, true, true, true],
                fontSize: 12,
                marginTop: 3,
              },
              {
                text: `المعدل العام: ${totalMoyenne.toFixed(2)}`,
                style: "tableCell",
                alignment: "center",
                bold: true,
                border: [true, false, false, false],
                fontSize: 10,
                marginTop: 3,
              },
              {
                text: `إجمالي الصفحات: ${totalQuantity}`,
                style: "tableCell",
                alignment: "center",
                border: [true, false, false, false],
                fontSize: 10,
                marginTop: 3,
              },
              {
                text: `نسبة  الحضور: ${attendanceRate}%`,
                style: "tableCell",
                alignment: "center",
                border: [true, false, false, false],
                fontSize: 10,
                marginTop: 3,
              },
              {
                text: `إجمالي  الأيام: ${totalDays}`,
                style: "tableCell",
                alignment: "center",
                border: [true, false, false, false],
                fontSize: 10,
                marginTop: 3,
              },
            ],
          ],
        },
        absolutePosition: {
          y:
            841.89 / (isStacked && !isSecond ? 2 : 1) -
            (tableWithins.withinSignature || fullNote ? 60 : 40),
          x: 18,
        },
        margin: [0, 0, 0, 5],
      },
      ...[
        fullNote
          ? {
              text: reverseArabicWords(`الملاحظة:  ${fullNote}`),
              margin: [0, 5, 0, 8],
              alignment: "right",
              absolutePosition: {
                y: 841.89 / (isStacked && !isSecond ? 2 : 1) - 25,
              },
            }
          : {},
      ],
      ...[
        tableWithins.withinSignature
          ? {
              text: reverseArabicWords("إمضاء الولي            ×"),
              margin: [0, 5, 0, 8],
              alignment: "left",
              fontSize: 10,
              absolutePosition: {
                y: 841.89 / (isStacked && !isSecond ? 2 : 1) - 25,
                x: 50,
              },
            }
          : {},
      ],
    ];
  }

  // Function to reverse words in a string (for Arabic)
  function reverseArabicWords(str) {
    return str.split(" ").reverse().join(" ");
  }

  function formatEval(detail) {
    const rating = detail["التقدير"];
    if (rating == 10) return "مــمــتــاز";
    if (rating >= 9) return "جــيــد  جــدا";
    if (rating >= 7) return "جـــيـــد";
    if (rating >= 6) return "حـــســـن";
    if (rating >= 5) return "مـتــوســط";
    return "دون  المتوسط";
  }

  function formatQuantity(detail) {
    if (detail["النوع"] == "حفظ") return detail["المقدار"] + "  سطر";
    else return (detail["المقدار"] / 15).toFixed(1) + "  صفحة";
  }

  function formatDetail(detail) {
    if (!detail) return "-";
    const errorsCount = detail["الأخطاء"].includes(" ")
      ? parseInt(detail["الأخطاء"].split(" ")[0]) +
        parseInt(detail["الأخطاء"].split(" ")[4])
      : parseInt(detail["الأخطاء"]);
    return (
      detail["النوع"] +
      " " +
      " ]  " +
      parseRequirment(detail["التفاصيل"], detail["الكتاب"], true) +
      " [ " +
      (detail["الكتاب"] !== "القرآن الكريم"
        ? ""
        : errorsCount > 0
          ? errorsCount == 1
            ? " بخطأ واحد"
            : " بأخطاء: " + errorsCount
          : " بدون أخطاء")
    );
  }
}

async function showStudentsBulletins2(dates, studentsIDS = null) {
  const studentsList = studentsIDS || getStatisticsSelectedStudentsId();
  if (!studentsList) {
    window.showToast("warning", "يرجى اخيار طلاب من القائمة.");
    return;
  }

  const studentsAppends = localStorage.getItem("studentsAppends")
    ? JSON.parse(localStorage.getItem("studentsAppends"))
    : {};

  try {
    const attendanceRes = {};
    project_db
      .exec(
        `
      WITH ${dates
        .map(
          (date, index) =>
            `day_id${index} AS ( SELECT id FROM education_day WHERE date = '${date}' )`,
        )
        .join(",\n")}
      SELECT
          s.id,
          -- مجموع الحضور (Total Present Days Count)
          (${dates
            .map(
              (_, index) =>
                `CASE WHEN de${index}.attendance = 0 THEN 1 ELSE 0 END`,
            )
            .join(" +\n        ")}) as "المجموع (/${dates.length})"
      FROM students s
      ${dates
        .map(
          (date, index) =>
            `LEFT JOIN day_evaluations de${index} ON s.id = de${index}.student_id AND de${index}.day_id IN (SELECT id FROM day_id${index})`,
        )
        .join("\n")}
      WHERE s.id in (${studentsList})
      GROUP BY s.id
      ORDER BY s.id;`,
      )[0]
      .values.forEach((row) => {
        const studentId = row[0];
        const totalPresent = row[1];
        attendanceRes[studentId] = dates.length - totalPresent;
      });

    // Get all student IDs from the table
    const dateCtes = dates
      .map(
        (date, index) =>
          `day_id${index} AS ( SELECT id FROM education_day WHERE date = '${date}' )`,
      )
      .join(", \n");

    // Generate sum expressions for المجموع
    const sumExpressions = dates
      .map(
        (date, index) =>
          `(SELECT COALESCE(SUM(de.moyenne), 0) FROM day_evaluations de 
          WHERE de.student_id = s.id AND de.day_id IN (SELECT id FROM day_id${index}))
          + 
          (SELECT COALESCE(SUM(dr.moyenne), 0) FROM day_requirements dr 
          WHERE dr.student_id = s.id AND dr.day_id IN (SELECT id FROM day_id${index}))
        `,
      )
      .join(" +\n        ");

    const results = project_db.exec(`
      WITH ${dateCtes}
      SELECT 
      s.id, s.fname, s.lname,
          -- المجموع (sum)
          COALESCE( ROUND(
              (${sumExpressions})
          , 2), 0 )  as "المجموع"
      FROM students s 
      LEFT JOIN day_evaluations de ON s.id = de.student_id 
      LEFT JOIN day_requirements dr ON dr.student_id = s.id 
      WHERE s.id in (${studentsList})
      GROUP BY s.id, s.fname, s.lname
      ORDER BY fname, lname;
      `);

    if (!results.length || !results[0].values.length) {
      window.showToast("warning", "لا يوجد طلاب في هذا القسم.");
      return;
    }

    let students = results[0].values.map((row) => {
      const name = `${row[1]} ${row[2]}`;
      const fullAddedPoints = studentsAppends[name]?.points || 0;
      const order = (
        (row[3] + fullAddedPoints) /
        attendanceRes[row[0]]
      ).toFixed(2);
      return {
        id: row[0],
        name: name,
        order: order,
      };
    });

    students = [...students]
      .sort((a, b) => parseFloat(b.order) - parseFloat(a.order))
      .reduce((acc, item, index, arr) => {
        const rank =
          index === 0 ||
          parseFloat(item.order) !== parseFloat(arr[index - 1].order)
            ? index + 1
            : acc[acc.length - 1].order;
        acc.push({ ...item, order: rank.toString() });
        return acc;
      }, []);

    // Collect data for all students
    const allStudentData = [];
    for (const student of students) {
      const studentData = await getStudentData(student.id, dates);
      if (studentData.length > 0) {
        allStudentData.push({
          studentId: student.id,
          studentName: student.name,
          studentOrder: student.order,
          data: studentData,
        });
      }
    }

    if (allStudentData.length === 0) {
      window.showToast("warning", "لا توجد بيانات للطلاب في هذه الفترة.");
      return;
    }

    // Create single PDF with all students
    createMultiStudentPDF(allStudentData, dates);
  } catch (error) {
    console.error("Error generating PDF:", error);
    window.showToast("warning", "حدث خطأ في إنشاء كشوف النقاط");
  }

  // Get data for a single student
  async function getStudentData(studentId, dates) {
    const dateList = dates.map((date) => `'${date}'`).join(", ");

    const query = `
        SELECT 
            ed.date as day,
            s.fname || ' ' || s.lname as student_name,
            dr.detail,
            de.prayer,
            de.haircut,
            de.behavior,
            de.clothing,
            de.retard,
            de.attendance,
            de.added_points,
            dr.moyenne as requirements_score,
            de.moyenne as evaluation_score
        FROM education_day ed
        LEFT JOIN day_requirements dr ON ed.id = dr.day_id AND dr.student_id = ${studentId}
        LEFT JOIN day_evaluations de ON ed.id = de.day_id AND de.student_id = ${studentId}
        LEFT JOIN students s ON s.id = ${studentId}
        WHERE ed.date IN (${dateList})
        AND ed.class_room_id = ${workingClassroomId}
        ORDER BY ed.date
    `;

    const results = project_db.exec(query);
    if (!results.length) return [];

    const result = results[0];
    const columns = result.columns;
    const values = result.values;

    return values.map((row) => {
      const obj = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  // Create multi-student PDF with one student per page
  function createMultiStudentPDF(allStudentData, dates) {
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    const content = [];

    // First, collect all student data lengths and create pairs
    const studentPages = createStudentPagesWithPairs(allStudentData);

    // Create content for each page
    studentPages.forEach((pageStudents, pageIndex) => {
      if (pageIndex > 0) {
        content.push({ text: "", pageBreak: "before" });
      }

      // Create stacked students (one under another)
      const pageContent = [];
      pageStudents.forEach((studentReport, studentIndex) => {
        if (studentIndex > 0) {
          // Add separator between students (except for the first one)
          content.push({
            text: "ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ",
            absolutePosition: {
              y: 841.89 / 2 - 7,
              x: 20,
            },
          });
        }

        // Add student content
        if (studentReport) {
          pageContent.push(
            ...createStudentContent(
              studentReport,
              dates,
              studentIndex > 0,
              pageStudents.length > 1,
            ),
          );
        }
      });

      content.push(...pageContent);
    });

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 0, 20, 0],
      pageOrientation: "portrait",
      content: content,
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          color: "#2c3e50",
        },
        subheader: {
          fontSize: 10,
          bold: true,
          color: "#34495e",
          margin: [0, 2, 0, 2],
        },
        tableHeader: {
          fontSize: 8,
          bold: true,
          color: "#2c3e50",
          fillColor: "#ecf0f1",
        },
        tableCell: {
          fontSize: 8,
          lineHeight: 1.1,
        },
        summary: {
          fontSize: 10,
          bold: true,
          margin: [0, 8, 0, 4],
          color: "#2c3e50",
        },
      },
      defaultStyle: {
        alignment: "right",
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  // Create student pages by first collecting all data lengths and pairing students with <10 records
  function createStudentPagesWithPairs(allStudentData) {
    // Create arrays for students with less than 10 records and those with 10 or more
    const studentsWithFewRecords = [];
    const studentsWithManyRecords = [];

    // First pass: categorize all students by their data length
    const resumePagesChecked = resumePagesCheck.checked;
    allStudentData.forEach((studentReport) => {
      const studentDataRecordsLength = studentReport.data
        .map((i) => JSON.parse(i.detail)?.length ?? 1)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      if (resumePagesChecked && studentDataRecordsLength <= 20) {
        studentsWithFewRecords.push(studentReport);
      } else if (studentDataRecordsLength < 52) {
        studentsWithManyRecords.push(studentReport);
      } else {
        throw new Error("عدد الصفوف تجاوز الحد الأقصى");
      }
    });

    const pages = [];

    // Pair students with few records (2 per page)
    for (let i = 0; i < studentsWithFewRecords.length; i += 2) {
      if (i + 1 < studentsWithFewRecords.length) {
        // Pair two students on one page
        pages.push([studentsWithFewRecords[i], studentsWithFewRecords[i + 1]]);
      } else {
        // Last student with few records (odd number)
        pages.push([studentsWithFewRecords[i], null]);
      }
    }

    // Add students with many records (1 per page)
    studentsWithManyRecords.forEach((studentReport) => {
      pages.push([studentReport]);
    });

    return pages;
  }

  // Create student content (reusable for both single and stacked layouts)
  function createStudentContent(
    studentReport,
    dates,
    isSecond,
    isStacked = false,
  ) {
    const { data, studentName, studentOrder, studentId } = studentReport;
    const recordCounts =
      data
        .map((i) => {
          return i.detail ? JSON.parse(i.detail).length : 1;
        })
        .reduce((accumulator, current) => accumulator + current, 0) + 3;
    const tableCellHeight = isStacked
      ? 38 - recordCounts
      : 33 - recordCounts / 2;
    const tableBody = createTableBody(data, tableCellHeight / 3, isStacked);

    const content = [
      // Student header
      {
        text: reverseArabicWords(
          `تقرير  متابعة الطالب${isGirls ? "ة" : ""} في حفظ القرآن الكريم`,
        ),
        style: "header",
        alignment: "center",
        fontSize: isStacked ? 14 : 14,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 15,
        },
      },
      {
        text: reverseArabicWords(`الطالب${isGirls ? "ة" : ""}: ${studentName}`),
        style: "subheader",
        alignment: "right",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
        },
      },
      {
        text: reverseArabicWords(
          workingClassroomSelect.selectedOptions[0].text
            .split("-")
            .slice(0, 2)
            .join(" -") + "-",
        ),
        style: "subheader",
        alignment: "center",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
        },
      },
      {
        text: reverseArabicWords(
          `حرر  يوم: ${new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          }).format()}`,
        ),
        style: "subheader",
        alignment: "left",
        fontSize: isStacked ? 9 : 10,
        absolutePosition: {
          y: (isSecond ? 841.89 / 2 : 0) + 35,
          x: 18,
        },
      },
      // Table
      {
        table: {
          // headerRows: 2,
          heights: tableCellHeight,
          widths: [50, 70, 70, 250],
          body: tableBody,
        },
        absolutePosition: {
          y:
            (isStacked
              ? 841.89 / 4 + (isSecond ? 841.89 / 2 : 0)
              : 841.89 / 2 -
                (recordCounts <= 25 ? -1.5 * recordCounts : recordCounts / 2)) -
            (recordCounts / (isStacked ? 2 : recordCounts)) *
              (isStacked ? 13 : 345),
          x: 60,
        },
        layout: {
          paddingLeft: function (i, node) {
            return 3;
          },
          paddingRight: function (i, node) {
            return 3;
          },
          hLineWidth: function (i, node) {
            return 0.3;
          },
          vLineWidth: function (i, node) {
            return 0.3;
          },
          hLineColor: function (i, node) {
            return "#aaaaaa";
          },
          vLineColor: function (i, node) {
            return "#aaaaaa";
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#f8f9fa" : null;
          },
        },
        margin: [0, 0, 0, 8],
      },

      // Summary section
      ...createCompactSummarySection(data, studentOrder, isSecond, isStacked),
    ];

    return content;
  }

  // Create compact table body for stacked layout
  function createTableBody(studentData, marginTop, isStacked = false) {
    // Arabic headers - two rows for date
    const font_size = 10;
    const headerRows = [
      {
        text: "النقاط",
        style: "tableHeader",
        alignment: "center",
        fontSize: font_size,
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "التقدير",
        style: "tableHeader",
        alignment: "center",
        fontSize: font_size,
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "الأخـطاء",
        style: "tableHeader",
        alignment: "center",
        fontSize: font_size,
        marginTop: marginTop,
        marginBottom: -2,
      },
      {
        text: "المـطــلــوب",
        style: "tableHeader",
        alignment: "center",
        fontSize: font_size,
        marginTop: marginTop,
        marginBottom: -2,
      },
    ];

    // Group records by month and year
    const groupedRecords = groupRecordsByMonthYear(studentData);

    // Create table body
    const body = [];

    groupedRecords.forEach((monthGroup) => {
      const { _, records } = monthGroup;

      records.forEach((record, recordIndex) => {
        // Handle absence
        if (record.attendance !== 1) return;

        record.detail = JSON.parse(record.detail || "[]");
        const recordDetailLength = record.detail.length;
        if (recordDetailLength == 0) return;
        else if (recordDetailLength < 2) {
          const row = createEmptyArray(4);
          const baseIndex = 3;

          // Details
          row[baseIndex] = {
            text: formatDetail(record.detail[0]),
            style: "tableCell",
            fontSize: font_size,
            alignment: "right",
            margin: [0, marginTop, 0, -2],
          };
          row[baseIndex - 1] = {
            text: recordDetailLength ? formatErrors(record.detail[0]) : "-",
            style: "tableCell",
            alignment: "center",
            fontSize: font_size,
            margin: [-2, marginTop, -2, -2],
          };
          row[baseIndex - 2] = {
            text: recordDetailLength ? formatEval(record.detail[0]) : "-",
            style: "tableCell",
            bold: true,
            alignment: "center",
            fontSize: font_size,
            margin: [-2, marginTop, -2, -2],
          };
          row[baseIndex - 3] = {
            text: recordDetailLength ? record.detail[0]["المعدل"] : "-",
            style: "tableCell",
            bold: true,
            fontSize: font_size,
            alignment: "center",
            margin: [-2, marginTop, -2, -2],
          };

          body.push(row);
        } else {
          const marginTopMulti =
            marginTop +
            (isStacked ? 7 : marginTop * 3) *
              (recordDetailLength / (isStacked ? 1.5 : 2.5));
          // For multiple details, create multiple rows
          record.detail.forEach((detail, detailIndex) => {
            const row = createEmptyArray(4);
            const baseIndex = 3;

            // Detail
            row[baseIndex] = {
              text: formatDetail(detail),
              style: "tableCell",
              fontSize: font_size,
              alignment: "right",
              margin: [0, marginTop, 0, -2],
            };
            row[baseIndex - 1] = {
              text: formatErrors(detail) || "-",
              style: "tableCell",
              fontSize: font_size,
              alignment: "center",
              margin: [-2, marginTop, -2, -2],
            };
            row[baseIndex - 2] = {
              text: formatEval(detail) || "-",
              style: "tableCell",
              bold: true,
              fontSize: font_size,
              alignment: "center",
              margin: [-2, marginTop, -2, -2],
            };
            row[baseIndex - 3] = {
              text: detail["المعدل"] || "-",
              style: "tableCell",
              bold: true,
              fontSize: font_size,
              alignment: "center",
              margin: [-2, marginTop, -2, -2],
            };
            body.push(row);
          });
        }
      });
    });

    const fullAddedPoints =
      studentsAppends[studentData[0].student_name]?.points || 0;
    const totalDays =
      studentData.length -
      studentData.filter((record) => record.attendance == 0).length;
    const validRecords = studentData.filter(
      (record) => record.attendance !== null,
    );

    if (totalDays === 0) return [];

    const total = validRecords.reduce(
      (sum, record) =>
        sum + (record.requirements_score || 0) + (record.evaluation_score || 0),
      0,
    );
    const resultRows = [
      ...[
        fullAddedPoints > 0
          ? {
              text: fullAddedPoints.toFixed(2),
              style: "tableHeader",
              alignment: "center",
              marginTop: marginTop,
              marginBottom: -2,
              fontSize: font_size,
              // border: [true, true, false, true],
            }
          : { border: [false, true, false, false], text: "" },
      ],
      ...[
        fullAddedPoints > 0
          ? {
              text: "رصيد إضافي:",
              style: "tableHeader",
              alignment: "center",
              fontSize: font_size,
              marginTop: marginTop,
              marginLeft: -3,
              marginBottom: -2,
              // border: [false, true, true, true],
            }
          : { border: [false, true, false, false], text: "" },
      ],
      { text: "", border: [false, true, false, false] },
      { text: "", border: [false, true, false, false] },
      // { text: "", border: [false, true, false, false] },
      // { text: "", border: [false, true, false, false] }, // empty for the second part of date
    ];

    return [headerRows, ...body, resultRows];
  }

  // Helper function to create an empty array with specified length
  function createEmptyArray(length) {
    return new Array(length).fill({});
  }

  // Helper function to group records by month and year
  function groupRecordsByMonthYear(studentData) {
    const groups = {};

    studentData.forEach((record) => {
      const recordDate = new Date(record.day);
      const monthYear = `${
        new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          year: "numeric",
        })
          .format(recordDate)
          .split(" ")[0]
      } ${reverseArabicWords(
        new Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          month: "long",
        }).format(recordDate),
      )}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
    });

    // Convert to array and sort by date
    return Object.keys(groups)
      .map((monthYear) => ({
        monthYear,
        records: groups[monthYear].sort(
          (a, b) => new Date(a.day) - new Date(b.day),
        ),
      }))
      .sort((a, b) => new Date(a.records[0].day) - new Date(b.records[0].day));
  }

  // Create compact summary section
  function createCompactSummarySection(
    studentData,
    studentOrder,
    isSecond,
    isStacked = false,
  ) {
    const totalDays = studentData.length;
    const validRecords = studentData.filter(
      (record) => record.attendance !== null,
    );
    if (totalDays === 0) return [];

    const fullAddedPoints =
      studentsAppends[studentData[0].student_name]?.points || 0;
    const total =
      validRecords.reduce(
        (sum, record) => sum + (record.requirements_score || 0),
        0,
      ) + (fullAddedPoints || 0);

    const fullNote = studentsAppends[studentData[0].student_name]?.note || "";

    // Full summary for single student view
    return [
      {
        table: {
          widths: [50, 90, 330],
          body: [
            [
              {
                text: `الترتيب: ${studentOrder}`,
                style: "tableCell",
                bold: true,
                alignment: "right",
                border: [true, true, true, true],
                fontSize: 12,
                marginTop: 3,
              },
              {
                text: `المجموع : ${total.toFixed(2)}`,
                style: "tableCell",
                alignment: "center",
                bold: true,
                border: [true, false, false, false],
                fontSize: 10,
                marginTop: 3,
              },
              ...[
                fullNote
                  ? {
                      // text: "الملاحظة:  تقدم ملحوظ و نسأل الله المزيد",
                      text: fullNote,
                      style: "tableCell",
                      alignment: "right",
                      bold: true,
                      border: [true, false, true, false],
                      fontSize: 10,
                      marginTop: 3,
                    }
                  : {
                      text: "",
                      border: [false, false, false, false],
                    },
              ],
            ],
          ],
        },
        absolutePosition: {
          y: 841.89 / (isStacked && !isSecond ? 2 : 1) - 60,
          x: 40,
        },
        margin: [0, 0, 0, 5],
      },
    ];
  }

  // Function to reverse words in a string (for Arabic)
  function reverseArabicWords(str) {
    return str.split(" ").reverse().join(" ");
  }

  function formatEval(detail) {
    const rating = detail["التقدير"];
    if (rating == 10) return "مــمــتــاز";
    if (rating >= 9) return "جــيــد  جــدا";
    if (rating >= 7) return "جـــيـــد";
    if (rating >= 6) return "حـــســـن";
    if (rating >= 5) return "مـتــوســط";
    return "دون  المتوسط";
  }

  function formatErrors(detail) {
    if (!detail) return "-";
    const errorsCount = detail["الأخطاء"].includes(" ")
      ? parseInt(detail["الأخطاء"].split(" ")[0]) +
        parseInt(detail["الأخطاء"].split(" ")[4])
      : parseInt(detail["الأخطاء"]);
    return errorsCount > 0
      ? errorsCount == 1
        ? " خطأ واحد"
        : errorsCount + "  أخطاء"
      : " بدون أخطاء";
  }

  function formatDetail(detail) {
    return (
      detail["النوع"] +
      " " +
      (detail["الكتاب"] == "القرآن الكريم" ? "" : detail["الكتاب"]) +
      " ]  " +
      parseRequirment(detail["التفاصيل"], detail["الكتاب"], true) +
      " [ "
    );
  }
}

async function showAttendanceStatistics() {
  const studentsList = getStatisticsSelectedStudentsId();
  if (!studentsList) {
    window.showToast("warning", "يرجى اخيار طلاب من القائمة.");
    return;
  }

  let [dates, isFullMonth] = getDatesInRange();
  dates = dates.sort((a, b) => new Date(a) - new Date(b));

  if (!dates.length) {
    window.showToast("warning", "لا توجد أيام في هذا النطاق.");
    reinitStatisticTable();
    return;
  }

  const dateColumns = dates
    .map(
      (date) => `
        MAX(CASE 
            WHEN d.date = '${date}' AND de.attendance = 1 THEN 'ح'
            WHEN d.date = '${date}' AND de.attendance = 0 THEN 'غ م'
            ELSE ' غ'
        END) AS '${new Date(date)
          .toLocaleDateString("ar-DZ-u-ca-islamic-umalqura", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })
          .replace("،", "")}'
`,
    )
    .join(",\n");

  const attendanceSum = dates
    .map(
      (date) =>
        `SUM(CASE WHEN d.date = '${date}' AND de.attendance = 1 THEN 1 ELSE 0 END)`,
    )
    .join(" +\n        ");

  const attendanceObligatorySum = dates
    .map(
      (date) =>
        `SUM(CASE WHEN d.date = '${date}' AND d.isObligatory = 1 AND de.attendance IN (1,0) THEN 1 ELSE 0 END)`,
    )
    .join(" +\n        ");

  const query = `
    SELECT
    ROW_NUMBER() OVER (ORDER BY s.id) as "#",
    s.fname || ' ' || s.lname as "اسم الطالب",

    ${dateColumns},

    ${attendanceSum} as "المجموع (/${dates.length})",

    ROUND(
        ((${attendanceObligatorySum}) * 100.0 / (SELECT count(*) FROM education_day WHERE class_room_id = ${workingClassroomId} AND isObligatory = 1 AND date IN (${dates.map((date) => `'${date}'`).join(", ")}))), 1
    ) as "إلزامي (%)",

    ROUND(
        ((${attendanceSum}) * 100.0 / ${dates.length}), 1
    ) as "النسبة (%)"
    FROM students s
    LEFT JOIN day_evaluations de ON s.id = de.student_id
    LEFT JOIN education_day d ON d.id = de.day_id

    WHERE s.id IN (${studentsList})

    GROUP BY s.id
    ORDER BY s.id;
`;

  const buttons =
    dates.length > 15
      ? []
      : [
          {
            extend: "pdfHtml5",
            download: "open",
            text: "PDF",
            className: "btn btn-primary",
            customize: async function (doc) {
              const daysCount = dates.length;
              doc.pageSize = "A4";
              doc.pageOrientation = "landscape";
              doc.content[0].text = "جدول حضور الطلاب";
              doc.content[0].alignment = "center";
              doc.content[0].fontSize = 16;
              doc.content[0].margin = [0, 0, 0, 20];

              doc.styles.tableHeader.alignment = "left";
              doc.content[1].table.widths =
                daysCount >= 13
                  ? Array(doc.content[1].table.body[0].length + 1)
                      .join("auto,")
                      .split(",")
                      .slice(0, -1)
                  : Array(doc.content[1].table.body[0].length + 1)
                      .join("*")
                      .split("");

              doc.content[1].table.widths[
                doc.content[1].table.body[0].length - 1
              ] = 15;
              doc.content[1].table.widths[
                doc.content[1].table.body[0].length - 2
              ] = 100;
              doc.content[1].table.body.forEach((row, idx) => {
                if (idx > 1) {
                  row.reverse();
                } else {
                  function reverseHeaderRow(row) {
                    const groups = [];
                    let i = 0;

                    while (i < row.length) {
                      const cell = row[i];

                      // If it's a span placeholder, skip (should not start with this)
                      if (cell._span) {
                        i++;
                        continue;
                      }

                      const span = cell.colSpan || 1;

                      // Take the full group (cell + its span placeholders)
                      const group = row.slice(i, i + span);
                      groups.push(group);

                      i += span;
                    }

                    // Reverse groups order
                    groups.reverse();

                    // Flatten back to single array
                    return groups.flat();
                  }
                  doc.content[1].table.body[idx] = reverseHeaderRow(row);
                }
                row.forEach((cell) => {
                  cell.alignment = "center";
                  cell.marginTop = cell.rowSpan > 1 ? cell.rowSpan * 6 : 3;
                  cell.marginLeft = cell.marginRight = -3;
                });
              });
              // set layout
              doc.content[1].layout = {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                  return i === 0 || i === node.table.widths.length ? 2 : 1;
                },
                hLineColor: function (i, node) {
                  return i === 0 || i === node.table.body.length
                    ? "black"
                    : "gray";
                },
                vLineColor: function (i, node) {
                  return i === 0 || i === node.table.widths.length
                    ? "black"
                    : "gray";
                },
              };
            },
          },
        ];
  const tableColumns = [
    "#",
    "اسم الطالب",
    ...dates
      .sort((a, b) => new Date(a) - new Date(b))
      .map((d) =>
        Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
          .format(new Date(d))
          .replace("،", ""),
      ),
    `المجموع (/${dates.length})`,
    "إلزامي (%)",
    "النسبة (%)",
  ];
  setStatisticsTable(query, tableColumns, buttons);
}

async function showResultsStatistics() {
  const studentsList = getStatisticsSelectedStudentsId();
  if (!studentsList) {
    window.showToast("warning", "يرجى اخيار طلاب من القائمة.");
    return;
  }

  let [dates, isFullMonth] = getDatesInRange();
  dates = dates.sort((a, b) => new Date(a) - new Date(b));

  if (!dates.length) {
    window.showToast("warning", "لا توجد أيام في هذا النطاق.");
    reinitStatisticTable();
    return;
  }

  const dateCtes = dates
    .map(
      (date, index) =>
        `day_id${index} AS ( SELECT id FROM education_day WHERE date = '${date}' )`,
    )
    .join(", \n");

  // Generate date columns
  const dateColumns = dates
    .map(
      (date, index) =>
        `COALESCE(ROUND(
              (SELECT CASE WHEN attendance = 1 THEN SUM(moyenne) ELSE NULL END FROM day_evaluations WHERE student_id = s.id AND day_id IN (SELECT id FROM day_id${index}))
              + 
              (SELECT COALESCE(SUM(moyenne), 0) FROM day_requirements WHERE student_id = s.id AND day_id IN (SELECT id FROM day_id${index}))
          , 2), "غ") as '${new Date(date)
            .toLocaleDateString("ar-DZ-u-ca-islamic-umalqura", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })
            .replace("،", "")}'`,
    )
    .join(",\n    ");

  // Generate sum expressions for المجموع
  const sumExpressions = dates
    .map(
      (_, index) =>
        `(SELECT COALESCE(SUM(de.moyenne), 0) FROM day_evaluations de 
          WHERE de.student_id = s.id AND de.day_id IN (SELECT id FROM day_id${index}))
          + 
          (SELECT COALESCE(SUM(dr.moyenne), 0) FROM day_requirements dr 
          WHERE dr.student_id = s.id AND dr.day_id IN (SELECT id FROM day_id${index}))
        `,
    )
    .join(" +\n        ");

  const absenceCTE = `absence_counts AS (
    SELECT 
      student_id,
      COUNT(*) as absent_count
    FROM day_evaluations
    WHERE attendance = 0
    AND day_id IN (SELECT id FROM education_day WHERE date IN (${dates.map((d) => `'${d}'`).join(", ")}))
    GROUP BY student_id
  )`;

  const query = `
    WITH ${dateCtes},
    ${absenceCTE}
    SELECT 
        ROW_NUMBER() OVER (ORDER BY s.id) as "#", 
        s.fname || ' ' || s.lname as "اسم الطالب",
        ${dateColumns},
        COALESCE(ROUND(${sumExpressions}, 2), 0) as "المجموع",
        COALESCE(ROUND(
            (${sumExpressions}) / (${dates.length} - COALESCE(ac.absent_count, 0))
        , 2), 0) as "المعدل",
        ROW_NUMBER() OVER (
          ORDER BY COALESCE(ROUND(
              (${sumExpressions}) / (${dates.length} - COALESCE(ac.absent_count, 0))
          , 2), 0) DESC
        ) as "الترتيب"
    FROM students s 
    LEFT JOIN day_evaluations de ON s.id = de.student_id 
    LEFT JOIN day_requirements dr ON dr.student_id = s.id 
    LEFT JOIN absence_counts ac ON s.id = ac.student_id
    WHERE s.id IN (${studentsList})
    GROUP BY s.id, "اسم الطالب", ac.absent_count
    ORDER BY s.id;
`;
  const buttons = [
    {
      text: '<i class="fa-solid fa-puzzle-piece"></i>',
      action: async function () {
        const bulletinAppendsModal = new bootstrap.Modal(
          "#bulletinAppendsModal",
        );
        const bulletinAppendsModalBody = document.querySelector(
          "#bulletinAppendsModal .modal-body",
        );
        const preStudentAppends = localStorage.getItem("studentsAppends")
          ? JSON.parse(localStorage.getItem("studentsAppends"))
          : {};

        bulletinAppendsModalBody.innerHTML = `
          <div class="card">
            <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="card-title">الجميع</h5>
              <button class="btn btn-sm btn-outline-secondary" id="setAllAppendsBtn">تطبيق</button>
            </div>
              <div class="input-group mb-3">
                <span class="input-group-text">نقاط إضافية</span>
                <input id="points-all" type="number" class="form-control text-center px-0" value="0" step="1">
                <span class="input-group-text">نقطة</span>
              </div>
              <div class="input-group">
                <span class="input-group-text">الملاحظة</span>
                <textarea id="note-all" class="form-control" aria-label="With textarea"></textarea>
              </div>
            </div>
          </div>
          <hr class="my-2"></hr>`;
        const statisticsSelectedStudentsList = Array.from(
          document.querySelectorAll(".statisStudentItem:checked"),
        ).map((item) => ({
          name: item.nextElementSibling.textContent,
          id: item.value,
        }));

        statisticsSelectedStudentsList.forEach((student) => {
          bulletinAppendsModalBody.innerHTML += `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title" id="name-${student.id}">${student.name}</h5>
              <div class="input-group mb-3">
                <span class="input-group-text">نقاط إضافية</span>
                <input id="points-${student.id}" type="number" class="form-control text-center px-0" value="${preStudentAppends[student.name]?.points || 0}" step="1">
                <span class="input-group-text">نقطة</span>
              </div>
              <div class="input-group">
                <span class="input-group-text">الملاحظة</span>
                <textarea id="note-${student.id}" class="form-control" aria-label="With textarea">${preStudentAppends[student.name]?.note || ""}</textarea>
              </div>
            </div>
          </div>`;
        });
        document.getElementById("setAllAppendsBtn").onclick = function () {
          const points =
            parseInt(document.getElementById("points-all").value) || 0;
          const note = document.getElementById("note-all").value || "";
          statisticsSelectedStudentsList.forEach((student) => {
            document.getElementById(`points-${student.id}`).value = points;
            document.getElementById(`note-${student.id}`).value = note;
          });
        };

        bulletinAppendsModal.show();
        document.getElementById("saveBullentinAppends").onclick =
          async function () {
            bulletinAppendsModal.hide();
            const obj = {};
            statisticsSelectedStudentsList.forEach((student) => {
              const points =
                parseInt(
                  document.getElementById(`points-${student.id}`).value,
                ) || 0;
              const note =
                document.getElementById(`note-${student.id}`).value || "";
              obj[student.name] = { points, note };
            });
            const existingAppends = preStudentAppends || {};
            Object.assign(existingAppends, obj);
            localStorage.setItem(
              "studentsAppends",
              JSON.stringify(existingAppends),
            );
          };
      },
    },
    ...(dates.length > 13
      ? []
      : [
          {
            extend: "pdfHtml5",
            download: "open",
            text: "PDF",
            className: "btn btn-primary",
            customize: async function (doc) {
              const daysCount = dates.length;
              doc.pageSize = "A4";
              doc.pageOrientation = "landscape";
              doc.content[0].text = "نتائج  الطلاب";
              doc.content[0].alignment = "center";
              doc.content[0].fontSize = 16;
              doc.content[0].margin = [0, 0, 0, 20];

              doc.styles.tableHeader.alignment = "left";
              doc.content[1].table.widths =
                daysCount >= 12
                  ? Array(doc.content[1].table.body[0].length + 1)
                      .join("auto,")
                      .split(",")
                      .slice(0, -1)
                  : Array(doc.content[1].table.body[0].length + 1)
                      .join("*")
                      .split("");

              doc.content[1].table.widths[
                doc.content[1].table.body[0].length - 1
              ] = 15;
              doc.content[1].table.widths[
                doc.content[1].table.body[0].length - 2
              ] = 100;
              // reverse rows for RTL
              doc.content[1].table.body.forEach((row, idx) => {
                if (idx > 1) {
                  row.reverse();
                } else {
                  function reverseHeaderRow(row) {
                    const groups = [];
                    let i = 0;

                    while (i < row.length) {
                      const cell = row[i];

                      // If it's a span placeholder, skip (should not start with this)
                      if (cell._span) {
                        i++;
                        continue;
                      }

                      const span = cell.colSpan || 1;

                      // Take the full group (cell + its span placeholders)
                      const group = row.slice(i, i + span);
                      groups.push(group);

                      i += span;
                    }

                    // Reverse groups order
                    groups.reverse();

                    // Flatten back to single array
                    return groups.flat();
                  }
                  doc.content[1].table.body[idx] = reverseHeaderRow(row);
                }
                row.forEach((cell) => {
                  cell.alignment = "center";
                  cell.marginTop = cell.rowSpan > 1 ? cell.rowSpan * 6 : 3;
                  cell.marginLeft = cell.marginRight = -3;
                });
              });
              // set layout
              doc.content[1].layout = {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                  return i === 0 || i === node.table.widths.length ? 2 : 1;
                },
                hLineColor: function (i, node) {
                  return i === 0 || i === node.table.body.length
                    ? "black"
                    : "gray";
                },
                vLineColor: function (i, node) {
                  return i === 0 || i === node.table.widths.length
                    ? "black"
                    : "gray";
                },
              };
            },
          },
        ]),
    ...(dates.length > 25
      ? []
      : [
          {
            text: "كشوف النقاط",
            action: async function () {
              await showLoadingModal("جاري إنشاء كشوف النقاط");
              initBullentinConfigs();
              showStudentsBulletins(dates);
              hideLoadingModal();
            },
          },
        ]),
  ];
  const tableColumns = [
    "#",
    "اسم الطالب",
    ...dates
      .sort((a, b) => new Date(a) - new Date(b))
      .map((d) =>
        Intl.DateTimeFormat("ar-DZ-u-ca-islamic-umalqura", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
          .format(new Date(d))
          .replace("،", ""),
      ),
    "المجموع",
    "المعدل",
    "الترتيب",
  ];
  setStatisticsTable(query, tableColumns, buttons);
}

async function showAvanceChart() {
  const studentID = getStatisticsSelectedStudentsId();
  if (!studentID) {
    window.showToast("warning", "يرجى اخيار طلاب من القائمة.");
    return;
  }

  let [dates, isFullMonth] = getDatesInRange();
  dates = dates.sort((a, b) => new Date(a) - new Date(b));

  if (!dates.length) {
    window.showToast("warning", "لا توجد أيام في هذا النطاق.");
    reinitStatisticTable();
    return;
  }

  try {
    if (quranData.pages.length === 0)
      quran_db.exec("SELECT * FROM quran_pages")[0].values.forEach((row) => {
        quranData.pages.push({
          n: row[0],
          ss: row[1],
          sa: row[2],
          es: row[3],
          ea: row[4],
        });
      });

    if (quranData.ahzab.length === 0)
      quran_db.exec("SELECT * FROM quran_ahzab")[0].values.forEach((row) => {
        quranData.ahzab.push({
          n: row[0],
          ss: row[1],
          sa: row[2],
          es: row[3],
          ea: row[4],
        });
      });
  } catch (e) {
    if (e.message.includes("no such table:")) await downloadQuranDB();
  }

  if (!quranData.SURAH_NAME_MAP.size)
    quranData.surahs.forEach((s) =>
      quranData.SURAH_NAME_MAP.set(s.name, s.number),
    );

  if (!Object(quranData).hasOwnProperty("surahOffsets")) {
    quranData.surahOffsets = [0];
    for (const s of quranData.surahs)
      quranData.surahOffsets.push(
        quranData.surahOffsets.at(-1) + s.numberOfAyahs,
      );
  }

  if (!Object(quranData).hasOwnProperty("verseInfo")) {
    quranData.verseInfo = [];
    for (const s of quranData.surahs)
      for (let a = 1; a <= s.numberOfAyahs; a++)
        quranData.verseInfo.push({ surah: s.number, ayah: a, name: s.name });
  }

  const TOTAL = quranData.surahOffsets[114];
  // Helper: convert surah+ayah (1-based) to 0-based global verse index
  function toGlobal(surah, ayah) {
    return quranData.surahOffsets[surah - 1] + ayah - 1;
  }

  // Build per-verse lookup arrays for fast O(1) access
  const versePageIdx = new Int16Array(TOTAL); // 0-based page index
  const verseHizbIdx = new Int8Array(TOTAL); // 0-based hizb index

  (function buildLookups() {
    // Pages
    for (let pi = 0; pi < quranData.pages.length; pi++) {
      const p = quranData.pages[pi];
      const startG = toGlobal(p.ss, p.sa);
      const endG = toGlobal(p.es, p.ea);
      for (let g = startG; g <= endG && g < TOTAL; g++) versePageIdx[g] = pi;
    }
    // Ahzab
    for (let hi = 0; hi < quranData.ahzab.length; hi++) {
      const h = quranData.ahzab[hi];
      const startG = toGlobal(h.ss, h.sa);
      const endG = toGlobal(h.es, h.ea);
      for (let g = startG; g <= endG && g < TOTAL; g++) verseHizbIdx[g] = hi;
    }
  })();

  // ── GROUPING ─────────────────────────────────────────────────────────────────
  function getGroupIndex(i, by) {
    if (by === "surah") return quranData.verseInfo[i].surah - 1;
    if (by === "hizb") return verseHizbIdx[i];
    if (by === "page") return versePageIdx[i];
    return 0;
  }
  function getGroupCount(by) {
    if (by === "surah") return 114;
    if (by === "hizb") return quranData.ahzab.length;
    if (by === "page") return quranData.pages.length;
    return 1;
  }
  function getGroupLabel(gi, by) {
    if (by === "surah")
      return `${quranData.surahs[gi].number}. ${quranData.surahs[gi].name}`;
    if (by === "hizb") return `الحزب ${quranData.ahzab[gi].n}`;
    if (by === "page") return `صفحة ${quranData.pages[gi].n}`;
    return "";
  }

  // ── STATE ────────────────────────────────────────────────────────────────────
  const indices = [],
    allAyatlist = { saveList: [], reviselist: [] };
  let groupBy = "none",
    typeBy = "all",
    gridBuilt = false;

  // ── GRID ─────────────────────────────────────────────────────────────────────
  const gridEl = document.getElementById("verse-grid");
  const tooltip = document.getElementById("tooltip");

  function buildGrid() {
    gridEl.innerHTML = "";
    const frag = document.createDocumentFragment();

    if (groupBy === "none") {
      for (let gi = getGroupCount("surah") - 1; gi >= 0; gi--) {
        const groupVerses = [];
        for (let i = 0; i < TOTAL; i++)
          if (getGroupIndex(i, "surah") === gi) groupVerses.push(i);
        for (let k = 0; k <= groupVerses.length - 1; k++)
          frag.appendChild(makeSq(groupVerses[k]));
      }
    } else {
      const count = getGroupCount(groupBy);
      // reversed: last group on top
      for (let gi = count - 1; gi >= 0; gi--) {
        const hdr = document.createElement("div");
        hdr.className = "group-header";
        hdr.innerHTML = `<span class="group-header-label">${getGroupLabel(gi, groupBy)}</span><div class="group-header-line"></div>`;
        frag.appendChild(hdr);
        // collect verses for this group in reversed order
        const groupVerses = [];
        for (let i = 0; i < TOTAL; i++)
          if (getGroupIndex(i, groupBy) === gi) groupVerses.push(i);
        for (let k = 0; k <= groupVerses.length - 1; k++)
          frag.appendChild(makeSq(groupVerses[k]));
      }
    }

    gridEl.appendChild(frag);
    gridBuilt = true;
    applyColors();
  }

  function makeSq(i) {
    const sq = document.createElement("div");
    sq.className = "verse-sq";
    sq.dataset.idx = i;
    return sq;
  }

  // ── TOOLTIP ───────────────────────────────────────────────────────────────────
  async function showAvanceChartTooltip(sq, clientX, clientY) {
    const i = +sq.dataset.idx;
    const vi = quranData.verseInfo[i];

    tooltip.querySelector(".t-surah").textContent = `${vi.name} - ${vi.ayah}`;
    tooltip.querySelector(".t-verse").textContent = await quran_db.exec(
      `SELECT substr(text,1,40) FROM quran_ayat WHERE id=${parseInt(i) + 1}`,
    )[0].values[0][0];

    let x = clientX + 14,
      y = clientY - 80;
    if (x + 100 > window.innerWidth) x = clientX - 240;
    if (y < 0) y = clientY + 14;
    if (y + 110 > window.innerHeight) y = clientY - 120;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.style.display = "block";
  }

  function hideTooltip() {
    tooltip.style.display = "none";
  }

  // Pointer events — work on both mouse and touch
  gridEl.addEventListener("click", (e) => {
    const sq = e.target.closest(".verse-sq");
    if (!sq) {
      hideTooltip();
      return;
    }
    showAvanceChartTooltip(sq, e.clientX, e.clientY);
  });
  gridEl.addEventListener("pointerleave", hideTooltip);
  gridEl.addEventListener("touchend", hideTooltip);
  gridEl.addEventListener("touchcancel", hideTooltip);

  // ── PARSE ────────────────────────────────────────────────────────────────────

  // Resolve a token that is either a number or an Arabic surah name → surah number
  function resolveSurah(token) {
    const n = +token;
    if (!isNaN(n) && n >= 1 && n <= 114) return n;
    return quranData.SURAH_NAME_MAP.get(token) ?? null;
  }

  function parseEntry(entry) {
    if (!entry) return null;

    const [sn1, , a1, , sn2, , a2] = entry.split(" ");
    const s1 = resolveSurah(sn1.trim()),
      s2 = resolveSurah(sn2.trim());
    if (!s1 || !s2) return null;
    const startG = toGlobal(s1, +a1),
      endG = toGlobal(s2, +a2);
    if (startG > endG || startG < 0 || endG >= TOTAL) return null;
    const set = new Set();
    for (let g = startG; g <= endG; g++) set.add(g);
    return set;
  }

  function fillAyatList() {
    if (!project_db) {
      window.showToast("info", "لا يوجد قاعدة بيانات مفتوحة.");
      return;
    }

    const lsR = project_db.exec(`
            SELECT dr.detail
            FROM day_requirements dr
            INNER JOIN education_day ed ON dr.day_id = ed.id
            WHERE dr.student_id = ${studentID} AND ed.date IN (${dates.map((date) => `'${date}'`).join(", ")})
            ORDER BY ed.date DESC`);
    if (lsR.length)
      lsR[0].values.forEach((item) => {
        JSON.parse(item[0])
          .reverse()
          .forEach((item) => {
            if (item["الكتاب"] === "القرآن الكريم") {
              const type = item["النوع"];
              const detail = item["التفاصيل"];

              if (type === "مراجعة")
                parseEntry(detail).forEach((item) =>
                  allAyatlist.reviselist.push(item),
                );
              else
                parseEntry(detail).forEach((item) =>
                  allAyatlist.saveList.push(item),
                );
            }
          });
      });
  }
  // ── HIGHLIGHT ────────────────────────────────────────────────────────────────
  function applyHighlight(init = false) {
    if (init) fillAyatList();
    indices.length = 0;
    switch (typeBy) {
      case "all":
        indices.push(...new Set(Object.values(allAyatlist).flat()));
        break;
      case "save":
        indices.push(...new Set(allAyatlist.saveList));
        break;
      case "revise":
        indices.push(...new Set(allAyatlist.reviselist));
        break;
      default:
        indices.length = 0;
    }
    indices.sort((a, b) => a - b);

    let questionNumber = 1;
    document.getElementById("randomSelectBtn").onclick = (e) => {
      if (indices.length < 4) {
        swal(
          "تنبيه",
          "عدد الآيات المميزة قليل جدا، لا يمكن عرض السؤال العشوائي.",
          "warning",
        );
        return;
      }

      let randomAyatID = indices[Math.floor(Math.random() * indices.length)];
      while (
        !indices.includes(randomAyatID + 1) ||
        quranData.verseInfo[randomAyatID].surah !==
          quranData.verseInfo[randomAyatID + 1].surah
      ) {
        randomAyatID = indices[Math.floor(Math.random() * indices.length)];
      }

      const row = quran_db.exec(
        `SELECT qi.sura,qa.text
          FROM quran_index qi
          LEFT JOIN quran_ayat qa ON qa.sura = qi.id_sura
          WHERE qa.id IN (${randomAyatID},${randomAyatID + 1},${randomAyatID + 2})`,
      )[0].values;

      const lign_count = quran_db.exec(`SELECT 
      ROUND(SUM(lign_count), 1) AS rounded_total
      FROM quran_ayat
      WHERE id in(${indices})`)[0].values[0][0];
      if (questionNumber > Math.floor(lign_count / 30)) questionNumber = 1;

      swal(
        `${row[0][1]} [${row[0][0]} - ${quranData.verseInfo[randomAyatID].ayah}]`,
        {
          title: `السؤال رقم ${questionNumber} / ${Math.floor(lign_count / 30)}`,
          className: "quran-text",
          buttons: {
            cancel: "إنهاء",
            skip: "تخطي",
            solution: {
              text: "الإجابة",
              value: "solution",
            },
            next: "السؤال التالي",
          },
        },
      ).then((value) => {
        switch (value) {
          case "next":
            questionNumber++;
            e.target.dispatchEvent(new Event("click"));
            break;
          case "skip":
            e.target.dispatchEvent(new Event("click"));
            break;

          case "solution":
            swal(
              "الإجابة",
              `${row[1][1]} [${quranData.verseInfo[randomAyatID + 1].ayah}] ${row[2][1]} [${quranData.verseInfo[randomAyatID + 2].ayah}]`,
              {
                className: "quran-text",
                buttons: {
                  cancel: "إنهاء",
                  skip: "تخطي",
                  next: "السؤال التالي",
                },
              },
            ).then((value) => {
              switch (value) {
                case "next":
                  questionNumber++;
                  e.target.dispatchEvent(new Event("click"));
                  break;
                case "skip":
                  e.target.dispatchEvent(new Event("click"));
                  break;
              }
            });
            break;
        }
      });
    };

    buildGrid();
    updateStatus();
  }

  // ── COLORS ───────────────────────────────────────────────────────────────────
  function applyColors() {
    const sqs = gridEl.querySelectorAll(".verse-sq");
    if (!indices.length) {
      sqs.forEach((sq) => {
        sq.style.background = "";
        sq.classList.remove("dimmed");
      });
      return;
    }
    const cmap = new Set();
    indices.forEach((i) => cmap.add(i));
    let open = true;
    const vides = [[]];
    sqs.forEach((sq, index) => {
      const i = +sq.dataset.idx;
      if (cmap.has(i)) {
        if (vides.at(-1).length == 0) {
          open = false;
        } else {
          vides.push([]);
        }

        sq.style.background = "#c9a84c";
        sq.classList.remove("dimmed");
      } else {
        sq.style.background = "";
        sq.classList.add("dimmed");
        if (!open) {
          vides.at(-1).push(index);
        }
      }
    });
    vides.splice(-1, 1);
    vides.forEach((vide) => {
      if (vide.length > 200) vide.length = 0;
      vide.forEach((sq) => {
        sqs[sq].classList.remove("dimmed");
        sqs[sq].style.background = "#f53e3e";
      });
    });
  }

  // ── STATUS ───────────────────────────────────────────────────────────────────
  function updateStatus() {
    const sr = document.getElementById("status-right");
    if (!indices.length) {
      sr.innerHTML = "لم يتم تحديد آيات";
      return;
    }
    const all = new Set();
    indices.forEach((i) => all.add(i));
    sr.innerHTML = `<span class="status-hi">${all.size}</span> آية مميزة`;
  }

  // ── GROUP-BY ─────────────────────────────────────────────────────────────────
  document.querySelectorAll(".gb-group .btn").forEach((btn) => {
    if (btn.classList.contains("active")) groupBy = btn.dataset.by;
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".gb-group .btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      groupBy = btn.dataset.by;
      if (gridBuilt) buildGrid();
    });
  });
  document.querySelectorAll(".tb-group .btn").forEach((btn) => {
    if (btn.classList.contains("active")) typeBy = btn.dataset.tby;
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tb-group .btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      typeBy = btn.dataset.tby;
      applyHighlight();
    });
  });

  // ── INIT ─────────────────────────────────────────────────────────────────────
  applyHighlight(true);
}

async function setStatisticsTable(query, tableColumns, buttons = []) {
  const result = project_db.exec(query);

  try {
    if (result.length > 0) {
      const data = result[0];
      const columns = data.columns;
      const values = data.values;

      // Prepare data for DataTables
      const tableData = values.map((row) => {
        const rowData = {};
        columns.forEach((column, index) => {
          rowData[column] = row[index];
        });
        return rowData;
      });

      await initOrReloadDataTable(
        "#statisticsTable",
        tableData,
        tableColumns,
        {
          fixedHeader: true,
          fixedColumns: {
            start: 1,
          },
          columnDefs: [
            { targets: 0, visible: false },
            {
              targets: "no-sort", // Target columns with the 'no-sort' class
              orderable: false,
            },
          ],
          searching: false,
          scrollX: true,
          info: false,
          order: [[columns.length - 1, "asc"]],
          oLanguage: {
            sSearch: "بحث",
            emptyTable: "لا توجد بيانات في الجدول.",
          },
          paging: false,
          responsive: true,

          layout: {
            topStart: {
              buttons: [
                ...[
                  {
                    text: '<i class="fa-solid fa-arrows-rotate"></i>',
                    action: async function () {
                      statisticType.dispatchEvent(new Event("change"));
                    },
                  },
                ],
                ...buttons,
              ],
            },
          },
        },
        false,
        true,
      );
      const scrollBody = $("#pills-statistics  div.dt-scroll-body");
      scrollBody.scrollLeft(scrollBody[0].scrollWidth * -1);
    } else {
      console.log("لاتوجد معلومات");
    }
  } catch (error) {
    console.error("Error executing query:", error);
  }
}

const initializeAyatdata = async (db) => {
  db.exec("SELECT * FROM quran_index")[0].values.forEach((row) => {
    quranData.surahs.push({
      number: row[0],
      name: row[1],
      numberOfAyahs: row[2],
    });
  });
  populateSurahDropdown(firstSurahSelect);
  populateSurahDropdown(secondSurahSelect);
};

const populateSurahDropdown = async (selectElement) => {
  quranData.surahs.forEach((surah) => {
    selectElement.appendChild(
      createOption(surah.number, `${surah.name}`, {
        surahNum: surah.number,
      }),
    );
  });
};

const createOption = (value, text, dataset = {}) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  for (const key in dataset) {
    option.dataset[key] = dataset[key];
  }
  // option.className = "text-truncate"
  return option;
};

const checkSecondSurahAyahs = (secondSurahNumber) => {
  if (secondSurahNumber) {
    let ll = 1;
    secondAyahSelect.disabled = false;
    secondAyahSelect.innerHTML = "";
    if (
      parseInt(firstSurahSelect.value) === parseInt(secondSurahSelect.value)
    ) {
      ll = parseInt(firstAyahSelect.value) || 1;
      for (let i = ll - 1; i < firstAyahSelect.options.length; i++) {
        const option = firstAyahSelect.options[i];
        const clonedOption = option.cloneNode(true);
        secondAyahSelect.appendChild(clonedOption);
      }
    } else {
      const secondSurahSelectedOption =
        secondSurahSelect.options[secondSurahSelect.selectedIndex];
      const rs = quran_db.exec(
        "SELECT * FROM quran_ayat WHERE sura = " +
          secondSurahSelectedOption.value,
      )[0];
      rs.values.forEach((row) => {
        secondAyahSelect.appendChild(
          createOption(
            row[rs.columns.indexOf("ayah")],
            `${row[rs.columns.indexOf("ayah")]}- ${row[rs.columns.indexOf("text")]}`,
          ),
        );
      });
    }

    secondAyahSelect.lastChild.selected = true;
    secondAyahSelect.dispatchEvent(new Event("change"));
  } else {
    secondAyahSelect.disabled = true;
    secondAyahSelect.innerHTML = "";
    secondAyahSelect.appendChild(createOption("", "--  --"));
  }
};

function setRequirQuantityDetailInput() {
  try {
    requirQuantityDetailInput.value = `${
      firstSurahSelect.options[firstSurahSelect.selectedIndex].text
    } - ${firstAyahSelect.options[firstAyahSelect.selectedIndex].value} إلى ${
      secondSurahSelect.options[secondSurahSelect.selectedIndex].text
    } - ${secondAyahSelect.options[secondAyahSelect.selectedIndex].value}`;
    setRequirEvalInput();
  } catch (err) {
    requirQuantityDetailInput.value = "";
  }
}

firstSurahSelect.onchange = async function () {
  const firstSurahNumber = parseInt(this.value);

  if (firstSurahNumber) {
    firstAyahSelect.disabled = false;
    firstAyahSelect.innerHTML = "";

    const rs = quran_db.exec(
      "SELECT * FROM quran_ayat WHERE sura = " + this.value,
    )[0];
    rs.values.forEach((row) => {
      firstAyahSelect.appendChild(
        createOption(
          row[rs.columns.indexOf("ayah")],
          `${row[rs.columns.indexOf("ayah")]}- ${row[rs.columns.indexOf("text")]}`,
        ),
      );
    });

    secondSurahSelect.disabled = false;
    secondSurahSelect.value = firstSurahNumber;
    quranData.surahs.forEach((surah) => {
      if (surah.number < firstSurahNumber) {
        secondSurahSelect.querySelector(
          'option[value="' + surah.number + '"]',
        ).style.display = "none";
      } else {
        secondSurahSelect.querySelector(
          'option[value="' + surah.number + '"]',
        ).style.display = "block";
      }
    });
    secondSurahSelect.dispatchEvent(new Event("change"));
  } else {
    firstAyahSelect.disabled = true;
    firstAyahSelect.innerHTML = "";
    firstAyahSelect.appendChild(createOption("", "--  --"));

    secondSurahSelect.disabled = true;
    secondSurahSelect.querySelector("option").style.display = "none";

    secondAyahSelect.disabled = true;
    secondAyahSelect.innerHTML = "";
    secondAyahSelect.appendChild(createOption("", "--  --"));
  }
};

secondSurahSelect.onchange = async function () {
  checkSecondSurahAyahs(parseInt(this.value));
  setRequirQuantityDetailInput();
};

firstAyahSelect.onchange = async function () {
  checkSecondSurahAyahs(parseInt(this.value));
  setRequirQuantityDetailInput();
};

secondAyahSelect.onchange = async function () {
  if (
    !firstSurahSelect.value ||
    !firstAyahSelect.value ||
    !secondSurahSelect.value ||
    !secondAyahSelect.value
  ) {
    requirQuantityInput.value = "";
    return;
  }
  const query = generatelignCount(
    getAyahDifference(
      firstSurahSelect.options[firstSurahSelect.selectedIndex].dataset.surahNum,
      firstAyahSelect.options[firstAyahSelect.selectedIndex].value,
      secondSurahSelect.options[secondSurahSelect.selectedIndex].dataset
        .surahNum,
      secondAyahSelect.options[secondAyahSelect.selectedIndex].value,
    ),
  );
  const results = quran_db.exec(query);
  if (!results || !results.length || !results[0].values.length) {
    requirQuantityInput.value = "";
    return;
  }
  const totalLines = results[0].values[0][0];
  requirQuantityInput.value = totalLines;
  setRequirQuantityDetailInput();
};

// // Function to get the difference in ayahs between two surahs
const getAyahDifference = (surahNum1, ayahNum1, surahNum2, ayahNum2) => {
  const surah1 = quranData.surahs.find((s) => s.number === Number(surahNum1));
  const surah2 = quranData.surahs.find((s) => s.number === Number(surahNum2));

  if (!surah1 || !surah2) {
    throw new Error("One or both surahs not found");
  }

  // Generate the full ayah ranges for both surahs
  let result = "";
  if (surah1 === surah2) {
    result = [
      {
        number: surah1.number,
        ayah: generateAyahRange(ayahNum1, ayahNum2),
      },
    ];
  } else {
    result = [
      {
        number: surah1.number,
        ayah: generateAyahRange(ayahNum1, surah1.numberOfAyahs),
      },
    ];

    if (surah2.number - surah1.number > 1) {
      for (let i = surah1.number + 1; i <= surah2.number - 1; i++) {
        result.push({
          number: i,
          ayah: generateAyahRange(),
        });
      }
    }

    result.push({
      number: surah2.number,
      ayah: generateAyahRange(1, ayahNum2),
    });
  }

  // Include all surahs between them if they're not consecutive
  const start = Math.min(surah1.number, surah2.number);
  const end = Math.max(surah1.number, surah2.number);

  for (let i = start + 1; i < end; i++) {
    const betweenSurah = quranData.surahs.find((s) => s.number === i);
    if (betweenSurah) {
      result.slice(result.length - 1, 0, {
        number: betweenSurah.number,
        ayah: generateAyahRange(1, betweenSurah.numberOfAyahs),
      });
    }
  }

  return result;
};

const generateAyahRange = (start, end) => {
  if (!end && !start) return "";
  return `${start}-${end}`;
};

const generatelignCount = (ranges) => {
  const conditions = ranges
    .map((range) => {
      if (range.ayah) {
        const [start, end] = range.ayah.split("-").map(Number);
        return `(sura = ${range.number} AND ayah BETWEEN ${start} AND ${end})`;
      } else {
        return `(sura = ${range.number} AND ayah)`;
      }
    })
    .join(" OR\n  ");

  return `
    SELECT 
      ROUND(SUM(lign_count), 1) AS rounded_total
    FROM quran_ayat
    WHERE ${conditions};
  `;
};

function deleteTableRow(tableSelector, columnName, columnValue) {
  const table = $(tableSelector).DataTable();
  table.rows().every(function () {
    var rowData = this.data();
    if (rowData[columnName] === columnValue) {
      this.remove();
    }
  });
  table.draw();
}

function CreateOnClickUndo(button, actionFunction, removeBtn = false) {
  button.setAttribute("data-count", "");
  const buttonClassName = button.className;
  const buttonText = button.innerHTML;

  let countdownInterval;
  let actionTimeout;
  const delaySeconds = 3;

  button.onclick = function handleButtonClick(e) {
    const currentState = button.classList.contains("UndoCountdown")
      ? "UndoCountdown"
      : "initial";

    switch (currentState) {
      case "initial":
        // Clear any existing timers
        clearInterval(countdownInterval);
        clearTimeout(actionTimeout);

        // Set visual state
        button.className = buttonClassName + " UndoCountdown";
        button.style.backgroundColor = "#fbbc05";
        // button.style.paddingRight = '50px';
        button.textContent = "تراجع";
        button.dataset.count = delaySeconds;

        // Start countdown display
        let secondsRemaining = delaySeconds;
        countdownInterval = setInterval(() => {
          secondsRemaining--;
          button.dataset.count = secondsRemaining;

          if (secondsRemaining <= 0) {
            clearInterval(countdownInterval);
            // Don't execute here - the timeout will handle it
          }
        }, 1000);

        // Set action timer
        actionTimeout = setTimeout(() => {
          clearInterval(countdownInterval);
          if (removeBtn) {
            button.remove();
          } else {
            button.className = buttonClassName;
            button.style.removeProperty("background-color");
            button.innerHTML = buttonText;
            button.dataset.count = "";
          }
          actionFunction(e);
        }, delaySeconds * 1000);
        break;
      case "UndoCountdown":
        // Clear all timers
        clearInterval(countdownInterval);
        clearTimeout(actionTimeout);

        // Reset visual state
        button.className = buttonClassName;
        button.style.removeProperty("background-color");
        button.innerHTML = buttonText;
        button.dataset.count = "";
        break;
    }
  };
}

// Function to count lines in a given text
// function countLines(text) {
//   const ctx = document.createElement("canvas").getContext("2d");
//   ctx.font = "22.4px Arial";
//   ctx.direction = "rtl";
//   return ctx.measureText(text).width / (10 * 37.8);
// }

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", function () {
  // Google Sign In Button
  if (googleSigninBtn) {
    googleSigninBtn.addEventListener("click", googleSignin);
  }

  // Create New DB Buttons
  const createNewDBBtn1 = document.getElementById("createNewDBBtn1");
  if (createNewDBBtn1) {
    createNewDBBtn1.addEventListener("click", createNewDB);
  }

  const createNewDBBtn2 = document.getElementById("createNewDBBtn2");
  if (createNewDBBtn2) {
    createNewDBBtn2.addEventListener("click", createNewDB);
  }

  // Day Date Icon
  const dayDateIcon = document.getElementById("dayDateIcon");
  if (dayDateIcon) {
    dayDateIcon.addEventListener("click", function () {
      dayDateInput._flatpickr.setDate(
        new Date().toISOString().slice(0, 10),
        true,
      );
    });
  }

  // Add New Day Button
  const addNewDayBtn = document.getElementById("addNewDayBtn");
  if (addNewDayBtn) {
    addNewDayBtn.addEventListener("click", showApopintmentTimePicker);
  }

  // Goal Button (Evaluation Ladder)
  const goalBtn = document.getElementById("goal");
  if (goalBtn) {
    goalBtn.addEventListener("click", function () {
      document.getElementById("list-retard-list").click();
    });
  }

  // Update Eval Ladder Button
  const updateEvalLadderBtn = document.getElementById("updateEvalLadderBtn");
  if (updateEvalLadderBtn) {
    updateEvalLadderBtn.addEventListener("click", updateEvalLadder);
  }

  // Add Eval Ladder Buttons
  const addEvalLadderBehaviorBtn = document.getElementById(
    "addEvalLadderBehaviorBtn",
  );
  if (addEvalLadderBehaviorBtn) {
    addEvalLadderBehaviorBtn.addEventListener("click", function () {
      addEvalLadder("behavior");
    });
  }

  const addEvalLadderClothingBtn = document.getElementById(
    "addEvalLadderClothingBtn",
  );
  if (addEvalLadderClothingBtn) {
    addEvalLadderClothingBtn.addEventListener("click", function () {
      addEvalLadder("clothing");
    });
  }

  const addEvalLadderHaircutBtn = document.getElementById(
    "addEvalLadderHaircutBtn",
  );
  if (addEvalLadderHaircutBtn) {
    addEvalLadderHaircutBtn.addEventListener("click", function () {
      addEvalLadder("haircut");
    });
  }

  // Init Bullentin Configs Button
  const initBullentinConfigsBtn = document.getElementById(
    "initBullentinConfigsBtn",
  );
  if (initBullentinConfigsBtn) {
    initBullentinConfigsBtn.addEventListener("click", initBullentinConfigs);
  }

  // Resume Pages Check
  if (resumePagesCheck) {
    resumePagesCheck.addEventListener("change", function () {
      localStorage.setItem("bulletinResumPage", this.checked);
    });
  }

  // Signature Check
  if (signatureCheck) {
    signatureCheck.addEventListener("change", function () {
      localStorage.setItem("bulletinSignature", this.checked);
    });
  }

  // Show Tab Buttons
  const showTabHomeBtn = document.getElementById("showTabHomeBtn");
  if (showTabHomeBtn) {
    showTabHomeBtn.addEventListener("click", function () {
      showTab("pills-home");
    });
  }

  const showTabStudentsBtn = document.getElementById("showTabStudentsBtn");
  if (showTabStudentsBtn) {
    showTabStudentsBtn.addEventListener("click", function () {
      showTab("pills-students");
    });
  }

  const showTabNewDayBtn = document.getElementById("showTabNewDayBtn");
  if (showTabNewDayBtn) {
    showTabNewDayBtn.addEventListener("click", function () {
      showTab("pills-new_day");
    });
  }

  const showTabStatisticsBtn = document.getElementById("showTabStatisticsBtn");
  if (showTabStatisticsBtn) {
    showTabStatisticsBtn.addEventListener("click", function () {
      showTab("pills-statistics");
    });
  }

  const showTabPreferencesBtn = document.getElementById(
    "showTabPreferencesBtn",
  );
  if (showTabPreferencesBtn) {
    showTabPreferencesBtn.addEventListener("click", function () {
      showTab("pills-preferences");
    });
  }

  // Minimize Modal Button
  const minimizeModalBtn = document.getElementById("minimizeModalBtn");
  if (minimizeModalBtn) {
    minimizeModalBtn.addEventListener("click", minimizeModal);
  }

  // Save And Close Button
  const saveAndCloseBtn = document.getElementById("saveAndCloseBtn");
  if (saveAndCloseBtn) {
    saveAndCloseBtn.addEventListener("click", function () {
      studentDayFormSubmitBtn.dispatchEvent(new Event("click"));
    });
  }

  // Time Adjustment Buttons
  const adjustTimePlus15Btn = document.getElementById("adjustTimePlus15Btn");
  if (adjustTimePlus15Btn) {
    adjustTimePlus15Btn.addEventListener("click", function () {
      adjustApointementTimeMinutes(15);
    });
  }

  const setTimeNowBtn = document.getElementById("setTimeNowBtn");
  if (setTimeNowBtn) {
    setTimeNowBtn.addEventListener("click", setApointementTimeToNow);
  }

  const adjustTimeMinus15Btn = document.getElementById("adjustTimeMinus15Btn");
  if (adjustTimeMinus15Btn) {
    adjustTimeMinus15Btn.addEventListener("click", function () {
      adjustApointementTimeMinutes(-15);
    });
  }

  // Add New Study Day Button
  const addNewStudyDayBtn = document.getElementById("addNewStudyDayBtn");
  if (addNewStudyDayBtn) {
    addNewStudyDayBtn.addEventListener("click", addNewStudyDay);
  }

  // Attendance Radio Buttons
  const attendanceRadios = document.querySelectorAll(
    'input[name="attendance"]',
  );
  attendanceRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      onChangeAttendanceState(this);
      studentDayFormSubmitBtn.disabled = false;
      studentDayFormSubmitBtn.nextElementSibling.disabled = false;
    });
  });
});
