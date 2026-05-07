import { DateTime } from "luxon";
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
export async function initAuth() {
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
export async function initializeGoogleAuth(callback) {
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

