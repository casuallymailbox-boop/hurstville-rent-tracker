/**
 * Rent Tracker - Hurstville
 * Displays and filters rent payment data from Excel export
 */

// ===== DATA SOURCE (Parsed from Rent for Hurstville.xlsx) =====
const rentData = [
    { date: "27-Jan-2026", totalRent: 750, iPaid: 750, roommatePaid: 0, myNet: 750, roommatePaidOn: null, status: "paid" },
    { date: "2-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: null, myNet: 750, roommatePaidOn: null, status: "pending" },
    { date: "9-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 850, myNet: -100, roommatePaidOn: "12-Feb-2026", status: "paid", note: "Roommate overpaid" },
    { date: "16-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, myNet: 365, roommatePaidOn: "20-Feb-2026", status: "paid" },
    { date: "23-Feb-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, myNet: 365, roommatePaidOn: "27-Feb-2026", status: "paid" },
    { date: "2-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, myNet: 365, roommatePaidOn: "6-Mar-2026", status: "paid" },
    { date: "9-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, myNet: 365, roommatePaidOn: "13-Mar-2026", status: "paid" },
    { date: "16-Mar-2026", totalRent: 750, iPaid: 750, roommatePaid: 385, myNet: 365, roommatePaidOn: "20-Mar-2026", status: "paid" },
    // Add remaining rows as needed - truncated for brevity
    // Pattern: weekly $750 rent, roommate pays ~$385 starting mid-Feb
];

// ===== DOM ELEMENTS =====
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const monthFilter = document.getElementById('monthFilter');
const summaryGrid = document.getElementById('summaryGrid');
const emptyState = document.getElementById('emptyState');

// ===== UTILITY FUNCTIONS =====
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    const formatted = Math.abs(amount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
    return amount < 0 ? `-${formatted}` : formatted;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return dateStr;
};

const getStatusBadge = (status, roommatePaidOn) => {
    if (status === 'paid') {
        return `<span class="status paid">✓ Paid</span>`;
    } else if (roommatePaidOn) {
        return `<span class="status pending">⏳ Pending</span>`;
    }
    return `<span class="status missed">✗ Missed</span>`;
};

// ===== RENDER FUNCTIONS =====
const renderSummary = (data) => {
    const totalWeeks = data.length;
    const totalRent = data.reduce((sum, row) => sum + (row.totalRent || 0), 0);
    const totalIPaid = data.reduce((sum, row) => sum + (row.iPaid || 0), 0);
    const totalRoommate = data.reduce((sum, row) => sum + (row.roommatePaid || 0), 0);
    const netMyContribution = data.reduce((sum, row) => sum + (row.myNet || 0), 0);
    const pendingCount = data.filter(row => row.status === 'pending').length;

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
        <div class="summary-card ${netMyContribution < 0 ? 'negative' : 'positive'}">
            <div class="label">My Net Contribution</div>
            <div class="value">${formatCurrency(netMyContribution)}</div>
        </div>
        <div class="summary-card">
            <div class="label">Pending Payments</div>
            <div class="value">${pendingCount}</div>
        </div>
    `;
};

const renderTable = (data) => {
    if (data.length === 0) {
        tableBody.innerHTML = '';
        emptyState.hidden = false;
        return;
    }
    
    emptyState.hidden = true;
    
    tableBody.innerHTML = data.map(row => `
        <tr>
            <td><strong>${formatDate(row.date)}</strong></td>
            <td>${formatCurrency(row.totalRent)}</td>
            <td>${formatCurrency(row.iPaid)}</td>
            <td class="${row.roommatePaid < 0 ? 'negative' : ''}">${formatCurrency(row.roommatePaid)}</td>
            <td class="${row.myNet < 0 ? 'negative' : row.myNet > 0 ? 'positive' : ''}">${formatCurrency(row.myNet)}</td>
            <td><small>${formatDate(row.roommatePaidOn)}</small></td>
            <td>${getStatusBadge(row.status, row.roommatePaidOn)}</td>
        </tr>
    `).join('');
};

// ===== FILTER & SEARCH =====
const populateMonthFilter = (data) => {
    const months = [...new Set(data.map(row => {
        if (!row.date) return null;
        return row.date.substring(3); // "Jan-2026"
    }).filter(Boolean))];
    
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
};

const filterData = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedMonth = monthFilter.value;
    
    const filtered = rentData.filter(row => {
        const matchesSearch = !searchTerm || 
            row.date?.toLowerCase().includes(searchTerm) ||
            row.status?.toLowerCase().includes(searchTerm);
        
        const matchesMonth = selectedMonth === 'all' || 
            row.date?.includes(selectedMonth);
        
        return matchesSearch && matchesMonth;
    });
    
    renderTable(filtered);
};

// ===== INITIALIZE =====
const init = () => {
    renderSummary(rentData);
    populateMonthFilter(rentData);
    renderTable(rentData);
    
    searchInput.addEventListener('input', filterData);
    monthFilter.addEventListener('change', filterData);
};

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
