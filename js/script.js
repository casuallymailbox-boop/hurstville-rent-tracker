/**
 * Rent Tracker - Hurstville
 * With permanent data storage via localStorage + Export/Import
 */

// ===== PRE-LOADED DATA =====
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

const STORAGE_KEY = 'hurstville_rent_data_v2';
const THEME_KEY = 'hurstville_theme';
let currentData = [];

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

// ===== LOAD/SAVE DATA - FIXED =====
const loadData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored.trim() !== '') {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                currentData = parsed;
                console.log('Data loaded from localStorage:', currentData.length, 'entries');
                return true;
            }
        }
        // No valid stored data, use defaults
        currentData = [...defaultData];
        saveData();
        console.log('Using default data:', currentData.length, 'entries');
        return false;
    } catch (e) {
        console.error('Error loading ', e);
        currentData = [...defaultData];
        saveData();
        return false;
    }
};

const saveData = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        console.log('Data saved to localStorage:', currentData.length, 'entries');
        return true;
    } catch (e) {
        console.error('Error saving ', e);
        showToast('Failed to save data', 'error');
        return false;
    }
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
    showToast('Data exported successfully!', 'success');
};

const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                currentData = imported;
                saveData();
                renderSummary(currentData);
                populateMonthFilter(currentData);
                renderTable(currentData);
                showToast('Data imported successfully!', 'success');
            } else {
                showToast('Invalid data format', 'error');
            }
        } catch (err) {
            showToast('Failed to import data', 'error');
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
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
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

window.saveNewEntry = function(e) {
    if (e) e.preventDefault();
    
    const entryDate = document.getElementById('entryDate');
    const entryTotalRent = document.getElementById('entryTotalRent');
    const entryIPaid = document.getElementById('entryIPaid');
    const entryRoommatePaid = document.getElementById('entryRoommatePaid');
    const entryRoommateDate = document.getElementById('entryRoommateDate');
    const entryNotes = document.getElementById('entryNotes');
    
    if (!entryDate || !entryDate.value) {
        showToast('Please select a date', 'error');
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
    
    currentData.push({ id: generateId(), date, totalRent, iPaid, roommatePaid, netPaid, roommatePaidOn, status, notes });
    currentData.sort((a, b) => new Date(formatDateForInput(a.date)) - new Date(formatDateForInput(b.date)));
    
    saveData();
    renderSummary(currentData);
    populateMonthFilter(currentData);
    renderTable(currentData);
    window.closeAddModal();
    showToast('Entry saved permanently!', 'success');
};

window.updateEntry = function(e) {
    if (e) e.preventDefault();
    
    const editEntryId = document.getElementById('editEntryId');
    const editDate = document.getElementById('editDate');
    const editTotalRent = document.getElementById('editTotalRent');
    const editIPaid = document.getElementById('editIPaid');
    const editRoommatePaid = document.getElementById('editRoommatePaid');
    const editRoommateDate = document.getElementById('editRoommateDate');
    const editNotes = document.getElementById('editNotes');
    
    if (!editEntryId || !editEntryId.value) {
        showToast('Entry ID not found', 'error');
        return;
    }
    
    const id = editEntryId.value;
    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
        showToast('Entry not found', 'error');
        return;
    }
    
    if (!editDate || !editDate.value) {
        showToast('Please select a date', 'error');
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
    
    currentData[index] = { ...currentData[index], date, totalRent, iPaid, roommatePaid, netPaid, roommatePaidOn, status, notes };
    
    saveData();
    renderSummary(currentData);
    populateMonthFilter(currentData);
    renderTable(currentData);
    window.closeEditModal();
    showToast('Entry updated!', 'success');
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

window.executeDelete = function() {
    if (!deleteTargetId) return;
    
    const index = currentData.findIndex(item => item.id === deleteTargetId);
    if (index === -1) {
        showToast('Entry not found', 'error');
        window.closeDeleteModal();
        return;
    }
    
    currentData.splice(index, 1);
    saveData();
    renderSummary(currentData);
    populateMonthFilter(currentData);
    renderTable(currentData);
    window.closeDeleteModal();
    showToast('Entry deleted', 'success');
};

// ===== SETUP EVENT LISTENERS =====
const setupEventListeners = () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const btnAddEntry = document.getElementById('btnAddEntry');
    if (btnAddEntry) btnAddEntry.addEventListener('click', window.openAddModal);
    
    const btnAddFromEmpty = document.getElementById('btnAddFromEmpty');
    if (btnAddFromEmpty) btnAddFromEmpty.addEventListener('click', window.openAddModal);
    
    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportSummary);
    
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
const init = () => {
    initTheme();
    
    const modalOverlay = document.getElementById('modalOverlay');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const deleteModalOverlay = document.getElementById('deleteModalOverlay');
    const toast = document.getElementById('toast');
    
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (editModalOverlay) editModalOverlay.style.display = 'none';
    if (deleteModalOverlay) deleteModalOverlay.style.display = 'none';
    if (toast) toast.style.display = 'none';
    
    setupEventListeners();
    loadData();
    renderSummary(currentData);
    populateMonthFilter(currentData);
    renderTable(currentData);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
