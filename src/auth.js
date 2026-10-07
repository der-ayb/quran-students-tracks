import { DateTime } from "luxon";
import {
  project_db,
  workingClassroomId,
  loadingModalShowNumber,
  asyncDB,
  loadDBFromFile,
} from "./script";
import swal from "sweetalert";

let currentUser;
let userIsAuth = false;
let db;

const googleSigninBtn = document.getElementById("googleSigninBtn");
if (googleSigninBtn) {
  googleSigninBtn.addEventListener("click", googleSignin);
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

export function fromNow(date) {
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
//     scope: "https://www.googleapis.com/auth/drive.readonly",
//     callback: async (tokenResponse) => {
//       if (tokenResponse && tokenResponse.access_token) {
//         await putAccessToken(db, tokenResponse.access_token);
//       }
//     },
//   });
//   client.requestAccessToken();
// }

function updateLoginStatus() {
  const loginStatus = document.getElementById("loginStatus");
  const updateTime = fromNow(localStorage.getItem("lastUpdateTime"));
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

export async function initAuth() {
  await openAuthDB().then(async (res) => {
    db = res;
    const idToken = await getToken(db);
    if (idToken) {
      currentUser = decodeJwt(idToken);
      userIsAuth = true;
    }
    updateLoginStatus();
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
  updateLoginStatus();
}

function selectFile(files = [], allowCreate = true) {
  return new Promise((resolve) => {
    // --- بناء محتوى النافذة كـ DOM Node (sweetalert لا يقبل نص HTML) ---
    const wrap = document.createElement("div");
    wrap.className = "sal-wrap";
    wrap.setAttribute("dir", "rtl");

    // عنوان القسم
    const listLabel = document.createElement("label");
    listLabel.className = "sal-label";
    listLabel.textContent = "الملفات الموجودة سابقاً في حسابك";
    wrap.appendChild(listLabel);

    // قائمة الملفات أو رسالة فارغة
    if (files.length) {
      const ul = document.createElement("ul");
      ul.className = "sal-file-list";

      files.forEach((file, i) => {
        const li = document.createElement("li");
        li.className = "sal-file-item";
        li.dataset.index = String(i);
        li.setAttribute("role", "button");
        li.tabIndex = 0;

        const nameEl = document.createElement("span");
        nameEl.className = "sal-file-name";
        nameEl.textContent = `${file.name||"بدون اسم"}`;

        const timeEl = document.createElement("span");
        timeEl.className = "sal-file-time";
        timeEl.textContent = fromNow(file.modifiedTime);
        timeEl.title = file.modifiedTime
          ? new Date(file.modifiedTime).toLocaleString("ar")
          : "";

        li.appendChild(nameEl);
        li.appendChild(timeEl);

        li.addEventListener("click", () => {
          finish(file);
        });
        li.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          finish(file);
        });

        ul.appendChild(li);
      });

      wrap.appendChild(ul);
    } else {
      const empty = document.createElement("div");
      empty.className = "sal-empty";
      empty.textContent = allowCreate
        ? "لا توجد ملفات بعد — أنشئ ملفاً من الأسفل."
        : "لا توجد ملفات.";
      wrap.appendChild(empty);
    }

    // قسم الإنشاء
    if (allowCreate) {
      const create = document.createElement("div");
      create.className = "sal-create";

      const label = document.createElement("label");
      label.className = "sal-label";
      label.htmlFor = "salNewFile";
      label.textContent = "إنشاء ملف جديد";

      const row = document.createElement("div");
      row.className = "sal-input-row";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "salNewFile";
      input.className = "sal-input";
      input.placeholder = "اسم المدرس";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "salCreateBtn";
      btn.className = "sal-btn";
      btn.textContent = "إنشاء";

      const err = document.createElement("div");
      err.className = "sal-error";
      err.id = "salCreateErr";

      const createNew = () => {
        const name = input.value.trim();
        if (!name) {
          err.textContent = "الرجاء إدخال اسم الملف.";
          input.focus();
          return;
        }
        if (files.some((f) => f.name === name)) {
          err.textContent = "يوجد ملف بهذا الاسم بالفعل.";
          input.focus();
          return;
        }
        err.textContent = "";
        finish({ name });
      };

      btn.addEventListener("click", createNew);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          createNew();
        }
      });

      row.appendChild(input);
      row.appendChild(btn);
      create.appendChild(label);
      create.appendChild(row);
      create.appendChild(err);
      wrap.appendChild(create);
    }

    // --- إغلاق / إلغاء ---
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
      swal.close(); // يغلق النافذة كما لو ضُغط زر الإلغاء
    };

    // --- استدعاء sweetalert ---
    swal({
      title: "اختيار ملف",
      content: wrap, // Node وليس HTML string
      className: "sal-modal",
      buttons: {
        cancel: { text: "إلغاء", visible: true, closeModal: true },
        confirm: { visible: false },
      },
      closeOnClickOutside: false,
      closeOnEsc: true,
    }).then((value) => {
      // إذا أُغلقت بدون اختيار → null
      if (!settled) {
        settled = true;
        resolve(null);
      }
    });

    // إتاحة التركيز على حقل الإدخال بعد الفتح
    if (allowCreate) {
      setTimeout(() => {
        const input = document.querySelector(".sweet-alert #salNewFile");
        if (input) input.focus();
      }, 0);
    }
  });
}

async function searchFileInDrive(accessToken = null) {
  if (loadingModalShowNumber.length)
    await showLoadingModal("جاري البحث عن قاعدة بيانات سابقة");
  if (!accessToken) accessToken = await getAccessToken(db);
  // Search for the file named 'quran_students.sqlite3'
  const query = encodeURIComponent(
    "name contains '.quran_students.sqlite3' and trashed=false",
  );
  const listResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  hideLoadingModal();

  if (!listResponse.ok) {
    await logout();
    return [];
  }

  const listResult = await listResponse.json();
  if (!listResult.files || listResult.files.length === 0) {
    return [];
  }

  return listResult.files;
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
            updateLoginStatus();

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
export async function uploadDBtoDrive(data) {
  if (!userIsAuth) {
    throw new Error("عليك تسجيل الدخول أولا.");
  }

  const accessToken = await getAccessToken(db);

  if (!accessToken) {
    throw new Error("خطأ في المصادقة، يرجى إعادة تسجيل الدخول.");
  }
  let fileId = null;
  // Check if a file named 'quran_students.sqlite3' already exists.
  const pre_files = (await searchFileInDrive(accessToken)).map((file) => ({
    ...file,
    name: file.name.slice(0, -23),
  }));

  await hideLoadingModal();
  const file = await selectFile(pre_files);
  if (!file) return false; // User canceled the selection
  if (file.id) {
    if (
      !confirm(
        `سيتم استبدال قاعدة البيانات ${file.name} التي في حسابك ⬆️, هل أنت موافق؟`,
      )
    ) {
      return false;
    }
    fileId = file.id;
  }

  await showLoadingModal("جاري رفع قاعدة البيانات إلى Google Drive");
  const metadata = {
    name: file.name + ".quran_students.sqlite3",
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
  localStorage.setItem("lastUpdateTime", new Date());
  updateLoginStatus();
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

  const pre_files = (await searchFileInDrive(accessToken)).map((file) => ({
    ...file,
    name: file.name.slice(0, -23),
  }));
  if (!pre_files.length) {
    return null;
  }

  await hideLoadingModal();
  const file = await selectFile(pre_files, false);
  if (!file) return false; // User canceled the selection

  const fileId = file.id;

  if (
    !confirm(
      `تم العثور على قاعدة بيانات في حسابك ${fromNow(file.modifiedTime)}، هل تريد تنزيلها⬇️؟`,
    )
  ) {
    return false;
  }

  await showLoadingModal("جاري تنزيل قاعدة البيانات من Google Drive");

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
