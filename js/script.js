/**
 * Rent Tracker - Hurstville
 * Using Firebase Firestore for cloud sync across devices
 */

// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyAmFh9jdUDC-lgcrHkl06EY2nB50ZT5i_Y",
  authDomain: "hurstville-rent-tracker.firebaseapp.com",
  projectId: "hurstville-rent-tracker",
  storageBucket: "hurstville-rent-tracker.firebasestorage.app",
  messagingSenderId: "150128012794",
  appId: "1:150128012794:web:46a8b44d5e332346ccc843"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== PRE-LOADED DATA (From Rent for Hurstville.xlsx) =====
const defaultData = [
    { id: "27-Jan-2026", date: "27-Jan-2026", totalRent: 750, iPaid: 750, roommatePaid: 0, netPaid: 750, roommatePaidOn: null, status: "paid", notes: "Bond/Deposit/Advance paid" },
    { id: "2-Feb-2026", date: "2-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: null, netPaid: 750, roommatePaidOn: null, status: "paid", notes: "Roommate Electricity $770" },
    { id: "9-Feb-2026", date: "9-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 850, netPaid: -100, roommatePaidOn: "12-Feb-2026", status: "paid", notes: "Roommate overpaid" },
    { id: "16-Feb-2026", date: "16-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "20-Feb-2026", status: "paid", notes: "" },
    { id: "23-Feb-2026", date: "23-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "27-Feb-2026", status: "paid", notes: "" },
    { id: "2-Mar-2026", date: "2-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "6-Mar-2026", status: "paid", notes: "" },
    { id: "9-Mar-2026", date: "9-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "13-Mar-2026", status: "paid", notes: "" },
    { id: "16-Mar-2026", date: "16-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, netPaid: 365, roommatePaidOn: "20-Mar-2026", status: "paid", notes: "" },
    { id: "23-Mar-2026", date: "23-Mar-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "27-Mar-2026", status: "pending", notes: "" },
    { id: "30-Mar-2026", date: "30-Mar-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "3-Apr-2026", status: "pending", notes: "" },
    { id: "6-Apr-2026", date: "6-Apr-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "10-Apr-2026", status: "pending", notes: "" },
    { id: "13-Apr-2026", date: "13-Apr-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "17-Apr-2026", status: "pending", notes: "" },
    { id: "20-Apr-2026", date: "20-Apr-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "24-Apr-2026", status: "pending", notes: "" },
    { id: "27-Apr-2026", date: "27-Apr-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "1-May-2026", status: "pending", notes: "" },
    { id: "4-May-2026", date: "4-May-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "8-May-2026", status: "pending", notes: "" },
    { id: "11-May-2026", date: "11-May-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "15-May-2026", status: "pending", notes: "" },
    { id: "18-May-2026", date: "18-May-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "22-May-2026", status: "pending", notes: "" },
    { id: "25-May-2026", date: "25-May-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "29-May-2026", status: "pending", notes: "" },
    { id: "1-Jun-2026", date: "1-Jun-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "5-Jun-2026", status: "pending", notes: "" },
    { id: "8-Jun-2026", date: "8-Jun-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "12-Jun-2026", status: "pending", notes: "" },
    { id: "15-Jun-2026", date: "15-Jun-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "19-Jun-2026", status: "pending", notes: "" },
    { id: "22-Jun-2026", date: "22-Jun-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "26-Jun-2026", status: "pending", notes: "" },
    { id: "29-Jun-2026", date: "29-Jun-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "3-Jul-2026", status: "pending", notes: "" },
    { id: "6-Jul-2026", date: "6-Jul-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "10-Jul-2026", status: "pending", notes: "" },
    { id: "13-Jul-2026", date: "13-Jul-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "17-Jul-2026", status: "pending", notes: "" },
    { id: "20-Jul-2026", date: "20-Jul-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "24-Jul-2026", status: "pending", notes: "" },
    { id: "27-Jul-2026", date: "27-Jul-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "31-Jul-2026", status: "pending", notes: "" },
    { id: "3-Aug-2026", date: "3-Aug-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "7-Aug-2026", status: "pending", notes: "" },
    { id: "10-Aug-2026", date: "10-Aug-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "14-Aug-2026", status: "pending", notes: "" },
    { id: "17-Aug-2026", date: "17-Aug-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "21-Aug-2026", status: "pending", notes: "" },
    { id: "24-Aug-2026", date: "24-Aug-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "28-Aug-2026", status: "pending", notes: "" },
    { id: "31-Aug-2026", date: "31-Aug-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "4-Sep-2026", status: "pending", notes: "" },
    { id: "7-Sep-2026", date: "7-Sep-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "11-Sep-2026", status: "pending", notes: "" },
    { id: "14-Sep-2026", date: "14-Sep-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "18-Sep-2026", status: "pending", notes: "" },
    { id: "21-Sep-2026", date: "21-Sep-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "25-Sep-2026", status: "pending", notes: "" },
    { id: "28-Sep-2026", date: "28-Sep-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "2-Oct-2026", status: "pending", notes: "" },
    { id: "5-Oct-2026", date: "5-Oct-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "9-Oct-2026", status: "pending", notes: "" },
    { id: "12-Oct-2026", date: "12-Oct-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "16-Oct-2026", status: "pending", notes: "" },
    { id: "19-Oct-2026", date: "19-Oct-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "23-Oct-2026", status: "pending", notes: "" },
    { id: "26-Oct-2026", date: "26-Oct-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "30-Oct-2026", status: "pending", notes: "" },
    { id: "2-Nov-2026", date: "2-Nov-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "6-Nov-2026", status: "pending", notes: "" },
    { id: "9-Nov-2026", date: "9-Nov-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "13-Nov-2026", status: "pending", notes: "" },
    { id: "16-Nov-2026", date: "16-Nov-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "20-Nov-2026", status: "pending", notes: "" },
    { id: "23-Nov-2026", date: "23-Nov-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "27-Nov-2026", status: "pending", notes: "" },
    { id: "30-Nov-2026", date: "30-Nov-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "4-Dec-2026", status: "pending", notes: "" },
    { id: "7-Dec-2026", date: "7-Dec-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "11-Dec-2026", status: "pending", notes: "" },
    { id: "14-Dec-2026", date: "14-Dec-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "18-Dec-2026", status: "pending", notes: "" },
    { id: "21-Dec-2026", date: "21-Dec-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "25-Dec-2026", status: "pending", notes: "" },
    { id: "28-Dec-2026", date: "28-Dec-2026", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "1-Jan-2027", status: "pending", notes: "" },
    { id: "4-Jan-2027", date: "4-Jan-2027", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "8-Jan-2027", status: "pending", notes: "" },
    { id: "11-Jan-2027", date: "11-Jan-2027", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "15-Jan-2027", status: "pending", notes: "" },
    { id: "18-Jan-2027", date: "18-Jan-2027", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "22-Jan-2027", status: "pending", notes: "" },
    { id: "25-Jan-2027", date: "25-Jan-2027", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "29-Jan-2027", status: "pending", notes: "" },
    { id: "1-Feb-2027", date: "1-Feb-2027", totalRent: 750, iPaid: null, roommatePaid: null, netPaid: 0, roommatePaidOn: "5-Feb-2027", status: "pending", notes: "" }
];

const THEME_KEY = 'hurstville_theme';
const BOND_KEY = 'hurstville_bond_data';
let currentData = [];
let bondData = {
    myBond: 3000,
    myBondDate: '27-Jan-2026',
    myBondNotes: 'Bond/Deposit/Advance',
    roommateBond: 0,
    roommateBondDate: null,
    roommateBondNotes: ''
};
let unsubscribe = null;

// ===== THEME =====
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

// ===== LOAD/SAVE BOND DATA =====
const loadBondData = () => {
    try {
        const stored = localStorage.getItem(BOND_KEY);
        if (stored) {
            bondData = JSON.parse(stored);
            console.log('✅ Bond data loaded');
        }
    } catch (e) {
        console.error('❌ Bond load error:', e);
    }
};

const saveBondData = async () => {
    try {
        localStorage.setItem(BOND_KEY, JSON.stringify(bondData));
        await db.collection('bondData').doc('main').set(bondData);
        console.log('✅ Bond data saved');
    } catch (e) {
        console.error('❌ Bond save error:', e);
    }
};

// ===== UTILITIES =====
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

// ===== RENDER SUMMARY WITH ALL CARDS =====
const renderSummary = (data) => {
    const summaryGrid = document.getElementById('summaryGrid');
    if (!summaryGrid) return;
    
    const totalWeeks = data.filter(row => row.date && row.date !== '-').length;
    const totalRent = data.reduce((sum, row) => sum + (row.totalRent || 0), 0);
    const totalIPaid = data.reduce((sum, row) => sum + (row.iPaid || 0), 0);
    const totalRoommate = data.reduce((sum, row) => sum + (row.roommatePaid || 0), 0);
    const netTotal = data.reduce((sum, row) => sum + (row.netPaid || 0), 0);
    const unpaidCount = data.filter(row => !row.iPaid || row.iPaid === 0).length;
    const totalPaymentDone = totalIPaid + totalRoommate;

    summaryGrid.innerHTML = `
        <div class="summary-card">
            <div class="label">Total Weeks</div>
            <div class="value">${totalWeeks}</div>
        </div>
        <div class="summary-card">
            <div class="label">Total Rent</div>
            <div class="value">${formatCurrency(totalRent)}</div>
        </div>
        <div class="summary-card">
            <div class="label">Total Payment Done</div>
            <div class="value" style="color: var(--success); font-weight: 700;">${formatCurrency(totalPaymentDone)}</div>
        </div>
        <div class="summary-card positive">
            <div class="label">Roommate Contributed</div>
            <div class="value">${formatCurrency(totalRoommate)}</div>
        </div>
        <div class="summary-card ${netTotal < 0 ? 'negative' : 'positive'}">
            <div class="label">Net Paid</div>
            <div class="value">${formatCurrency(netTotal)}</div>
        </div>
        <div class="summary-card" style="position: relative;">
            <div class="label">Bond From Me</div>
            <div class="value" style="color: var(--primary);">${formatCurrency(bondData.myBond)}</div>
            <button class="bond-edit-btn" onclick="window.openBondModal('my')" title="Edit Bond" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0.25rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </svg>
            </button>
        </div>
        <div class="summary-card" style="position: relative;">
            <div class="label">Bond From Roommate</div>
            <div class="value" style="color: var(--primary);">${formatCurrency(bondData.roommateBond)}</div>
            <button class="bond-edit-btn" onclick="window.openBondModal('roommate')" title="Edit Bond" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0.25rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                </svg>
            </button>
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
        const hasNotes = row.notes && row.notes.trim() !== '';
        const infoButton = hasNotes ? 
            `<button class="btn-action info" onclick="window.viewNotes('${row.id}')" title="View Notes">ℹ️</button>` : 
            '<span style="color: var(--text-secondary); font-size: 0.75rem;">-</span>';
        
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
                ${infoButton}
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
                
                const batch = db.batch();
                imported.forEach(entry => {
                    const docRef = db.collection('rentEntries').doc(entry.id);
                    batch.set(docRef, entry);
                });
                await batch.commit();
                
                renderSummary(currentData);
                populateMonthFilter(currentData);
                renderTable(currentData);
                showToast('Imported!', 'success');
            }
        } catch (err) {
            showToast('Import failed', 'error');
        }
    };
    reader.readAsText(file);
};

const exportSummary = () => {
    const totalWeeks = currentData.filter(row => row.date && row.date !== '-').length;
    const totalRent = currentData.reduce((sum, row) => sum
