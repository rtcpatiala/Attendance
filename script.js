const API_URL =
  "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

let allStudents = [];

// ✅ Load Dashboard
async function loadUltimateDashboard() {

  let res = await fetch(API_URL + "?action=students");
  allStudents = await res.json();

  // Total Students
  document.getElementById("totalStudents").innerHTML =
    "👨‍🎓 Total Students: " + allStudents.length;

  // Batch Dropdown
  let batches = [...new Set(allStudents.map(s => s.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(b => {
    dropdown.innerHTML += `<option value="${b}">${b}</option>`;
  });

  dropdown.onchange = showBatchStudents;

  // Default show first batch
  showBatchStudents();
}

// ✅ Show Students in Batch
function showBatchStudents() {

  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let box = document.getElementById("batchStudents");

  box.innerHTML = `<h3>👥 Students in ${batch}</h3>`;

  filtered.forEach(stu => {
    box.innerHTML += `<p>👤 ${stu.name}</p>`;
  });
}
