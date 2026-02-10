// ✅ Google Apps Script API URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxGRu4vGWv7lrwzCaNMgLcg2kt99I2hpShCBRWljLiVJYN13gX9LKUSg4IseDIm4gFUMg/exec";

let allStudents = [];

/* ===================================================
   ✅ DASHBOARD ULTIMATE
=================================================== */

async function loadUltimateDashboard() {

  let res = await fetch(API_URL + "?action=students");
  allStudents = await res.json();

  // ✅ Total Students Count
  document.getElementById("stats").innerHTML = `
    <h3>👨‍🎓 Total Students: ${allStudents.length}</h3>
  `;

  // ✅ Unique Batch Names
  let batches = [...new Set(allStudents.map(s => s.batch))];

  let dropdown = document.getElementById("batchSelect");
  dropdown.innerHTML = "";

  batches.forEach(batch => {
    dropdown.innerHTML += `<option value="${batch}">${batch}</option>`;
  });

  // ✅ Show First Batch Students Automatically
  showBatchStudents();

  // ✅ Change Batch Event
  dropdown.onchange = showBatchStudents;
}


// ✅ Show Students in Selected Batch
function showBatchStudents() {

  let batch = document.getElementById("batchSelect").value;

  let filtered = allStudents.filter(s => s.batch === batch);

  let box = document.getElementById("batchStudents");

  box.innerHTML = `<h3>👥 Students in ${batch}</h3>`;

  filtered.forEach(stu => {
    box.innerHTML += `<p>👤 ${stu.name}</p>`;
  });
}
