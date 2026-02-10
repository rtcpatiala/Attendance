// ✅ Google Sheet API URL
const API_URL = "YOUR_SCRIPT_URL_HERE";

// -----------------------------
// DASHBOARD LOAD
// -----------------------------
async function loadDashboard() {

  let res = await fetch(API_URL + "?action=students");
  let students = await res.json();

  document.getElementById("totalStudents").innerText =
    "Total Students: " + students.length;

  let batches = [...new Set(students.map(s => s.batch))];

  document.getElementById("totalBatches").innerText =
    "Total Batches: " + batches.length;

  // Show Batch List
  let batchDiv = document.getElementById("batchList");
  batchDiv.innerHTML = "";

  batches.forEach(batch => {
    let btn = document.createElement("button");
    btn.innerText = batch;
    btn.onclick = () => alert("Open Batch: " + batch);
    batchDiv.appendChild(btn);
  });
}

// -----------------------------
// ADMIN: ADD BATCH
// -----------------------------
function addBatch() {
  let batch = document.getElementById("newBatch").value;
  alert("Batch Added: " + batch);
}

// -----------------------------
// ADMIN: ADD STUDENT
// -----------------------------
async function addStudent() {

  let batch = document.getElementById("batchSelect").value;
  let name = document.getElementById("newStudent").value;

  let data = {
    type: "student",
    batch: batch,
    name: name
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Student Added ✅");
}

// -----------------------------
// STUDENT PROFILE REPORT
// -----------------------------
async function loadStudentProfile() {

  let params = new URLSearchParams(window.location.search);
  let student = params.get("name");

  document.getElementById("studentName").innerText =
    "Attendance Report: " + student;

  let res = await fetch(API_URL + "?action=attendance");
  let records = await res.json();

  let studentRecords = records.filter(r => r.student === student);

  document.getElementById("studentReport").innerHTML =
    "Total Days: " + studentRecords.length;
}

// Auto Load Page
if (document.getElementById("totalStudents")) loadDashboard();
if (document.getElementById("studentName")) loadStudentProfile();
