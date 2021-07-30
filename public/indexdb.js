const db =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.amsIndexedDB ||
  window.shimIndexedDB;

let appDB;
const request = indexedDB.open("PBudget", 1);

request.onupgradeneeded = ({ target }) => {
  let mydb = target.result;
  mydb.createObjectStore("pending", { autoIncreament: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;
  if (navigator.online) {
    checkDatabase();
  }
};
request.onerror = function (event) {
  console.log(event.target.errorCode);
};
function saveRecord(record) {
  const trans = db.transaction(["pending"], "readwrite");
  const store = trans.objectStore("pending");
  store.add(record);
}
//add function save record
//add function checkDatabase
//window.addEventListener("online", checkDatabase)
