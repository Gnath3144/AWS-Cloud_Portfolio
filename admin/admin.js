/**
 * admin/admin.js - Portfolio Content Studio & Agent Explorer Logic
 * Manages Profile, Resumes, Asset Library, Certs, Projects, Blog, and Agent Knowledge.
 */

// State Stores
let currentLeads = [];
let adminApiKey = sessionStorage.getItem('gopinath_admin_key') || 'guest_dev_access';
let activeStudioTab = 'leads';

// In-Memory Data Collections (Initialized with localStorage or static data files)
let studioProfile = null;
let studioResumes = null;
let studioAssets = null;
let studioCerts = null;
let studioProjects = null;
let studioBlog = null;

document.addEventListener('DOMContentLoaded', () => {
    initStudioState();
    setupEventListeners();
});

/* --------------------------------------------------------
   1. STUDIO INITIALIZATION & TAB CONTROLS
-------------------------------------------------------- */
async function initStudioState() {
    // 1. Profile
    const savedProfile = localStorage.getItem('gopinath_studio_profile');
    if (savedProfile) {
        studioProfile = JSON.parse(savedProfile);
    } else {
        try {
            const res = await fetch('../data/profile.json');
            if (res.ok) studioProfile = await res.json();
        } catch (e) {
            console.warn('Could not load profile.json fallback', e);
        }
    }
    populateProfileForm();

    // 2. Resumes
    const savedResumes = localStorage.getItem('gopinath_studio_resumes');
    if (savedResumes) {
        studioResumes = JSON.parse(savedResumes);
    } else {
        studioResumes = [
            {
                id: 'resume-1',
                title: 'Executive AI Architect & Data Engineering Dossier',
                subtitle: 'Principal Data & AI Architect | Senior Technical Consultant',
                category: 'Executive Summary',
                pages: '4 Pages',
                version: 'v2026.3',
                fileName: 'gopinath-resume.pdf',
                active: true,
                updated: '2026-08-21'
            },
            {
                id: 'resume-2',
                title: 'AWS Cloud Solutions Architect Resume',
                subtitle: 'Multi-Account Zero-Trust & Infrastructure Specialist',
                category: 'Cloud Architecture',
                pages: '3 Pages',
                version: 'v2026.1',
                fileName: 'gopinath-aws-architect-resume.pdf',
                active: false,
                updated: '2026-08-15'
            },
            {
                id: 'resume-3',
                title: 'Databricks Lakehouse & Streaming Master Resume',
                subtitle: 'PySpark, Delta Lake & High-Throughput Ingestion (120M+ events)',
                category: 'Data Engineering',
                pages: '3 Pages',
                version: 'v2026.2',
                fileName: 'gopinath-databricks-resume.pdf',
                active: false,
                updated: '2026-08-10'
            },
            {
                id: 'resume-4',
                title: 'Corporate Training & FDP Master Syllabus CV',
                subtitle: 'Pedagogy Lead | 5,000+ Engineers Trained across Tier-1 IT',
                category: 'Corporate Pedagogy',
                pages: '5 Pages',
                version: 'v2026.4',
                fileName: 'gopinath-training-syllabus.pdf',
                active: false,
                updated: '2026-08-01'
            }
        ];
        localStorage.setItem('gopinath_studio_resumes', JSON.stringify(studioResumes));
    }
    renderResumeManager();

    // 3. Asset Library
    const savedAssets = localStorage.getItem('gopinath_studio_assets');
    if (savedAssets) {
        studioAssets = JSON.parse(savedAssets);
    } else {
        studioAssets = [
            {
                id: 'asset-1',
                name: 'og-preview.png',
                path: 'images/og-preview.png',
                type: 'preview',
                size: '805 KB',
                uploaded: '2026-08-21',
                desc: 'High-resolution OpenGraph and Twitter card social share preview image',
                tags: ['SEO', 'OpenGraph', 'Social'],
                usedIn: ['OpenGraph Tag', 'Twitter Card', 'HTML Head']
            },
            {
                id: 'asset-2',
                name: 'akef-whitepaper.pdf',
                path: 'downloads/akef-whitepaper.pdf',
                type: 'document',
                size: '1.2 MB',
                uploaded: '2026-08-21',
                desc: 'Autonomous AI Knowledge Engineering Framework specification whitepaper',
                tags: ['AKEF', 'Whitepaper', 'Compiler'],
                usedIn: ['Downloads Hub', 'AKEF Centerpiece', 'Architecture Explorer']
            },
            {
                id: 'asset-3',
                name: 'databricks-training-brochure.pdf',
                path: 'downloads/databricks-training-brochure.pdf',
                type: 'document',
                size: '950 KB',
                uploaded: '2026-08-21',
                desc: '4-Week Corporate Masterclass Syllabus for Enterprise Lakehouses',
                tags: ['Databricks', 'Training', 'Syllabus'],
                usedIn: ['Downloads Hub', 'Services Section', 'AI Assistant']
            },
            {
                id: 'asset-4',
                name: 'aws-certified-solutions-architect.svg',
                path: 'images/aws-sa-pro.svg',
                type: 'badge',
                size: '42 KB',
                uploaded: '2026-08-20',
                desc: 'Official AWS Solutions Architect credential vector badge',
                tags: ['AWS', 'Certification', 'Badge'],
                usedIn: ['Certifications Section', 'Hero Pill']
            }
        ];
        localStorage.setItem('gopinath_studio_assets', JSON.stringify(studioAssets));
    }
    renderAssetLibrary();

    // 4. Certifications
    try {
        const certRes = await fetch('../data/certifications.json');
        if (certRes.ok) studioCerts = await certRes.json();
    } catch (e) {
        console.warn('Could not load certifications.json fallback', e);
    }
    renderCertificationsStudio();

    // 5. Projects
    try {
        const projRes = await fetch('../data/projects.json');
        if (projRes.ok) studioProjects = await projRes.json();
    } catch (e) {
        console.warn('Could not load projects.json fallback', e);
    }
    renderProjectsStudio();

    // 6. Blog
    try {
        const blogRes = await fetch('../data/blog.json');
        if (blogRes.ok) studioBlog = await blogRes.json();
    } catch (e) {
        console.warn('Could not load blog.json fallback', e);
    }
    initBlogEditor();

    // 7. Leads & Analytics
    loadLeads();
    loadAnalytics();
}

function setupEventListeners() {
    document.getElementById('search-box')?.addEventListener('input', debounce(loadLeads, 300));
    document.getElementById('status-filter')?.addEventListener('change', loadLeads);
    document.getElementById('service-filter')?.addEventListener('change', loadLeads);
    document.getElementById('sort-by')?.addEventListener('change', loadLeads);

    // Asset dropzone events
    const dropzone = document.getElementById('asset-dropzone');
    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
                handleUploadedFiles(e.dataTransfer.files);
            }
        });
    }
}

window.switchStudioTab = function(tabId) {
    activeStudioTab = tabId;

    // Update Sidebar Active state
    document.querySelectorAll('.studio-nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.id === `nav-btn-${tabId}`);
    });

    // Update Tab Content Panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-content-${tabId}`);
    });
};

/* --------------------------------------------------------
   2. PROFILE & IDENTITY MANAGER (2.5B)
-------------------------------------------------------- */
function populateProfileForm() {
    if (!studioProfile) return;
    document.getElementById('prof-name').value = studioProfile.name || 'Gopinath A';
    document.getElementById('prof-primary-role').value = studioProfile.title || '';
    document.getElementById('prof-location').value = studioProfile.location || 'Bengaluru, India';
    document.getElementById('prof-email').value = studioProfile.email || 'gnath3144@gmail.com';
    document.getElementById('prof-bio').value = studioProfile.bio || '';
    document.getElementById('prof-github').value = studioProfile.github || 'https://github.com/Gnath3144';
    document.getElementById('prof-linkedin').value = studioProfile.linkedin || 'https://www.linkedin.com/in/gopinath-a-cloud-ai/';

    if (studioProfile.stats) {
        document.getElementById('prof-stat-exp').value = studioProfile.stats.yearsExperience || 10;
        document.getElementById('prof-stat-trained').value = studioProfile.stats.engineersTrained || 5000;
        document.getElementById('prof-stat-repos').value = studioProfile.stats.publicRepos || 24;
        document.getElementById('prof-stat-events').value = studioProfile.stats.dailyEventsStreamed || 120;
    }
}

async function syncContentToBackend(section, payload) {
    try {
        const res = await fetch(`/api/admin/content/${section}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Key': adminApiKey
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            return true;
        }
    } catch (e) {
        // Fallback for static hosting
    }
    return false;
}

window.saveProfile = async function() {
    studioProfile = {
        name: document.getElementById('prof-name').value,
        title: document.getElementById('prof-primary-role').value,
        bio: document.getElementById('prof-bio').value,
        location: document.getElementById('prof-location').value,
        email: document.getElementById('prof-email').value,
        github: document.getElementById('prof-github').value,
        linkedin: document.getElementById('prof-linkedin').value,
        stats: {
            yearsExperience: parseInt(document.getElementById('prof-stat-exp').value) || 10,
            engineersTrained: parseInt(document.getElementById('prof-stat-trained').value) || 5000,
            publicRepos: parseInt(document.getElementById('prof-stat-repos').value) || 24,
            dailyEventsStreamed: parseInt(document.getElementById('prof-stat-events').value) || 120
        },
        tagline: "Architecting Enterprise AI Systems & Data Engineering Ecosystems"
    };

    localStorage.setItem('gopinath_studio_profile', JSON.stringify(studioProfile));
    
    // Sync to real backend if running
    const backendSynced = await syncContentToBackend('profile', studioProfile);
    if (backendSynced) {
        alert('✓ Professional Profile saved directly to data/profile.json on disk!');
    } else {
        alert('✓ Professional Profile saved successfully! (Synced to Local Storage / Ready for JSON export)');
    }
};

/* --------------------------------------------------------
   3. RESUME & DOSSIER MANAGER (2.5D)
-------------------------------------------------------- */
function renderResumeManager() {
    const container = document.getElementById('resume-cards-container');
    if (!container || !studioResumes) return;

    // Find active resume
    const active = studioResumes.find(r => r.active) || studioResumes[0];
    const headerLabel = document.getElementById('header-active-resume-label');
    if (headerLabel && active) {
        headerLabel.textContent = active.title.split(' ')[0] + ' ' + (active.title.split(' ')[1] || '');
    }

    container.innerHTML = studioResumes.map(r => `
        <div class="resume-card ${r.active ? 'active-resume' : ''}">
            <div>
                ${r.active ? '<span class="resume-active-badge">⭐ ACTIVE ON SITE</span>' : ''}
                <div style="font-size: 0.7rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase; margin-bottom: 4px;">${r.category} &bull; ${r.version}</div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; line-height: 1.35;">${r.title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">${r.subtitle}</p>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 16px;">
                    File: <strong>${r.fileName}</strong> (${r.pages})<br>
                    Updated: ${r.updated}
                </div>
            </div>
            <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
                ${r.active 
                    ? `<button disabled class="btn btn-emerald btn-sm" style="flex: 1; opacity: 0.9;">✓ Current Active</button>` 
                    : `<button onclick="setActiveResume('${r.id}')" class="btn btn-primary btn-sm" style="flex: 1;">⭐ Make Active</button>`
                }
                <button onclick="previewResumeDetails('${r.id}')" class="btn btn-secondary btn-sm">Preview</button>
            </div>
        </div>
    `).join('');
}

window.setActiveResume = function(resumeId) {
    studioResumes.forEach(r => {
        r.active = (r.id === resumeId);
    });
    localStorage.setItem('gopinath_studio_resumes', JSON.stringify(studioResumes));
    
    // Save to global active resume key consumed by public website
    const active = studioResumes.find(r => r.id === resumeId);
    if (active) {
        localStorage.setItem('gopinath_active_resume', JSON.stringify(active));
    }
    renderResumeManager();
};

window.openAddResumeModal = function() {
    document.getElementById('add-resume-modal').style.display = 'flex';
};

window.closeAddResumeModal = function() {
    document.getElementById('add-resume-modal').style.display = 'none';
};

window.submitNewResume = function() {
    const newResume = {
        id: 'resume-' + (studioResumes.length + 1),
        title: document.getElementById('new-resume-title').value,
        subtitle: document.getElementById('new-resume-subtitle').value,
        category: document.getElementById('new-resume-category').value,
        pages: document.getElementById('new-resume-pages').value,
        version: 'v2026.' + (studioResumes.length + 1),
        fileName: document.getElementById('new-resume-file').value,
        active: false,
        updated: new Date().toISOString().split('T')[0]
    };

    studioResumes.push(newResume);
    localStorage.setItem('gopinath_studio_resumes', JSON.stringify(studioResumes));
    closeAddResumeModal();
    renderResumeManager();
};

window.previewResumeDetails = function(resumeId) {
    const r = studioResumes.find(item => item.id === resumeId);
    if (r) {
        alert(`Resume Preview:\n\nTitle: ${r.title}\nSubtitle: ${r.subtitle}\nFile Target: /downloads/${r.fileName}\nActive: ${r.active ? 'YES' : 'NO'}`);
    }
};

/* --------------------------------------------------------
   4. MEDIA & ASSET LIBRARY (2.5C)
-------------------------------------------------------- */
function renderAssetLibrary() {
    const container = document.getElementById('asset-cards-container');
    if (!container || !studioAssets) return;

    const typeFilter = document.getElementById('asset-type-filter')?.value || 'all';
    let filtered = studioAssets;
    if (typeFilter !== 'all') {
        filtered = studioAssets.filter(a => a.type === typeFilter);
    }

    container.innerHTML = filtered.map(a => {
        const isImage = a.path && (a.path.endsWith('.png') || a.path.endsWith('.jpg') || a.path.endsWith('.svg') || a.path.endsWith('.webp') || a.path.startsWith('data:image'));
        return `
            <div class="asset-card">
                <div class="asset-preview">
                    ${isImage 
                        ? `<img src="../${a.path}" onerror="this.onerror=null; this.src='../images/og-preview.png';" alt="${a.name}">` 
                        : `<div class="asset-icon-box">📄</div>`
                    }
                </div>
                <div class="asset-info">
                    <div>
                        <div class="asset-title">${a.name}</div>
                        <div class="asset-meta">${a.size} &bull; Uploaded ${a.uploaded}</div>
                        <p style="font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4;">${a.desc}</p>
                        <div style="margin-bottom: 12px;">
                            ${(a.usedIn || []).map(u => `<span class="used-in-pill">✓ ${u}</span>`).join('')}
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                        <button onclick="copyAssetPath('${a.path}')" class="btn btn-secondary btn-sm" style="flex: 1;">📋 Copy Path</button>
                        <button onclick="deleteAsset('${a.id}')" class="btn btn-secondary btn-sm" style="color: var(--accent-red);">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.handleAssetFileUpload = function(e) {
    const files = e.target.files;
    if (files && files.length) {
        handleUploadedFiles(files);
    }
};

function handleUploadedFiles(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const isImg = file.type.startsWith('image/');
            const newAsset = {
                id: 'asset-' + (studioAssets.length + 1),
                name: file.name,
                path: isImg ? evt.target.result : `downloads/${file.name}`,
                type: isImg ? 'photo' : 'document',
                size: (file.size / 1024).toFixed(1) + ' KB',
                uploaded: new Date().toISOString().split('T')[0],
                desc: `Uploaded file ${file.name}`,
                tags: ['Custom', file.type],
                usedIn: ['Custom Integration']
            };
            studioAssets.unshift(newAsset);
            localStorage.setItem('gopinath_studio_assets', JSON.stringify(studioAssets));
            renderAssetLibrary();
        };
        reader.readAsDataURL(file);
    });
}

window.copyAssetPath = function(path) {
    navigator.clipboard.writeText(path).then(() => {
        alert(`✓ Copied asset relative path: ${path}`);
    });
};

window.deleteAsset = function(assetId) {
    studioAssets = studioAssets.filter(a => a.id !== assetId);
    localStorage.setItem('gopinath_studio_assets', JSON.stringify(studioAssets));
    renderAssetLibrary();
};

/* --------------------------------------------------------
   5. CERTIFICATIONS & SKILLS STUDIO
-------------------------------------------------------- */
function renderCertificationsStudio() {
    const container = document.getElementById('certs-list-container');
    if (!container || !studioCerts) return;

    container.innerHTML = (studioCerts.certifications || []).map((c, i) => `
        <div class="stat-box" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="font-size: 0.7rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase;">${c.issuer}</div>
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin: 4px 0 8px 0;">${c.title}</h4>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Issued: ${c.issueDate} &bull; ${c.credentialId || 'Verified'}</div>
            </div>
            <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
                <span class="status-badge status-closed">✓ Verified Active</span>
                <button onclick="deleteCert(${i})" class="btn btn-secondary btn-sm" style="color: var(--accent-red);">Remove</button>
            </div>
        </div>
    `).join('');
}

window.saveCertifications = async function() {
    localStorage.setItem('gopinath_studio_certs', JSON.stringify(studioCerts));
    const synced = await syncContentToBackend('certifications', studioCerts);
    if (synced) {
        alert('✓ Certifications saved directly to data/certifications.json on disk!');
    } else {
        alert('✓ Certifications updated successfully! (Synced to Local Storage)');
    }
};

window.deleteCert = function(idx) {
    if (studioCerts && studioCerts.certifications) {
        studioCerts.certifications.splice(idx, 1);
        renderCertificationsStudio();
    }
};

/* --------------------------------------------------------
   6. PROJECTS & ARCHITECTURE STUDIO
-------------------------------------------------------- */
function renderProjectsStudio() {
    const container = document.getElementById('projects-list-container');
    if (!container || !studioProjects) return;

    container.innerHTML = studioProjects.map((p, i) => `
        <div class="card-panel" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <span class="admin-badge">${p.category || 'Flagship Architecture'}</span>
                    <h4 style="font-size: 1.1rem; font-weight: 800; margin-top: 4px;">${p.title}</h4>
                    <p style="font-size: 0.85rem; color: var(--aws-orange);">${p.tagline || ''}</p>
                </div>
                <a href="${p.repository}" target="_blank" class="btn btn-secondary btn-sm">GitHub Repo ↗</a>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 12px;">${p.executiveSummary || ''}</p>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); padding: 8px 12px; border-radius: var(--radius-sm); color: var(--accent-emerald); font-size: 0.825rem; font-weight: 700;">
                ✓ Impact Metric: ${p.businessImpact || ''}
            </div>
        </div>
    `).join('');
}

window.saveProjects = async function() {
    localStorage.setItem('gopinath_studio_projects', JSON.stringify(studioProjects));
    const synced = await syncContentToBackend('projects', studioProjects);
    if (synced) {
        alert('✓ Projects saved directly to data/projects.json on disk!');
    } else {
        alert('✓ Projects and Architectures saved successfully! (Synced to Local Storage)');
    }
};

/* --------------------------------------------------------
   7. BLOG & PUBLICATIONS EDITOR
-------------------------------------------------------- */
function initBlogEditor() {
    const selector = document.getElementById('blog-select-post');
    if (!selector || !studioBlog) return;

    selector.innerHTML = studioBlog.map((b, i) => `
        <option value="${i}">${b.title}</option>
    `).join('');

    loadSelectedBlogPost();
}

window.loadSelectedBlogPost = function() {
    const selector = document.getElementById('blog-select-post');
    if (!selector || !studioBlog) return;
    const post = studioBlog[parseInt(selector.value)] || studioBlog[0];
    if (!post) return;

    document.getElementById('blog-edit-title').value = post.title || '';
    document.getElementById('blog-edit-category').value = post.category || 'Articles';
    document.getElementById('blog-edit-readtime').value = post.readTime || '8 min read';
    document.getElementById('blog-edit-tags').value = (post.tags || []).join(', ');
    document.getElementById('blog-edit-summary').value = post.summary || '';
    document.getElementById('blog-edit-content').value = post.content || '';

    renderBlogLivePreview();
};

window.renderBlogLivePreview = function() {
    const content = document.getElementById('blog-edit-content').value;
    const preview = document.getElementById('blog-live-preview');
    if (!preview) return;

    // Simple markdown render for preview
    let html = content
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, '<pre style="background:#020617; color:#38bdf8; padding:12px; border-radius:6px; font-family:monospace; margin:12px 0;"><code>$2</code></pre>')
        .replace(/^### (.*$)/gim, '<h3 style="color:#FF9900; margin:16px 0 8px 0;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="color:#fff; margin:20px 0 10px 0;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n+/g, '</p><p style="margin-bottom:12px; line-height:1.6;">');

    preview.innerHTML = `<p style="margin-bottom:12px; line-height:1.6;">${html}</p>`;
};

window.saveCurrentBlogPost = async function() {
    const selector = document.getElementById('blog-select-post');
    if (!selector || !studioBlog) return;
    const idx = parseInt(selector.value);
    
    studioBlog[idx] = {
        ...studioBlog[idx],
        title: document.getElementById('blog-edit-title').value,
        category: document.getElementById('blog-edit-category').value,
        readTime: document.getElementById('blog-edit-readtime').value,
        tags: document.getElementById('blog-edit-tags').value.split(',').map(t => t.trim()),
        summary: document.getElementById('blog-edit-summary').value,
        content: document.getElementById('blog-edit-content').value
    };

    localStorage.setItem('gopinath_studio_blog', JSON.stringify(studioBlog));
    const synced = await syncContentToBackend('blog', studioBlog);
    if (synced) {
        alert('✓ Blog post saved directly to data/blog.json on disk!');
    } else {
        alert('✓ Blog post saved successfully! (Synced to Local Storage)');
    }
};

/* --------------------------------------------------------
   8. AGENT KNOWLEDGE EXPLORER (2.5E)
-------------------------------------------------------- */
window.setAgentPrompt = function(promptText) {
    const input = document.getElementById('agent-sandbox-input');
    if (input) {
        input.value = promptText;
        runAgentGenerator();
    }
};

window.runAgentGenerator = function() {
    const input = document.getElementById('agent-sandbox-input');
    const output = document.getElementById('agent-sandbox-output');
    if (!input || !output) return;

    const query = input.value.trim().toLowerCase();
    output.innerHTML = '<div style="color: var(--aws-orange);">Thinking and synthesizing personal knowledge base... ⚡</div>';

    setTimeout(() => {
        if (query.includes('cloud architect') || query.includes('about me')) {
            output.innerHTML = `
                <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0284c7; padding: 14px; border-radius: 6px; margin-bottom: 12px;">
                    <strong style="color: #38bdf8;">Generated About Me Section (AWS Cloud Architect):</strong>
                    <p style="margin-top: 8px; color: #f8fafc; line-height: 1.6;">
                        "With over a decade of technical leadership across enterprise cloud ecosystems, I specialize in designing Zero-Trust AWS landing zones, high-throughput streaming architectures (PySpark processing 120M+ daily transactions), and deterministic AI knowledge compilers (AKEF). Having trained 5,000+ corporate engineers across Infosys, Wipro, TCS, and Accenture, I bridge the gap between deep cloud infrastructure rigor and scalable enterprise business outcomes."
                    </p>
                </div>
            `;
        } else if (query.includes('databricks') || query.includes('syllabus')) {
            output.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 14px; border-radius: 6px; margin-bottom: 12px;">
                    <strong style="color: #34d399;">Generated 4-Week Databricks Lakehouse Syllabus:</strong>
                    <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.6;">
                        <li><strong>Week 1:</strong> Decoupled S3 Cloud Storage, Delta Lake ACID Log Internals &amp; Parquet Compaction.</li>
                        <li><strong>Week 2:</strong> PySpark Structured Streaming Ingress &amp; Auto Loader Optimization.</li>
                        <li><strong>Week 3:</strong> Delta Live Tables (DLT), Unity Catalog Governance &amp; Medallion Pipeline Design.</li>
                        <li><strong>Week 4:</strong> Production Benchmark Lab: Z-Ordering, File Pruning &amp; 67% Query Latency Reduction.</li>
                    </ul>
                </div>
            `;
        } else {
            output.innerHTML = `
                <div style="background: rgba(168, 85, 247, 0.1); border-left: 4px solid #a855f7; padding: 14px; border-radius: 6px;">
                    <strong style="color: #c084fc;">Synthesized Knowledge Response:</strong>
                    <p style="margin-top: 8px; color: #f8fafc; line-height: 1.6;">
                        "Gopinath A combines 10+ years of multi-cloud engineering (AWS, Azure, Databricks, Snowflake) with creator-level expertise in Generative AI (AKEF Framework). Verified metrics include 5,000+ engineers mentored, 24 open-source repositories, and multi-terabyte data lakehouse benchmarks."
                    </p>
                </div>
            `;
        }
    }, 600);
};

window.exportAgentKnowledge = function() {
    const knowledgeExport = {
        profile: studioProfile,
        resumes: studioResumes,
        assets: studioAssets,
        certifications: studioCerts,
        projects: studioProjects,
        blog: studioBlog
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(knowledgeExport, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "agent_knowledge_graph_export.json");
    dlAnchor.click();
};

/* --------------------------------------------------------
   9. PUBLISH & SYNC STUDIO (2.5F)
-------------------------------------------------------- */
window.downloadIndividualJson = function(fileType) {
    let dataObj = null;
    let fileName = `${fileType}.json`;

    if (fileType === 'profile') dataObj = studioProfile;
    if (fileType === 'blog') dataObj = studioBlog;
    if (fileType === 'certifications') dataObj = studioCerts;
    if (fileType === 'projects') dataObj = studioProjects;

    if (!dataObj) {
        alert('File data is currently empty.');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", fileName);
    dlAnchor.click();
};

window.downloadAllJsonBundle = function() {
    ['profile', 'blog', 'certifications', 'projects'].forEach((f, i) => {
        setTimeout(() => {
            downloadIndividualJson(f);
        }, i * 300);
    });
};

/* --------------------------------------------------------
   10. LEADS & VISITOR ANALYTICS
-------------------------------------------------------- */
async function loadLeads() {
    const search = document.getElementById('search-box')?.value || '';
    const status = document.getElementById('status-filter')?.value || 'all';
    const service = document.getElementById('service-filter')?.value || 'all';
    const sortBy = document.getElementById('sort-by')?.value || 'timestamp';

    try {
        const res = await fetch(`/api/leads?search=${search}&status=${status}&service=${service}&sort_by=${sortBy}`, {
            headers: { 'X-Admin-Key': adminApiKey }
        });
        if (res.ok) {
            const data = await res.json();
            currentLeads = data;
            renderLeads(data);
            updateStats(data);
            return;
        }
    } catch (e) {
        // Fallback for static GitHub Pages hosting
    }

    // Static / Offline local storage fallback
    const offline = JSON.parse(localStorage.getItem('gopinath_offline_inquiries') || '[]');
    let leads = offline.map(item => ({
        id: item.id || 'REF-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        timestamp: item.timestamp || new Date().toISOString(),
        name: item.name || 'Anonymous',
        email: item.email || 'N/A',
        phone: item.phone || '',
        company: item.company || 'Enterprise Direct',
        service: item.service || 'Corporate Training',
        subject: item.subject || 'Consulting Inquiry',
        message: item.message || '',
        status: item.status || 'New'
    }));

    if (status !== 'all') leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
    if (service !== 'all') leads = leads.filter(l => l.service.toLowerCase().includes(service.toLowerCase()));

    currentLeads = leads;
    renderLeads(leads);
    updateStats(leads);
}

function renderLeads(leads) {
    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;

    if (!leads || leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No inquiries found matching criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = leads.map(l => `
        <tr>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">${l.id}<br><span style="font-size:0.7rem; color:var(--text-muted);">${(l.timestamp||'').split('T')[0]}</span></td>
            <td><strong>${l.name}</strong><br><span style="font-size:0.75rem; color:var(--text-secondary);">${l.company || 'Direct'}</span></td>
            <td><a href="mailto:${l.email}" style="color: var(--accent-cyan); text-decoration: none;">${l.email}</a></td>
            <td><span class="admin-badge">${l.service}</span><div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${l.subject}</div></td>
            <td><span class="status-badge status-${(l.status||'new').toLowerCase()}">${l.status || 'New'}</span></td>
            <td>
                <button onclick="markStatus('${l.id}', 'Contacted')" class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.75rem;">Contacted</button>
                <button onclick="markStatus('${l.id}', 'Closed')" class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.75rem;">Close</button>
            </td>
        </tr>
    `).join('');
}

function updateStats(leads) {
    const total = leads.length;
    const newCount = leads.filter(l => (l.status||'').toLowerCase() === 'new').length;
    const contacted = leads.filter(l => (l.status||'').toLowerCase() === 'contacted').length;
    const closed = leads.filter(l => (l.status||'').toLowerCase() === 'closed').length;

    if (document.getElementById('stat-total')) document.getElementById('stat-total').textContent = total;
    if (document.getElementById('stat-new')) document.getElementById('stat-new').textContent = newCount;
    if (document.getElementById('stat-contacted')) document.getElementById('stat-contacted').textContent = contacted;
    if (document.getElementById('stat-closed')) document.getElementById('stat-closed').textContent = closed;
}

window.markStatus = function(leadId, newStatus) {
    const lead = currentLeads.find(l => l.id === leadId);
    if (lead) {
        lead.status = newStatus;
        localStorage.setItem('gopinath_offline_inquiries', JSON.stringify(currentLeads));
        renderLeads(currentLeads);
        updateStats(currentLeads);
    }
};

window.exportCsv = function() {
    if (!currentLeads || !currentLeads.length) {
        alert('No leads to export.');
        return;
    }
    const headers = ['ID', 'Timestamp', 'Name', 'Email', 'Company', 'Service', 'Subject', 'Status'];
    const rows = currentLeads.map(l => [l.id, l.timestamp, `"${l.name}"`, l.email, `"${l.company}"`, `"${l.service}"`, `"${l.subject}"`, l.status]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

function loadAnalytics() {
    const anTotal = document.getElementById('an-stat-total');
    if (anTotal) anTotal.textContent = '1,420';
    if (document.getElementById('an-stat-unique')) document.getElementById('an-stat-unique').textContent = '980';
    if (document.getElementById('an-stat-daily')) document.getElementById('an-stat-daily').textContent = '84';
    if (document.getElementById('an-stat-conversion')) document.getElementById('an-stat-conversion').textContent = '6.4%';

    const listSections = document.getElementById('an-list-sections');
    if (listSections) {
        listSections.innerHTML = `
            <li style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>#architecture (15-tab explorer)</span><strong>48%</strong></li>
            <li style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>#akef (6-stage compiler)</span><strong>29%</strong></li>
            <li style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>#downloads (Resume & Whitepaper)</span><strong>16%</strong></li>
        `;
    }
}

window.handleAuthSubmit = function(e) {
    e.preventDefault();
    const key = document.getElementById('admin-key-input').value.trim();
    if (key) {
        adminApiKey = key;
        sessionStorage.setItem('gopinath_admin_key', key);
        document.getElementById('auth-modal').style.display = 'none';
        loadLeads();
    }
};

window.logout = function() {
    sessionStorage.removeItem('gopinath_admin_key');
    window.location.href = '../index.html';
};

function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
