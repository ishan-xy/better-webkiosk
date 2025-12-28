# 🚀 Better WebKiosk (Chrome Extension)

A secure, student-friendly Chrome extension for **Thapar WebKiosk** that provides:

* 🔐 **Encrypted Auto-Login**
* 📊 **Smart Subject-wise Marks Summary** (pass status, required marks, totals)

Everything runs **locally in your browser** — no servers, no tracking, no nonsense.

---

## ✨ Features

### 🔐 Secure Auto-Login

* AES-256-GCM encrypted credential storage
* PBKDF2 key derivation using Enrollment Number
* Auto-login toggle (ON / OFF anytime)
* Credentials stored **only in Chrome local storage**

### 📊 Subject-wise Marks Analyzer (NEW)

* Aggregates **Effective Marks** per subject
* Shows:

  * **To Pass** (PASS or marks required)
  * **Total Scored**
  * **Total Weightage**
* Subjects automatically **sorted by importance**

  * Higher total weightage first
  * Then higher marks scored
* Passed subjects highlighted **green**
* Works even if:

  * Subjects are unsorted
  * New events are added
  * Weightage ≠ 100

> All calculations are done directly from the WebKiosk marks table — no hardcoding.

---

## 🖼️ Preview

*(Auto-login popup + marks summary appear directly on WebKiosk)*

<img width="342" height="234" alt="image" src="https://github.com/user-attachments/assets/00dbbb1b-74ad-4336-a4c0-71fd7f26d82b" />

---

## 📦 Installation (Manual)

This extension is **not published on the Chrome Web Store**.

### 1️⃣ Download

```bash
git clone https://github.com/ishan-xy/better-webkiosk.git
```

Or download ZIP → extract.

Folder should contain:

```
manifest.json
popup.html
popup.js
content.js
crypto.js
```

---

### 2️⃣ Load in Chrome

1. Open Chrome
2. Go to:

   ```
   chrome://extensions/
   ```
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder

Pin the extension for easy access.

---

## 🔧 Setup

1. Open the extension popup
2. Enter:

   * **Enrollment Number**
   * **Password / PIN**
3. Click **Save**
4. Toggle **Auto-Login ON** (optional)

* 🔵 ON → WebKiosk logs in automatically
* ⚪ OFF → Credentials stay saved, no auto-login

---

## 📊 Marks Summary – How It Works

When you open:

```
Examination → View Student Subject Marks (Eventwise)
```

The extension:

1. Reads the marks table inside WebKiosk iframe
2. Groups events by **Subject Code**
3. Calculates:

   * Total Effective Marks
   * Total Weightage
4. Computes:

   * **To Pass** = `35 − total scored`
5. Displays a clean summary **below the table**

### Sorting Logic

1. Higher **Total Weightage**
2. Higher **Total Scored**

No percentages, no assumptions.

---

## 🔐 Security Details

* AES-256-GCM encryption
* PBKDF2 (150,000 iterations, SHA-256)
* Enrollment number used as key material
* Data stored only via `chrome.storage.local`
* No network requests
* No analytics, tracking, or logging

---

## 🧩 File Structure

```
📁 Better-webkiosk/
 ├── manifest.json        # Extension config (iframe support enabled)
 ├── popup.html           # UI for credentials & toggle
 ├── popup.js             # Save / clear credentials
 ├── content.js           # Auto-login + marks summary logic
 ├── crypto.js            # Encryption helpers
```

---

## 📄 License

MIT License — free to use, modify, and improve.

---

If you want, next I can:

* tighten wording further for **GitHub stars**
* add a **Features GIF**
* write a **short repo description**
* add a **Security.md**

Just tell me.
