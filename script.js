// ✅ Google Apps Script API URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

let allStudents = [];

/* ===================================================
   ✅ DASHBOARD PAGE
=================================================== */

// Dashboard Summary
async function loadDashboard() {
  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  document.getElementById("stats").innerHTML = `
    <h3>Total Students: ${data.length}</h3>
  `;
}

/* ===================================================
   ✅ ADMIN PANEL
=================================================== */

// Load batches dropdown
async function loadAdminBatches() {
  let res = await fetch(API_URL + "?action=students");
  allStudents = await res.json();

  let batches = [...new Set(allStudents.map(s => s.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(batch => {
    dropdown.innerHTML += `<option value="${batch}">${batch}</option>`;
  });

  showAdminStudents();
}

// Show students list
function showAdminStudents() {
  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let box = document.getElementById("studentList");
  box.innerHTML = "";

  filtered.forEach(stu => {
    box.innerHTML += `<p>👤 ${stu.name}</p>`;
  });
}

// Add Student
async function addStudent() {
  let batch = document.getElementById("batchSelect").value;
  let name = document.getElementById("studentName").value;

  if (name.trim() === "") {
    alert("Enter Student Name!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "student",
      batch: batch,
      name: name
    })
  });

  alert("Student Added ✅");

  document.getElementById("studentName").value = "";
  loadAdminBatches();
}

/* ===================================================
   ✅ ATTENDANCE PAGE
=================================================== */

// Load Attendance batches dropdown
async function loadAttendanceBatches() {
  let res = await fetch(API_URL + "?action=students");
  allStudents = await res.json();

  let batches = [...new Set(allStudents.map(s => s.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(batch => {
    dropdown.innerHTML += `<option value="${batch}">${batch}</option>`;
  });

  showAttendanceStudents();
}

// Show students with checkboxes
function showAttendanceStudents() {
  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let box = document.getElementById("attendanceList");
  box.innerHTML = "";

  if (filtered.length === 0) {
    box.innerHTML = "❌ No Students Found!";
    return;
  }

  filtered.forEach((stu, i) => {
    box.innerHTML += `
      <label style="display:block; padding:8px; font-size:18px;">
        <input type="checkbox" id="st${i}">
        ${stu.name}
      </label>
    `;
  });
}

// Save Attendance
async function saveAttendance() {
  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let today = new Date().toLocaleDateString();

  for (let i = 0; i < filtered.length; i++) {
    let checked = document.getElementById("st" + i).checked;
    let status = checked ? "Present" : "Absent";

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        type: "attendance",
        date: today,
        batch: batch,
        student: filtered[i].name,
        status: status
      })
    });
  }

  alert("✅ Attendance Saved Successfully!");
}
// ✅ Load Admin Panel
async function loadAdminPanel() {

  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let batches = [...new Set(data.map(x => x.batch))];

  let dropdown = document.getElementById("batchSelect");

  dropdown.innerHTML = "";

  batches.forEach(b => {
    dropdown.innerHTML += `<option>${b}</option>`;
  });

  dropdown.onchange = showAdminStudents;

  showAdminStudents();
}


// ✅ Show Students List
async function showAdminStudents() {

  let batch = document.getElementById("batchSelect").value;

  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let filtered = data.filter(x => x.batch === batch);

  let box = document.getElementById("studentList");
  box.innerHTML = "";

  filtered.forEach(s => {
    box.innerHTML += `<p>👤 ${s.name}</p>`;
  });
}


// ✅ Add Student
async function addStudent() {

  let batch = document.getElementById("batchSelect").value;
  let name = document.getElementById("studentName").value;

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "addStudent",
      batch: batch,
      name: name
    })
  });

  alert("Student Added ✅");
  showAdminStudents();
}


// ✅ Delete Student
async function deleteStudent() {

  let batch = document.getElementById("batchSelect").value;
  let name = document.getElementById("deleteName").value;

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "deleteStudent",
      batch: batch,
      name: name
    })
  });

  alert("Student Deleted ✅");
  showAdminStudents();
}


// ✅ Rename Student
async function renameStudent() {

  let batch = document.getElementById("batchSelect").value;
  let oldName = document.getElementById("oldName").value;
  let newName = document.getElementById("newName").value;

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "renameStudent",
      batch: batch,
      oldName: oldName,
      newName: newName
    })
  });

  alert("Student Renamed ✅");
  showAdminStudents();
}
