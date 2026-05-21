const DB_NAME = 'jsonCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'jsonData';

let db = null;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

function getJSONFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve(null);
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onerror = () => resolve(null);
        request.onsuccess = () => resolve(request.result?.data);
    });
}

function saveJSONToDB(id, data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve();
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id, data });

        request.onerror = () => resolve();
        request.onsuccess = () => resolve();
    });
}

async function loadJSON(path, id) {
    try {
        let data = await getJSONFromDB(id);
        if (data) {
            console.log(`Loaded ${id} from IndexedDB`);
            return data;
        }
    } catch (e) {
        console.log(`Not found in IndexedDB, fetching from server...`);
    }

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        await saveJSONToDB(id, data);
        console.log(`Saved ${id} to IndexedDB`);
        return data;
    } catch (e) {
        console.error(`Failed to load ${id}:`, e);
        return null;
    }
}

function getRtes() {
    return loadJSON('./base/rtes.json', 'rtes');
}

function getTaras() {
    return loadJSON('./base/taras.json', 'taras');
}

initDB().catch(console.error);