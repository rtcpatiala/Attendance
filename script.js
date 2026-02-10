// ✅ आपका Google Apps Script URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

let allStudents = [];

// ✅ Load Batches Automatically
window.onload = async function () {
  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  allStudents = data;

  let batchSet = new Set();
  data.forEach((s) => batchSet.add(s.batch));

  let batchSelect = document.getElementById("batchSelect");

  batchSet.forEach((b) => {
    let opt = document.createElement("option");
    opt.value = b;
    opt.innerText = b;
    batchSelect.appendChild(opt);
  });

  loadStudents();
};

// ✅ Load Students Batch Wise
function loadStudents() {
  let batch = document.getElementById("batchSelect").value;

  let listDiv = document.getElementById("studentList");
  listDiv.innerHTML = "";

  let students = allStudents.filter((s) => s.batch === batch);

  document.getElementById("total").innerText = students.length;
  document.getElementById("present").innerText = 0;
  document.getElementById("absent").innerText = students.length;

  students.forEach((stu) => {
    let div = document.createElement("div");
    div.className = "studentItem";

    div.innerHTML = `
      <label>
        <input type="checkbox" onchange="updateCount()">
        ${stu.name}
      </label>
    `;

    listDiv.appendChild(div);
  });
}

// ✅ Update Dashboard Counts
function updateCount() {
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let total = checkboxes.length;
  let present = 0;

  checkboxes.forEach((cb) => {
    if (cb.checked) present++;
  });

  document.getElementById("present").innerText = present;
  document.getElementById("absent").innerText = total - present;
}

// ✅ Save Attendance to Google Sheet
async function saveAttendance() {
  let batch = document.getElementById("batchSelect").value;
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let students = allStudents.filter((s) => s.batch === batch);

  let today = new Date().toLocaleDateString();

  for (let i = 0; i < students.length; i++) {
    let status = checkboxes[i].checked ? "Present" : "Absent";

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        type: "attendance",
        date: today,
        batch: batch,
        student: students[i].name,
        status: status,
      }),
    });
  }

  alert("✅ Attendance Saved Successfully!");
}
