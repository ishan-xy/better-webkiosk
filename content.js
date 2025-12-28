(async function () {
  const loginForm = document.querySelector("form[name='LoginForm']");
  if (loginForm) {

    chrome.storage.local.get(
      ["wk_enroll", "wk_password_encrypted", "wk_auto_login"],
      async (res) => {

        if (!res.wk_auto_login) return;
        if (!res.wk_enroll || !res.wk_password_encrypted) return;

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
          console.error("WebKiosk decrypt error:", e);
        }
      }
    );
  }

  function parseMarksTable() {

    const table = document.getElementById("table-1");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const subjects = {};

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 9) return;

      const subjectText = cells[2].innerText.trim();
      const match = subjectText.match(/\(([^)]+)\)/);
      if (!match) return;

      const subjectCode = match[1]; // UML501
      const weightage   = parseFloat(cells[6].innerText.trim()) || 0;
      const effective   = parseFloat(cells[7].innerText.trim()) || 0;

      if (!subjects[subjectCode]) {
        subjects[subjectCode] = {
          name: subjectText,
          totalEffective: 0,
          totalWeightage: 0
        };
      }

      subjects[subjectCode].totalEffective += effective;
      subjects[subjectCode].totalWeightage += weightage;
    });

    injectSummary(subjects);
  }

function injectSummary(subjects) {

  // Remove old summary if exists
  const old = document.getElementById("wk-summary");
  if (old) old.remove();

  const subjectList = Object.values(subjects);

  // SORT:
  // 1) total weightage (desc)
  // 2) total effective (desc)
  subjectList.sort((a, b) => {
    if (b.totalWeightage !== a.totalWeightage) {
      return b.totalWeightage - a.totalWeightage;
    }
    return b.totalEffective - a.totalEffective;
  });

  const box = document.createElement("div");
  box.id = "wk-summary";
  box.style.cssText = `
    margin: 12px;
    padding: 12px;
    background: #fff7e6;
    border: 2px solid #ff8c00;
    font-family: Arial;
  `;

  const title = document.createElement("h3");
  title.innerText = "📊 Subject-wise Effective Marks";
  title.style.margin = "0 0 10px 0";
  box.appendChild(title);

  // Header row
  const header = document.createElement("div");
  header.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 120px 120px 140px;
    font-weight: bold;
    margin-bottom: 6px;
  `;
  header.innerHTML = `
    <div>Subject</div>
    <div>To Pass</div>
    <div>Total Scored</div>
    <div>Total Weightage</div>
  `;
  box.appendChild(header);

  subjectList.forEach(sub => {

    const total = sub.totalEffective;
    const weightage = sub.totalWeightage;
    const required = 35 - total;
    const passed = required <= 0;

    const row = document.createElement("div");
    row.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 120px 120px 140px;
      padding: 6px 0;
      align-items: center;
      ${passed ? "background:#e6f7ea;" : ""}
    `;

    const name = document.createElement("div");
    name.innerText = sub.name;
    name.style.fontWeight = "bold";

    const need = document.createElement("div");
    need.innerText = passed ? "PASS" : required.toFixed(1);
    need.style.textAlign = "left";
    if (passed) need.style.color = "#1e7e34";

    const scored = document.createElement("div");
    scored.innerText = total.toFixed(1);
    scored.style.textAlign = "left";

    const totalW = document.createElement("div");
    totalW.innerText = weightage.toFixed(0);
    totalW.style.textAlign = "left";

    row.appendChild(name);
    row.appendChild(need);
    row.appendChild(scored);
    row.appendChild(totalW);

    box.appendChild(row);
  });

  const table = document.getElementById("table-1");
  table.parentNode.insertBefore(box, table.nextSibling);
}

  // WebKiosk loads slowly → wait before parsing
  setTimeout(parseMarksTable, 800);

})();
