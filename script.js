const API_URL =
  "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

let allStudents = [];

/* ===============================
   ✅ LOAD ADMIN PANEL
================================ */

async function loadAdminBatches() {
  let res = await fetch(API_URL + "?action=students");
  allStudents = await res.json();

  let batches = [...new Set(allStudents.map(s => s.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(batch => {
    dropdown.innerHTML += `<option value="${batch}">${batch}</option>`;
  });

  dropdown.onchange = showAdminStudents;

  showAdminStudents();
}

/* ===============================
   ✅ SHOW STUDENTS LIST
================================ */

function showAdminStudents() {
  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let box = document.getElementById("studentList");
  box.innerHTML = "";

  filtered.forEach(stu => {
    box.innerHTML += `<p>👤 ${stu.name}</p>`;
  });
}

/* ===============================
   ✅ ADD STUDENT
================================ */

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

/* ===============================
   ✅ DELETE STUDENT
================================ */

async function deleteStudent() {
  let batch = document.getElementById("batchSelect").value;
  let name = document.getElementById("deleteName").value;

  if (name.trim() === "") {
    alert("Enter Student Name to Delete!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "deleteStudent",
      batch: batch,
      name: name
    })
  });

  alert("Student Deleted ✅");

  document.getElementById("deleteName").value = "";
  loadAdminBatches();
}

/* ===============================
   ✅ RENAME STUDENT
================================ */

async function renameStudent() {
  let batch = document.getElementById("batchSelect").value;
  let oldName = document.getElementById("oldName").value;
  let newName = document.getElementById("newName").value;

  if (oldName.trim() === "" || newName.trim() === "") {
    alert("Enter Old + New Name!");
    return;
  }

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

  document.getElementById("oldName").value = "";
  document.getElementById("newName").value = "";

  loadAdminBatches();
}
