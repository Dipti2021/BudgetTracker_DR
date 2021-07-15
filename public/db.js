let new_database;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
   const new_database = event.target.result;
  new_database.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  new_database = event.target.result;

  
  if (navigator.onLine) {
     all_updates();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {

  const transaction = new_database.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(record);
}

function all_updates() {
   const transaction = new_database.transaction(["pending"], "readwrite");
   const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
         
          const transaction = new_database.transaction(["pending"], "readwrite");

        
          const store = transaction.objectStore("pending");

          store.clear();
        });
    }
  };
}

window.addEventListener("online", all_updates);