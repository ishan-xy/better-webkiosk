// popup.js
async function $(id){ return document.getElementById(id); }

async function save() {
  const enroll = (await $('enroll')).value.trim();
  const password = (await $('password')).value;

  const msg = await $('msg');
  msg.style.color = "red";

  if (!enroll || !password) {
    msg.textContent = "Enrollment and password required.";
    return;
  }

  try {
    const keyMaterial = await getKeyMaterial(enroll);
    const key = await getKey(keyMaterial);
    const encrypted = await encryptPassword(password, key);

    chrome.storage.local.set({
      wk_enroll: enroll,
      wk_password_encrypted: encrypted
    }, () => {
      msg.style.color = "green";
      msg.textContent = "Credentials saved!";
      $('password').then(p => p.value = "");
    });

  } catch (err) {
    console.error(err);
    msg.textContent = "Encryption failed.";
  }
}

function clearStored() {
  chrome.storage.local.remove(["wk_enroll", "wk_password_encrypted"], () => {
    $('msg').then(m => { 
      m.style.color = "green";
      m.textContent = "Credentials cleared."; 
    });
  });
}

function handleToggle() {
  const t = document.getElementById("autoLoginToggle").checked;
  chrome.storage.local.set({ wk_auto_login: t });
}

document.addEventListener("DOMContentLoaded", () => {
  $("saveBtn").then(b => b.addEventListener("click", save));
  $("clearBtn").then(b => b.addEventListener("click", clearStored));
  $("autoLoginToggle").then(t => t.addEventListener("change", handleToggle));

  chrome.storage.local.get(["wk_auto_login", "wk_enroll"], (res) => {
    $("autoLoginToggle").then(t => t.checked = res.wk_auto_login === true);
    
    if (res.wk_enroll) {
      $("msg").then(m => {
        m.style.color = "black";
        m.textContent = `Stored for: ${res.wk_enroll}`;
      });
    }
  });
});
