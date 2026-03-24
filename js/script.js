/**
 * Rent Tracker - Hurstville
 * With Firebase Firestore for real-time multi-user sync
 */

// ===== FIREBASE CONFIGURATION (Your Actual Config) =====
const firebaseConfig = {
  apiKey: "AIzaSyAmFh9jdUDC-lgcrHkl06EY2nB50ZT5i_Y",
  authDomain: "hurstville-rent-tracker.firebaseapp.com",
  projectId: "hurstville-rent-tracker",
  storageBucket: "hurstville-rent-tracker.firebasestorage.app",
  messagingSenderId: "150128012794",
  appId: "1:150128012794:web:46a8b44d5e332346ccc843"
};

// ===== PRE-LOADED DATA (From Rent for Hurstville.xlsx) =====
const defaultData = [
    { id: "27-Jan-2026", date: "27-Jan-2026", totalRent: 750, iPaid: 750, roommatePaid: 0, netPaid: 750, roommatePaidOn: null, status: "paid", notes: "Bond/Deposit/Advance paid" },
    { id: "2-Feb-2026", date: "2-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: null, netPaid: 750, roommatePaidOn: null, status: "paid", notes: "Roommate Electricity $770" },
    { id: "9-Feb-2026", date: "9-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 850, netPaid: -100, roommatePaidOn: "12-Feb-2026", status: "paid", notes: "Roommate overpaid" },
    { id: "16-Feb-2026", date: "16-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "20-Feb-2026", status: "paid", notes: "" },
    { id: "23-Feb-2026", date: "23-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "27-Feb-2026", status: "paid", notes: "" },
    { id: "2-Mar-2026", date: "2-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "6-Mar-2026", status: "paid", notes: "" },
    { id: "9-Mar-2026", date: "9-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "13-Mar-2026", status: "paid", notes: "" },
    { id: "16-Mar-2026", date: "16-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "20-Mar-2026", status: "paid", notes: "" }
];

const THEME_KEY = 'hurstville_theme';
let currentData = [];
let db = null;
let isFirebaseConfigured = false;
let unsubscribe = null;
let isLoading = false;

// ===== FIREBASE INITIALIZATION =====
const initFirebase = () => {
    try {
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
            console.warn('Firebase not configured - using localStorage');
            showFirebaseNotice();
            return false;
        }
        
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseConfigured = true;
        console.log('✅ Firebase initialized');
        return true;
    } catch (error) {
        console.error('❌ Firebase error:', error);
        showFirebaseNotice();
        return false;
    }
};

const showFirebaseNotice = () => {
    const notice = document.getElementById('firebaseNotice');
    if (notice) notice.style.display = 'block';
};

const dismissFirebaseNotice = () => {
    const notice = document.getElementById('firebaseNotice');
    if (notice) notice.style.display = 'none';
    localStorage.setItem('firebaseNoticeDismissed', 'true');
};

// ===== SEED INITIAL DATA TO FIREBASE =====
const seedInitialData = async () => {
    if (!isFirebaseConfigured || !db) return;
    
    try {
        const snapshot = await db.collection('rentEntries').get();
        
        // Only seed if collection is empty
        if (snapshot.empty) {
            console.log('📥 Seeding initial data to Firebase...');
            const batch = db.batch();
            
            defaultData.forEach(entry => {
                const docRef = db.collection('rentEntries').doc(entry.id);
                batch.set(docRef, entry);
            });
            
            await batch.commit();
            console.log('✅ Initial data seeded successfully');
            showToast('Initial data loaded', 'success');
        }
    } catch (error) {
        console.error('❌ Error seeding ', error);
    }
};

// ===== REAL-TIME DATA SYNC =====
const syncData = () => {
    if (!isFirebaseConfigured || !db) {
        loadDataFromLocalStorage();
        return;
    }
    
    const loadingState = document.getElementById('loadingState');
    if (loadingState) loadingState.style.display = 'block';
    
    // Seed initial data if needed
    seedInitialData();
    
    const rentCollection = db.collection('rentEntries');
    
    // Listen for real-time updates
    unsubscribe = rentCollection.onSnapshot(
        (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by date
            data.sort((a, b) => new Date(formatDateForInput(a.date)) - new Date(formatDateForInput(b.date)));
            
            currentData = data;
            renderSummary(currentData);
            populateMonthFilter(currentData);
            renderTable(currentData);
            
            if (loadingState) loadingState.style.display = 'none';
            isLoading = false;
            console.log(`✅ Synced ${currentData.length} entries from Firebase`);
        },
        (error) => {
            console.error('❌ Sync error:', error);
            showToast('Using local data', 'warning');
            if (loadingState) loadingState.style.display = 'none';
            isLoading = false;
            loadDataFromLocalStorage();
        }
    );
};

const saveToFirebase = async (data) => {
    if (!isFirebaseConfigured || !db) return false;
    
    try {
        const rentCollection = db.collection('rentEntries');
        await rentCollection.doc(data.id).set(data);
        console.log('✅ Saved to Firebase:', data.id);
        return true;
    } catch (error) {
        console.error('❌ Save error:', error);
        showToast('Save failed - check console', 'error');
        return false;
    }
};

const updateInFirebase = async (id, data) => {
    if (!isFirebaseConfigured || !db) return false;
    
    try {
        const rentCollection = db.collection('rentEntries');
        await rentCollection.doc(id).update(data);
        console.log('✅ Updated in Firebase:', id);
        return true;
    } catch (error) {
        console.error('❌ Update error:', error);
        showToast('Update failed', 'error');
        return false;
    }
};

const deleteFromFirebase = async (id) => {
    if (!isFirebaseConfigured || !db) return false;
    
    try {
        const rentCollection = db.collection('rentEntries');
        await rentCollection.doc(id).delete();
        console.log('✅ Deleted from Firebase:', id);
        return true;
    } catch (error) {
        console.error('❌ Delete error:', error);
        showToast('Delete failed', 'error');
        return false;
    }
};

// ===== LOCALSTORAGE FALLBACK =====
const loadDataFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem('hurstville_rent_data_local');
        if (stored && stored.trim() !== '') {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                currentData = parsed;
                console.log(`✅ Loaded ${currentData.length} entries from localStorage`);
                renderSummary(currentData);
                populateMonthFilter(currentData);
                renderTable(currentData);
                return true;
            }
        }
        
        // Use default data if nothing in localStorage
        currentData = [...defaultData];
        saveToLocalStorage();
        console.log(`✅ Using ${currentData.length} default entries`);
        renderSummary(currentData);
        populateMonthFilter(currentData);
        renderTable(currentData);
        return false;
    } catch (e) {
        console.error('❌ Load error:', e);
        currentData = [...defaultData];
        saveToLocalStorage();
        renderSummary(currentData);
        populateMonthFilter(currentData);
        renderTable(currentData);
        return false;
    }
};

const saveToLocalStorage = () => {
    try {
        localStorage.setItem('hurstville_rent_data_local', JSON.stringify(currentData));
        console.log('✅ Saved to localStorage');
        return true;
    } catch (e) {
        console.error('❌ Save error:', e);
        return false;
    }
};

// ===== THEME TOGGLE =====
const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
};

// ===== EXPORT/IMPORT DATA =====
const exportData = () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hurstville-rent-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported!', 'success');
};

const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                currentData = imported;
                
                if (isFirebaseConfigured) {
                    showToast('Importing to cloud...', 'loading');
                    const rentCollection = db.collection('rentEntries');
                    const batch = db.batch();
                    imported.forEach(entry => {
                        const docRef = rentCollection.doc(entry.id);
                        batch.set(docRef, entry);
                    });
                    await batch.commit();
                } else {
                    saveToLocalStorage();
                }
                
                renderSummary(currentData);
                populateMonthFilter(currentData);
                renderTable(currentData);
                showToast('Data imported!', 'success');
            } else {
                showToast('Invalid format', 'error');
            }
        } catch (err) {
            showToast('Import failed', 'error');
        }
    };
    reader.readAsText(file);
};

// ===== UTILITY FUNCTIONS =====
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '' || isNaN(amount)) return '-';
    const num = parseFloat(amount);
    if (isNaN(num)) return '-';
    return Math.abs(num).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
};

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '') return '-';
    return String(dateStr);
};

const formatDateForInput = (dateStr) => {
    if (!dateStr || dateStr === '') return '';
    const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = months[parts[1]] || '01';
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const getStatusBadge = (status, roommatePaidOn, iPaid) => {
    if (iPaid === null || iPaid === 0 || iPaid === '') {
        return `<span class="status missed">✗ Unpaid</span>`;
    } else if (status === 'paid' || roommatePaidOn) {
        return `<span class="status paid">✓ Paid</span>`;
    }
    return `<span class="status pending">⏳ Pending</span>`;
};

// ===== TOAST =====
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    toast.style.display = 'flex';
    
    if (type !== 'loading') {
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
};

// ===== RENDER FUNCTIONS =====
const renderSummary = (data) => {
    const summaryGrid = document.getElementById('summaryGrid');
    if (!summaryGrid) return;
    
    const totalWeeks = data.filter(row => row.date && row.date !== '-').length;
    const totalRent = data.reduce((sum, row) => sum + (row.totalRent || 0), 0);
    const totalIPaid = data.reduce((sum, row) => sum + (row.iPaid || 0), 0);
    const totalRoommate = data.reduce((sum, row) => sum + (row.roommatePaid || 0), 0);
    const netTotal = data.reduce((sum, row) => sum + (row.netPaid || 0), 0);
    const unpaidCount = data.filter(row => !row.iPaid || row.iPaid === 0).length;

    summaryGrid.innerHTML = `
        <div class="summary-card">
            <div class="label">Total Weeks</div>
            <div class="value">${totalWeeks}</div>
        </div>
        <div class="summary-card">
            <div class="label">Total Rent</div>
            <div class="value">${formatCurrency(totalRent)}</div>
        </div>
        <div class="summary-card positive">
            <div class="label">Roommate Contributed</div>
            <div class="value">${formatCurrency(totalRoommate)}</div>
        </div>
        <div class="summary-card ${netTotal < 0 ? 'negative' : 'positive'}">
            <div class="label">Net Paid</div>
            <div class="value">${formatCurrency(netTotal)}</div>
        </div>
        <div class="summary-card">
            <div class="label">Unpaid Weeks</div>
            <div class="value">${unpaidCount}</div>
        </div>
    `;
};

const renderTable = (data) => {
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    if (!tableBody) return;
    
    if (data.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    tableBody.innerHTML = data.map((row) => {
        return `
        <tr>
            <td><strong>${formatDate(row.date)}</strong></td>
            <td>${formatCurrency(row.totalRent)}</td>
            <td>${formatCurrency(row.iPaid)}</td>
            <td class="${row.roommatePaid < 0 ? 'negative' : ''}">${formatCurrency(row.roommatePaid)}</td>
            <td class="${row.netPaid < 0 ? 'negative' : row.netPaid > 0 ? 'positive' : ''}">${formatCurrency(row.netPaid)}</td>
            <td><small>${formatDate(row.roommatePaidOn)}</small></td>
            <td>${getStatusBadge(row.status, row.roommatePaidOn, row.iPaid)}</td>
            <td>
                <button class="btn-action" onclick="window.openEditModal('${row.id}')">Edit</button>
                <button class="btn-action delete" onclick="window.confirmDelete('${row.id}')">Delete</button>
            </td>
        </tr>
    `}).join('');
};

const populateMonthFilter = (data) => {
    const monthFilter = document.getElementById('monthFilter');
    if (!monthFilter) return;
    
    monthFilter.innerHTML = '<option value="all">All Months</option>';
    const monthSet = new Set();
    
    data.forEach(row => {
        if (!row.date || row.date === '-') return;
        const dateStr = String(row.date);
        const parts = dateStr.split('-');
        if (parts.length >= 3) {
            monthSet.add(`${parts[1]}-${parts[2]}`);
        }
    });
    
    const months = Array.from(monthSet).sort((a, b) => {
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [monthA, yearA] = a.split('-');
        const [monthB, yearB] = b.split('-');
        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        return monthsOrder.indexOf(monthA) - monthsOrder.indexOf(monthB);
    });
    
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
};

const filterData = () => {
    const searchInput = document.getElementById('searchInput');
    const monthFilter = document.getElementById('monthFilter');
    if (!searchInput || !monthFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedMonth = monthFilter.value;
    
    const filtered = currentData.filter(row => {
        const matchesSearch = !searchTerm || String(row.date).toLowerCase().includes(searchTerm);
        const matchesMonth = selectedMonth === 'all' || String(row.date).includes(selectedMonth);
        return matchesSearch && matchesMonth;
    });
    
    renderTable(filtered);
};

const exportSummary = () => {
    const totalWeeks = currentData.filter(row => row.date && row.date !== '-').length;
    const totalRent = currentData.reduce((sum, row) => sum + (row.totalRent || 0), 0);
    const totalIPaid = currentData.reduce((sum, row) => sum + (row.iPaid || 0), 0);
    const totalRoommate = currentData.reduce((sum, row) => sum + (row.roommatePaid || 0), 0);
    const netTotal = currentData.reduce((sum, row) => sum + (row.netPaid || 0), 0);
    
    const summary = [
        ['Hurstville Rent Summary'],
        ['Generated:', new Date().toLocaleDateString()],
        [],
        ['Metric', 'Value'],
        ['Total Weeks', totalWeeks],
        ['Total Rent', totalRent],
        ['I Paid', totalIPaid],
        ['Roommate Contributed', totalRoommate],
        ['Net Paid', netTotal]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(summary);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    XLSX.writeFile(wb, `Rent-Summary-${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Summary exported!', 'success');
};

// ===== MODAL FUNCTIONS =====
window.openAddModal = function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const addEntryForm = document.getElementById('addEntryForm');
    const entryDate = document.getElementById('entryDate');
    const entryTotalRent = document.getElementById('entryTotalRent');
    
    if (!modalOverlay) return;
    if (addEntryForm) addEntryForm.reset();
    if (entryDate) entryDate.valueAsDate = new Date();
    if (entryTotalRent) entryTotalRent.value = 750;
    
    modalOverlay.style.display = 'flex';
    if (entryDate) entryDate.focus();
};

window.closeAddModal = function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const addEntryForm = document.getElementById('addEntryForm');
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (addEntryForm) addEntryForm.reset();
};

window.openEditModal = function(id) {
    const editModalOverlay = document.getElementById('editModalOverlay');
    if (!editModalOverlay) return;
    
    const entry = currentData.find(item => item.id === id);
    if (!entry) {
        showToast('Entry not found', 'error');
        return;
    }
    
    const editEntryId = document.getElementById('editEntryId');
    const editDate = document.getElementById('editDate');
    const editTotalRent = document.getElementById('editTotalRent');
    const editIPaid = document.getElementById('editIPaid');
    const editRoommatePaid = document.getElementById('editRoommatePaid');
    const editRoommateDate = document.getElementById('editRoommateDate');
    const editNotes = document.getElementById('editNotes');
    
    if (editEntryId) editEntryId.value = id;
    if (editDate) editDate.value = formatDateForInput(entry.date);
    if (editTotalRent) editTotalRent.value = entry.totalRent || '';
    if (editIPaid) editIPaid.value = entry.iPaid || '';
    if (editRoommatePaid) editRoommatePaid.value = entry.roommatePaid || '';
    if (editRoommateDate) editRoommateDate.value = formatDateForInput(entry.roommatePaidOn);
    if (editNotes) editNotes.value = entry.notes || '';
    
    editModalOverlay.style.display = 'flex';
    if (editDate) editDate.focus();
};

window.closeEditModal = function() {
    const editModalOverlay = document.getElementById('editModalOverlay');
    const editEntryForm = document.getElementById('editEntryForm');
    if (editModalOverlay) editModalOverlay.style.display = 'none';
    if (editEntryForm) editEntryForm.reset();
};

window.saveNewEntry = async function(e) {
    if (e) e.preventDefault();
    if (isLoading) return;
    
    isLoading = true;
    
    const entryDate = document.getElementById('entryDate');
    const entryTotalRent = document.getElementById('entryTotalRent');
    const entryIPaid = document.getElementById('entryIPaid');
    const entryRoommatePaid = document.getElementById('entryRoommatePaid');
    const entryRoommateDate = document.getElementById('entryRoommateDate');
    const entryNotes = document.getElementById('entryNotes');
    
    if (!entryDate || !entryDate.value) {
        showToast('Select a date', 'error');
        isLoading = false;
        return;
    }
    
    const totalRent = entryTotalRent && entryTotalRent.value ? parseFloat(entryTotalRent.value) : 750;
    const iPaid = entryIPaid && entryIPaid.value ? parseFloat(entryIPaid.value) : null;
    const roommatePaid = entryRoommatePaid && entryRoommatePaid.value ? parseFloat(entryRoommatePaid.value) : null;
    const roommatePaidOn = entryRoommateDate && entryRoommateDate.value ? entryRoommateDate.value : null;
    const notes = entryNotes ? entryNotes.value : '';
    
    const dateObj = new Date(entryDate.value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${dateObj.getDate()}-${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    
    let netPaid = 0;
    if (iPaid !== null && roommatePaid !== null) {
        netPaid = iPaid - roommatePaid;
    } else if (iPaid !== null) {
        netPaid = iPaid;
    }
    
    let status = 'pending';
    if (iPaid && iPaid > 0) status = 'paid';
    
    const newEntry = { id: generateId(), date, totalRent, iPaid, roommatePaid, netPaid, roommatePaidOn, status, notes };
    
    try {
        if (isFirebaseConfigured) {
            await saveToFirebase(newEntry);
        } else {
            currentData.push(newEntry);
            currentData.sort((a, b) => new Date(formatDateForInput(a.date)) - new Date(formatDateForInput(b.date)));
            saveToLocalStorage();
        }
        
        renderSummary(currentData);
        populateMonthFilter(currentData);
        renderTable(currentData);
        window.closeAddModal();
        showToast('Entry saved!', 'success');
    } catch (error) {
        console.error('Save error:', error);
        showToast('Save failed', 'error');
    }
    
    isLoading = false;
};

window.updateEntry = async function(e) {
    if (e) e.preventDefault();
    if (isLoading) return;
    
    isLoading = true;
    
    const editEntryId = document.getElementById('editEntryId');
    const editDate = document.getElementById('editDate');
    const editTotalRent = document.getElementById('editTotalRent');
    const editIPaid = document.getElementById('editIPaid');
    const editRoommatePaid = document.getElementById('editRoommatePaid');
    const editRoommateDate = document.getElementById('editRoommateDate');
    const editNotes = document.getElementById('editNotes');
    
    if (!editEntryId || !editEntryId.value) {
        showToast('Entry ID missing', 'error');
        isLoading = false;
        return;
    }
    
    const id = editEntryId.value;
    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
        showToast('Entry not found', 'error');
        isLoading = false;
        return;
    }
    
    if (!editDate || !editDate.value) {
        showToast('Select a date', 'error');
        isLoading = false;
        return;
    }
    
    const totalRent = editTotalRent && editTotalRent.value ? parseFloat(editTotalRent.value) : 0;
    const iPaid = editIPaid && editIPaid.value ? parseFloat(editIPaid.value) : null;
    const roommatePaid = editRoommatePaid && editRoommatePaid.value ? parseFloat(editRoommatePaid.value) : null;
    const roommatePaidOn = editRoommateDate && editRoommateDate.value ? editRoommateDate.value : null;
    const notes = editNotes ? editNotes.value : '';
    
    const dateObj = new Date(editDate.value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${dateObj.getDate()}-${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    
    let netPaid = 0;
    if (iPaid !== null && roommatePaid !== null) {
        netPaid = iPaid - roommatePaid;
    } else if (iPaid !== null) {
        netPaid = iPaid;
    }
    
    let status = 'pending';
    if (iPaid && iPaid > 0) status = 'paid';
    
    const updatedData = { date, totalRent, iPaid, roommatePaid, netPaid, roommatePaidOn, status, notes };
    
    try {
        if (isFirebaseConfigured) {
            await updateInFirebase(id, updatedData);
        } else {
            currentData[index] = { ...currentData[index], ...updatedData };
            saveToLocalStorage();
        }
        
        renderSummary(currentData);
        populateMonthFilter(currentData);
        renderTable(currentData);
        window.closeEditModal();
        showToast('Entry updated!', 'success');
    } catch (error) {
        console.error('Update error:', error);
        showToast('Update failed', 'error');
    }
    
    isLoading = false;
};

let deleteTargetId = null;

window.confirmDelete = function(id) {
    deleteTargetId = id;
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    if (deleteModalOverlay) deleteModalOverlay.style.display = 'flex';
};

window.closeDeleteModal = function() {
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    if (deleteModalOverlay) deleteModalOverlay.style.display = 'none';
    deleteTargetId = null;
};

window.executeDelete = async function() {
    if (!deleteTargetId || isLoading) return;
    
    isLoading = true;
    
    try {
        if (isFirebaseConfigured) {
            await deleteFromFirebase(deleteTargetId);
        } else {
            const index = currentData.findIndex(item => item.id === deleteTargetId);
            if (index === -1) {
                showToast('Entry not found', 'error');
                window.closeDeleteModal();
                isLoading = false;
                return;
            }
            currentData.splice(index, 1);
            saveToLocalStorage();
        }
        
        renderSummary(currentData);
        populateMonthFilter(currentData);
        renderTable(currentData);
        window.closeDeleteModal();
        showToast('Entry deleted', 'success');
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Delete failed', 'error');
    }
    
    isLoading = false;
};

// ===== SETUP EVENT LISTENERS =====
const setupEventListeners = () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    const btnDismissNotice = document.getElementById('btnDismissNotice');
    if (btnDismissNotice) btnDismissNotice.addEventListener('click', dismissFirebaseNotice);
    
    const btnAddEntry = document.getElementById('btnAddEntry');
    if (btnAddEntry) btnAddEntry.addEventListener('click', window.openAddModal);
    
    const btnAddFromEmpty = document.getElementById('btnAddFromEmpty');
    if (btnAddFromEmpty) btnAddFromEmpty.addEventListener('click', window.openAddModal);
    
    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportSummary);
    
    const btnBackup = document.getElementById('btnBackup');
    if (btnBackup) btnBackup.addEventListener('click', exportData);
    
    const btnImport = document.getElementById('btnImport');
    if (btnImport) btnImport.addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    const btnCloseModal = document.getElementById('btnCloseModal');
    if (btnCloseModal) btnCloseModal.addEventListener('click', window.closeAddModal);
    
    const btnCancelEntry = document.getElementById('btnCancelEntry');
    if (btnCancelEntry) btnCancelEntry.addEventListener('click', window.closeAddModal);
    
    const btnCloseEditModal = document.getElementById('btnCloseEditModal');
    if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', window.closeEditModal);
    
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    if (btnCancelEdit) btnCancelEdit.addEventListener('click', window.closeEditModal);
    
    const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
    if (btnCloseDeleteModal) btnCloseDeleteModal.addEventListener('click', window.closeDeleteModal);
    
    const btnCancelDelete = document.getElementById('btnCancelDelete');
    if (btnCancelDelete) btnCancelDelete.addEventListener('click', window.closeDeleteModal);
    
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', window.executeDelete);
    
    const addEntryForm = document.getElementById('addEntryForm');
    if (addEntryForm) addEntryForm.addEventListener('submit', window.saveNewEntry);
    
    const editEntryForm = document.getElementById('editEntryForm');
    if (editEntryForm) editEntryForm.addEventListener('submit', window.updateEntry);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', filterData);
    
    const monthFilter = document.getElementById('monthFilter');
    if (monthFilter) monthFilter.addEventListener('change', filterData);
    
    const toastClose = document.getElementById('toastClose');
    if (toastClose) toastClose.addEventListener('click', () => {
        const toast = document.getElementById('toast');
        if (toast) toast.style.display = 'none';
    });
    
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) window.closeAddModal();
    });
    
    const editModalOverlay = document.getElementById('editModalOverlay');
    if (editModalOverlay) editModalOverlay.addEventListener('click', (e) => {
        if (e.target === editModalOverlay) window.closeEditModal();
    });
    
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    if (deleteModalOverlay) deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === deleteModalOverlay) window.closeDeleteModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalOverlay');
            const editModal = document.getElementById('editModalOverlay');
            const deleteModal = document.getElementById('deleteModalOverlay');
            const toast = document.getElementById('toast');
            
            if (modal && modal.style.display === 'flex') window.closeAddModal();
            if (editModal && editModal.style.display === 'flex') window.closeEditModal();
            if (deleteModal && deleteModal.style.display === 'flex') window.closeDeleteModal();
            if (toast && toast.style.display === 'flex') toast.style.display = 'none';
        }
    });
};

// ===== INITIALIZE =====
const init = async () => {
    initTheme();
    
    const noticeDismissed = localStorage.getItem('firebaseNoticeDismissed');
    const firebaseConfigured = initFirebase();
    
    if (firebaseConfigured) {
        syncData();
    } else {
        loadDataFromLocalStorage();
    }
    
    const modalOverlay = document.getElementById('modalOverlay');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    const toast = document.getElementById('toast');
    
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (editModalOverlay) editModalOverlay.style.display = 'none';
    if (deleteModalOverlay) deleteModalOverlay.style.display = 'none';
    if (toast) toast.style.display = 'none';
    
    setupEventListeners();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
