# 🔐 Thapar WebKiosk Secure Auto-Login (Chrome Extension)

A lightweight, secure Chrome extension that **automatically logs you into the Thapar WebKiosk** using encrypted credentials (AES-GCM).  
Your password never leaves your browser — everything is stored locally and encrypted.

<img width="342" height="234" alt="image" src="https://github.com/user-attachments/assets/00dbbb1b-74ad-4336-a4c0-71fd7f26d82b" />

---

## ✨ Features

- 🔒 **AES-256-GCM encryption** for stored credentials  
- 🧬 **PBKDF2 key derivation** using enrollment number  
- ⚡ **Auto-Login** toggle (ON/OFF anytime)  
- 🔐 Credentials stored only in **Chrome local storage**  
- 🚫 No external servers, no data collection  
- 🪶 Minimal UI, small toggle in the popup  
- 🧠 Fully open-source & customizable  

---

## 📦 Installation (No Chrome Web Store Needed)

Since this extension is not published on the Chrome Store, you will install it manually.

### **1️⃣ Download the Extension**
Click the green **Code → Download ZIP** button on this GitHub repo  
or  
Clone the repo:

```bash
git clone https://github.com/ishan-xy/webkiosk-autologin.git
````

Extract the ZIP.

You should now have a folder containing:

```
manifest.json
popup.html
popup.js
content.js
crypto.js
icons/ (optional)
```

---

### **2️⃣ Load Extension in Chrome**

1. Open **Chrome**
2. Go to:

```
chrome://extensions/
```

3. Enable **Developer mode** (top-right)
4. Click **Load unpacked**
5. Select the folder you downloaded

The extension will now appear in your toolbar.

---

## 🔧 Setup Instructions

1. Click the extension icon (puzzle piece → pin it for easier access)
2. Open the extension popup
3. Enter:

   * **Enrollment Number**
   * **Password / PIN**
4. Click **Save**
5. (Optional) Toggle **Auto-Login ON** using the small switch on the top-right

   * 🔵 ON → Automatically fills & submits WebKiosk login
   * ⚪ OFF → Keeps credentials saved but does not auto-login

---

## 🔐 Security Details

* Your password is encrypted using **AES-256-GCM**
* Key is derived from your Enrollment No using **PBKDF2 (150k iterations, SHA-256)**
* All data stored locally using `chrome.storage.local`
* No analytics, no tracking, no network requests
* Your credentials never leave your machine

---

## 🧩 File Structure

```
📁 extension/
 ├── manifest.json        # Chrome extension config
 ├── popup.html           # UI for saving credentials
 ├── popup.js             # Saves encrypted credentials & toggle state
 ├── content.js           # Auto-login logic injected into WebKiosk
 ├── crypto.js            # AES-GCM encryption/decryption helpers
```

---

## 🚀 How Auto-Login Works

When you visit:

```
https://webkiosk.thapar.edu/index.jsp
```

The extension:

1. Checks if Auto-Login is turned ON
2. Decrypts your saved password
3. Fills:

   * User Type → Student (S)
   * Enrollment Number
   * Password
4. Automatically submits the form

If the toggle is OFF → nothing happens, normal login page works as usual.

---

## 📄 License

This project is open-source and available under the MIT License.
