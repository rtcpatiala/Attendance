const API_URL = "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

// ✅ Dashboard Summary
async function loadDashboard() {
  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let total = data.length;

  document.getElementById("stats").innerHTML =
    `<h3>Total Students: ${total}</h3>`;
}

// ✅ Load Batches Dropdown
async function loadBatches() {
  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let batches = [...new Set(data.map(x => x.batch))];

  let dropdown = document.getElementById("batchSelect");

  dropdown.innerHTML = "";

  batches.forEach(b => {
    dropdown.innerHTML += `<option>${b}</option>`;
  });

  showStudents();
}

// ✅ Show Students List
async function showStudents() {
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
    body: JSON.stringify({ type: "student", batch, name })
  });

  alert("Student Added ✅");
  showStudents();
}
// ✅ Load Batches for Attendance Page
async function loadAttendanceBatches() {

  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let batches = [...new Set(data.map(x => x.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(b => {
    dropdown.innerHTML += `<option value="${b}">${b}</option>`;
  });

  // Load Students Automatically
  showAttendanceStudents();

  dropdown.onchange = showAttendanceStudents;
}


// ✅ Show Students with Checkbox
async function showAttendanceStudents() {

  let batch = document.getElementById("batchSelect").value;

  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let students = data.filter(x => x.batch === batch);

  let box = document.getElementById("attendanceList");
  box.innerHTML = "";

  if (students.length === 0) {
    box.innerHTML = "❌ No Students Found!";
    return;
  }

  students.forEach((s, index) => {

    box.innerHTML += `
      <label style="display:block; padding:8px;">
        <input type="checkbox" id="st${index}">
        ${s.name}
      </label>
    `;
  });
}


// ✅ Save Attendance to Google Sheet
async function saveAttendance() {

  let batch = document.getElementById("batchSelect").value;

  let res = await fetch(API_URL + "?action=students");
  let data = await res.json();

  let students = data.filter(x => x.batch === batch);

  let today = new Date().toLocaleDateString();

  for (let i = 0; i < students.length; i++) {

    let checked = document.getElementById("st" + i).checked;

    let status = checked ? "Present" : "Absent";

    // Send Attendance to Sheet
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        type: "attendance",
        date: today,
        batch: batch,
        student: students[i].name,
        status: status
      })
    });
  }

  alert("✅ Attendance Saved Successfully!");
}
