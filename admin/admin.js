/**
 * admin/admin.js - Lead Management Admin Dashboard Logic
 */

let currentLeads = [];
let adminApiKey = sessionStorage.getItem('gopinath_admin_key') || '';

document.addEventListener('DOMContentLoaded', () => {
  if (!adminApiKey) {
    showAuthModal();
  } else {
    loadLeads();
  }

  // Setup search & filter listeners
  document.getElementById('search-box')?.addEventListener('input', debounce(loadLeads, 300));
  document.getElementById('status-filter')?.addEventListener('change', loadLeads);
  document.getElementById('service-filter')?.addEventListener('change', loadLeads);
  document.getElementById('sort-by')?.addEventListener('change', loadLeads);
});

function showAuthModal() {
  document.getElementById('auth-modal').style.display = 'flex';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const inputKey = document.getElementById('admin-key-input').value.trim();
  if (!inputKey) return;

  adminApiKey = inputKey;
  sessionStorage.setItem('gopinath_admin_key', adminApiKey);
  document.getElementById('auth-modal').style.display = 'none';
  loadLeads();
}

async function loadLeads() {
  const search = document.getElementById('search-box')?.value || '';
  const status = document.getElementById('status-filter')?.value || 'all';
  const service = document.getElementById('service-filter')?.value || 'all';
  const sortBy = document.getElementById('sort-by')?.value || 'timestamp';

  const params = new URLSearchParams({
    search,
    status,
    service,
    sort_by: sortBy,
    order: 'desc'
  });

  try {
    const res = await fetch(`/api/leads?${params.toString()}`, {
      headers: { 'X-Admin-Key': adminApiKey }
    });

    if (res.status === 401) {
      sessionStorage.removeItem('gopinath_admin_key');
      adminApiKey = '';
      showAuthModal();
      document.getElementById('auth-error').textContent = 'Invalid Admin Key. Please try again.';
      return;
    }

    if (!res.ok) throw new Error('Failed to fetch leads from API');

    const leads = await res.json();
    currentLeads = leads;
    renderLeads(leads);
    updateStats(leads);
  } catch (err) {
    // Fallback: Read client-side saved inquiries for static hosting & offline testing
    console.warn('API unavailable, reading local cached inquiries:', err);
    try {
      const offline = JSON.parse(localStorage.getItem('gopinath_offline_inquiries') || '[]');
      let leads = offline.map(item => ({
        id: item.id || 'OFFLINE-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        timestamp: item.timestamp || new Date().toISOString(),
        name: item.name || 'Anonymous',
        email: item.email || 'N/A',
        phone: item.phone || '',
        company: item.company || 'Direct',
        service: item.service || 'Corporate Training',
        contact_method: item.contact_method || 'Email',
        subject: item.subject || 'Direct Inquiry',
        message: item.message || '',
        status: item.status || 'New'
      }));

      if (status !== 'all') {
        leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
      }
      if (service !== 'all') {
        leads = leads.filter(l => l.service.toLowerCase().includes(service.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        leads = leads.filter(l => 
          l.name.toLowerCase().includes(q) || 
          l.email.toLowerCase().includes(q) || 
          l.company.toLowerCase().includes(q) || 
          l.subject.toLowerCase().includes(q)
        );
      }

      currentLeads = leads;
      renderLeads(leads);
      updateStats(leads);
    } catch (localErr) {
      console.error('Error loading offline leads:', localErr);
    }
  }
}

function updateStats(leads) {
  const total = leads.length;
  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const closedCount = leads.filter(l => l.status === 'Closed').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-new').textContent = newCount;
  document.getElementById('stat-contacted').textContent = contactedCount;
  document.getElementById('stat-closed').textContent = closedCount;
}

function renderLeads(leads) {
  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;

  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">No enquiries found matching your criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">
        <strong>${escapeHtml(l.id)}</strong><br>
        <span style="color: var(--text-muted);">${formatDate(l.timestamp)}</span>
      </td>
      <td>
        <strong style="color: var(--text-primary);">${escapeHtml(l.name)}</strong><br>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(l.company || 'Direct')}</span>
      </td>
      <td>
        <a href="mailto:${escapeHtml(l.email)}" style="color: var(--accent-cyan); text-decoration: none;">${escapeHtml(l.email)}</a><br>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(l.phone || 'No phone')} (${escapeHtml(l.contact_method)})</span>
      </td>
      <td>
        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);">${escapeHtml(l.service)}</span><br>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(l.subject)}</span>
      </td>
      <td>
        <select onchange="updateStatus('${l.id}', this.value)" class="filter-select" style="padding: 4px 8px; font-size: 0.75rem;">
          <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </td>
      <td>
        <button onclick="viewLeadDetail('${l.id}')" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">View</button>
        <button onclick="deleteLead('${l.id}')" class="btn btn-danger" style="padding: 4px 8px; font-size: 0.75rem;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function viewLeadDetail(leadId) {
  const lead = currentLeads.find(l => l.id === leadId);
  if (!lead) return;

  document.getElementById('modal-lead-id').textContent = lead.id;
  document.getElementById('modal-lead-name').textContent = lead.name;
  document.getElementById('modal-lead-email').textContent = lead.email;
  document.getElementById('modal-lead-phone').textContent = lead.phone || 'None';
  document.getElementById('modal-lead-company').textContent = lead.company || 'None';
  document.getElementById('modal-lead-service').textContent = lead.service;
  document.getElementById('modal-lead-subject').textContent = lead.subject;
  document.getElementById('modal-lead-message').textContent = lead.message;
  document.getElementById('modal-lead-ip').textContent = `${lead.ip_address} (${lead.browser})`;
  document.getElementById('modal-lead-notes').value = lead.notes || '';

  document.getElementById('save-notes-btn').onclick = () => saveNotes(lead.id);
  document.getElementById('detail-modal').style.display = 'flex';
}

async function updateStatus(leadId, newStatus) {
  try {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminApiKey
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) loadLeads();
  } catch (err) {
    console.error('Failed to update status:', err);
  }
}

async function saveNotes(leadId) {
  const notes = document.getElementById('modal-lead-notes').value;
  try {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminApiKey
      },
      body: JSON.stringify({ notes })
    });
    if (res.ok) {
      alert('Notes saved successfully');
      loadLeads();
    }
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
}

async function deleteLead(leadId) {
  if (!confirm(`Are you sure you want to delete lead ${leadId}?`)) return;
  try {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Key': adminApiKey }
    });
    if (res.ok) loadLeads();
  } catch (err) {
    console.error('Failed to delete lead:', err);
  }
}

function exportCsv() {
  window.open(`/api/leads/export/csv?key=${encodeURIComponent(adminApiKey)}`, '_blank');
}

function closeDetailModal() {
  document.getElementById('detail-modal').style.display = 'none';
}

function logout() {
  sessionStorage.removeItem('gopinath_admin_key');
  adminApiKey = '';
  location.reload();
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function switchAdminTab(tabName) {
  const leadsTab = document.getElementById('tab-content-leads');
  const analyticsTab = document.getElementById('tab-content-analytics');
  const btnLeads = document.getElementById('tab-btn-leads');
  const btnAnalytics = document.getElementById('tab-btn-analytics');

  if (tabName === 'leads') {
    leadsTab.style.display = 'block';
    analyticsTab.style.display = 'none';
    btnLeads.className = 'btn btn-primary';
    btnAnalytics.className = 'btn btn-secondary';
  } else {
    leadsTab.style.display = 'none';
    analyticsTab.style.display = 'block';
    btnLeads.className = 'btn btn-secondary';
    btnAnalytics.className = 'btn btn-primary';
    loadAnalyticsDashboard();
  }
}

async function loadAnalyticsDashboard() {
  try {
    const res = await fetch('/api/analytics/dashboard', {
      headers: { 'X-Admin-Key': adminApiKey }
    });

    if (!res.ok) return;

    const data = await res.json();
    document.getElementById('an-stat-total').textContent = data.total_visitors || 0;
    document.getElementById('an-stat-unique').textContent = data.unique_visitors || 0;
    document.getElementById('an-stat-daily').textContent = data.daily_visitors || 0;
    document.getElementById('an-stat-conversion').textContent = (data.contact_conversion_rate_percent || 0) + '%';

    renderList('an-list-referrers', data.referrers);
    renderEventList('an-list-sections', data.most_visited_sections);
    renderEventList('an-list-projects', data.most_viewed_projects);
    renderEventList('an-list-downloads', data.most_downloaded_resumes);
  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

function renderList(elemId, obj) {
  const elem = document.getElementById(elemId);
  if (!elem) return;
  if (!obj || Object.keys(obj).length === 0) {
    elem.innerHTML = '<li style="padding: 4px 0; color: var(--text-muted);">No data logged yet</li>';
    return;
  }
  elem.innerHTML = Object.entries(obj).map(([k, v]) => `
    <li style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.05);">
      <span>${escapeHtml(k)}</span>
      <strong style="color: var(--accent-cyan);">${v}</strong>
    </li>
  `).join('');
}

function renderEventList(elemId, list) {
  const elem = document.getElementById(elemId);
  if (!elem) return;
  if (!list || list.length === 0) {
    elem.innerHTML = '<li style="padding: 4px 0; color: var(--text-muted);">No data logged yet</li>';
    return;
  }
  elem.innerHTML = list.map(item => `
    <li style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.05);">
      <span>${escapeHtml(item.target)}</span>
      <strong style="color: var(--accent-cyan);">${item.count}</strong>
    </li>
  `).join('');
}

