// content.js
(async function () {

  const loginForm = document.querySelector("form[name='LoginForm']");
  if (!loginForm) return;

  chrome.storage.local.get(
    ["wk_enroll", "wk_password_encrypted", "wk_auto_login"],
    async (res) => {
      if (!res.wk_auto_login) {
        console.log("WebKiosk AutoLogin: disabled.");
        return;
      }

      if (!res.wk_enroll || !res.wk_password_encrypted) {
        console.log("WebKiosk AutoLogin: no credentials saved.");
        return;
      }

      try {
        const keyMaterial = await getKeyMaterial(res.wk_enroll);
        const key = await getKey(keyMaterial);
        const password = await decryptPassword(res.wk_password_encrypted, key);

        function fill() {
          const userType = document.querySelector("select[name='UserType']");
          const member   = document.querySelector("input[name='MemberCode']");
          const pass     = document.querySelector("input[name='Password']");
          const submit   = document.querySelector("input[name='BTNSubmit']");

          if (!userType || !member || !pass) {
            return setTimeout(fill, 150);
          }

          userType.value = "S";
          member.value   = res.wk_enroll;
          pass.value     = password;

          setTimeout(() => submit.click(), 200);
        }

        fill();
      } catch (e) {
        console.error("Decryption error:", e);
      }

    }
  );

})();
