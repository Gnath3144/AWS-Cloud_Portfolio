/**
 * js/architecture-explorer.js - Dedicated Architecture Explorer & Router (Component 26)
 * Multi-tier loading strategy supporting Backend API, Static JSON, and Graceful Offline States.
 */
(function () {
    let currentArchData = null;
    let currentProjectId = null;
    let currentZoom = 1.0;
    let previousActiveElement = null;

    async function loadArchitectureDetails() {
        if (currentArchData) return currentArchData;

        if (window.PortfolioData && typeof window.PortfolioData.load === 'function') {
            const data = await window.PortfolioData.load('architecture');
            if (data && Object.keys(data).length > 0) {
                currentArchData = data;
                return currentArchData;
            }
        }

        const candidateEndpoints = [
            'data/portfolio/architecture.json',
            'data/architecture_details.json',
            '/api/cms/architecture_details',
            '/data/architecture_details.json'
        ];

        for (const url of candidateEndpoints) {
            try {
                const resp = await fetch(url, { cache: 'no-cache' });
                if (resp.ok) {
                    const data = await resp.json();
                    if (data && Object.keys(data).length > 0) {
                        currentArchData = data;
                        return currentArchData;
                    }
                }
            } catch (err) {
                // Try next endpoint
            }
        }

        console.warn('Architecture details: all endpoints exhausted.');
        return null;
    }

    window.openDedicatedExplorer = async function (projectId, initialTab = 'highLevel') {
        previousActiveElement = document.activeElement;
        let modal = document.getElementById('architecture-explorer-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'architecture-explorer-modal';
            modal.style.cssText = 'position: fixed; inset: 0; z-index: 10000; background: rgba(2, 6, 23, 0.94); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: var(--font-sans, system-ui, sans-serif);';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', 'Dedicated Architecture Explorer');
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeDedicatedExplorer();
                }
            });
            document.body.appendChild(modal);
        }

        document.body.style.overflow = 'hidden';

        const archMap = await loadArchitectureDetails();
        if (!archMap) {
            // Friendly inline error state instead of raw browser alert()
            modal.innerHTML = `
                <div style="background: #0f172a; border: 1px solid var(--aws-orange, #FF9900); border-radius: 16px; width: 100%; max-width: 600px; padding: 32px; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.85); color: #f8fafc;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255, 153, 0, 0.15); color: #FF9900; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px;">Architecture Details Unavailable</h3>
                    <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
                        The technical blueprint specifications could not be retrieved. Please verify your network connection or try reloading.
                    </p>
                    <div style="display: flex; justify-content: center; gap: 12px;">
                        <button onclick="window.openDedicatedExplorer('${projectId}', '${initialTab}')" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.875rem;">Retry Connection</button>
                        <button onclick="window.closeDedicatedExplorer()" class="btn btn-secondary" style="padding: 8px 18px; font-size: 0.875rem;">Close</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
            return;
        }

        const projectData = archMap[projectId] || archMap['akef'] || Object.values(archMap)[0];
        currentProjectId = projectId;
        currentZoom = 1.0;

        // Update URL hash for deep-linking
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', `#architecture/${projectId}/${initialTab}`);
        }

        const tabs = [
            { id: 'highLevel', label: '1. High-Level Arch' },
            { id: 'pipelineOverview', label: '2. Pipeline Overview' },
            { id: 'detailedPipeline', label: '3. Detailed Pipeline' },
            { id: 'deploymentPipeline', label: '4. Deployment' },
            { id: 'cicdPipeline', label: '5. CI/CD Pipeline' },
            { id: 'dataFlow', label: '6. Data Flow' },
            { id: 'sequenceDiagram', label: '7. Sequence Diagram' },
            { id: 'componentDiagram', label: '8. Components' },
            { id: 'infrastructureDiagram', label: '9. Infrastructure' },
            { id: 'databaseER', label: '10. Database ER' },
            { id: 'apiFlow', label: '11. API Flow' },
            { id: 'codeExplorer', label: '12. Code Explorer' },
            { id: 'performanceDashboard', label: '13. Performance' },
            { id: 'evolution', label: '14. Evolution' },
            { id: 'downloads', label: '15. Downloads' }
        ];

        modal.innerHTML = `
            <div style="background: #0f172a; border: 1px solid var(--aws-orange, #FF9900); border-radius: 16px; width: 100%; max-width: 1100px; height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.85); color: #f8fafc;">
                <!-- Dedicated Explorer Header -->
                <div style="background: rgba(24, 38, 58, 0.95); padding: 16px 24px; border-bottom: 1px solid rgba(255, 153, 0, 0.3); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span class="status-pill" style="font-size: 0.65rem; background: rgba(255,153,0,0.15); color: #FF9900; border-color: #FF9900;">DEDICATED EXPLORER: ${(projectId || '').toUpperCase()}</span>
                            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #38bdf8;">/#architecture/${projectId}</span>
                        </div>
                        <h2 style="font-size: 1.4rem; font-weight: 900; margin: 4px 0 0 0; color: #fff;">${projectData.title || 'Enterprise Blueprint'}</h2>
                        <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 2px;">${projectData.tagline || ''}</div>
                    </div>
                    <button id="arch-close-btn" onclick="window.closeDedicatedExplorer()" aria-label="Close Architecture Explorer" style="background: none; border: none; color: #94a3b8; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.2s;">✕</button>
                </div>

                <!-- Tab Bar Navigation -->
                <div style="background: #020617; padding: 8px 16px; display: flex; gap: 6px; overflow-x: auto; white-space: nowrap; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;" role="tablist">
                    ${tabs.map(t => `<button class="arch-tab-btn ${t.id === initialTab ? 'active' : ''}" role="tab" aria-selected="${t.id === initialTab}" onclick="window.switchArchTab('${t.id}')">${t.label}</button>`).join('')}
                </div>

                <!-- Viewport -->
                <div id="arch-viewport" style="flex: 1; padding: 24px; overflow-y: auto; background: #0b1329;"></div>
            </div>

            <style>
                .arch-tab-btn {
                    background: rgba(30, 41, 59, 0.7);
                    color: #94a3b8;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    padding: 6px 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .arch-tab-btn:hover {
                    color: #FF9900;
                    border-color: rgba(255, 153, 0, 0.4);
                }
                .arch-tab-btn.active {
                    background: #FF9900;
                    color: #080d16;
                    border-color: #FF9900;
                    font-weight: 800;
                }
                .code-lang-tab {
                    background: #1e293b;
                    color: #FF9900;
                    border: 1px solid rgba(255, 153, 0, 0.3);
                    border-radius: 6px;
                    padding: 4px 10px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .code-lang-tab.active {
                    background: #FF9900;
                    color: #020617;
                    font-weight: 700;
                }
                @keyframes pulseParticle {
                    0% { stroke-dashoffset: 20; }
                    100% { stroke-dashoffset: 0; }
                }
                .animated-particle-path {
                    stroke-dasharray: 8 6;
                    animation: pulseParticle 1s linear infinite;
                }
            </style>
        `;

        modal.style.display = 'flex';
        window.switchArchTab(initialTab);

        const closeBtn = document.getElementById('arch-close-btn');
        if (closeBtn) closeBtn.focus();

        if (window.trackAnalyticsEvent) {
            window.trackAnalyticsEvent('inspect_architecture', `${projectId}_${initialTab}`);
        }
    };

    window.closeDedicatedExplorer = function () {
        const modal = document.getElementById('architecture-explorer-modal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
        if (window.history && window.history.pushState) {
            const path = window.location.pathname + window.location.search;
            window.history.pushState(null, '', path);
        }
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    };

    window.switchArchTab = function (tabId) {
        document.querySelectorAll('.arch-tab-btn').forEach(btn => {
            const isTarget = btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tabId}'`);
            btn.classList.toggle('active', isTarget);
            btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        const viewport = document.getElementById('arch-viewport');
        if (!viewport || !currentArchData || !currentProjectId) return;

        const p = currentArchData[currentProjectId] || currentArchData['akef'] || Object.values(currentArchData)[0];

        switch (tabId) {
            case 'highLevel':
                viewport.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                        <h3 style="color: #FF9900; font-size: 1.15rem; margin: 0;">1. High-Level Architecture — ${p.title || ''}</h3>
                        <div>
                            <button onclick="window.zoomArchSvg(0.1)" class="arch-tab-btn" style="padding: 2px 8px;">Zoom +</button>
                            <button onclick="window.zoomArchSvg(-0.1)" class="arch-tab-btn" style="padding: 2px 8px;">Zoom -</button>
                            <button onclick="window.zoomArchSvg(0)" class="arch-tab-btn" style="padding: 2px 8px;">Reset</button>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">${p.highLevel?.summary || ''}</p>
                    <div id="svg-zoom-wrapper" style="background: #020617; border: 1px solid rgba(255,153,0,0.3); border-radius: 12px; padding: 20px; overflow: auto; text-align: center;">
                        <div id="svg-inner-target" style="transform: scale(${currentZoom}); transform-origin: top center; transition: transform 0.2s;">
                            ${p.highLevel?.svg || '<div style="color:#94a3b8;">Blueprint diagram rendering...</div>'}
                        </div>
                    </div>
                `;
                break;

            case 'pipelineOverview':
                const stepsHtml = (p.pipelineOverview || []).map(s => `
                    <div style="background: rgba(30, 41, 59, 0.7); border-left: 4px solid #FF9900; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px;">
                        <h4 style="color: #FF9900; font-size: 0.95rem; margin-bottom: 4px;">${s.step}</h4>
                        <p style="font-size: 0.875rem; color: #cbd5e1; margin: 0; line-height: 1.5;">${s.desc}</p>
                    </div>
                `).join('');
                viewport.innerHTML = `<h3 style="color: #FF9900; margin-bottom: 16px;">2. Interactive Pipeline Overview</h3>${stepsHtml || '<p style="color:#94a3b8;">Pipeline overview configured.</p>'}`;
                break;

            case 'detailedPipeline':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">3. Detailed Engineering Pipeline</h3>
                    <div style="background: #020617; border: 1px solid #38bdf8; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.95rem; color: #38bdf8; line-height: 1.8;">
                        ${p.detailedEngineeringPipeline || 'Pipeline details configured.'}
                    </div>
                `;
                break;

            case 'deploymentPipeline':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">4. Deployment Pipeline</h3>
                    <div style="background: #020617; border: 1px solid #a855f7; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.95rem; color: #a855f7; line-height: 1.8;">
                        ${p.deploymentPipeline || 'Deployment specs configured.'}
                    </div>
                `;
                break;

            case 'cicdPipeline':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">5. CI/CD Quality Gates &amp; Automation</h3>
                    <div style="background: #020617; border: 1px solid #34d399; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.95rem; color: #34d399; line-height: 1.8;">
                        ${p.cicdPipeline || 'CI/CD pipeline configured.'}
                    </div>
                `;
                break;

            case 'dataFlow':
                const flowRows = (p.dataFlow || []).map(f => `
                    <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(30, 41, 59, 0.8); padding: 14px 20px; border-radius: 10px; margin-bottom: 12px; border: 1px solid rgba(255, 153, 0, 0.2);">
                        <span style="font-weight: 700; color: #fff;">${f.from}</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <svg width="80" height="12"><path d="M0 6 H80" class="animated-particle-path" stroke="#FF9900" stroke-width="2"/></svg>
                            <span style="font-size: 0.75rem; color: #FF9900; font-family: var(--font-mono);">${f.protocol}</span>
                        </div>
                        <span style="font-weight: 700; color: #34d399;">${f.to}</span>
                    </div>
                `).join('');
                viewport.innerHTML = `<h3 style="color: #FF9900; margin-bottom: 16px;">6. Data Lineage Flow (Animated Packets)</h3>${flowRows || '<p style="color:#94a3b8;">Lineage flow configured.</p>'}`;
                break;

            case 'sequenceDiagram':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">7. Request Lifecycle Sequence Diagram</h3>
                    <div style="background: #020617; border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.9rem; color: #f8fafc; white-space: pre-wrap; line-height: 1.7;">${p.sequenceDiagram || ''}</div>
                `;
                break;

            case 'componentDiagram':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">8. System Component Topology</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                        <div style="background: rgba(30,41,59,0.8); padding: 16px; border-radius: 10px; border-top: 3px solid #38bdf8;">
                            <h4 style="color: #38bdf8; margin-bottom: 8px;">Microservices &amp; APIs</h4>
                            <ul style="padding-left: 20px; font-size: 0.85rem; color: #cbd5e1;">${(p.componentDiagram?.services || []).map(s => `<li>${s}</li>`).join('')}</ul>
                        </div>
                        <div style="background: rgba(30,41,59,0.8); padding: 16px; border-radius: 10px; border-top: 3px solid #34d399;">
                            <h4 style="color: #34d399; margin-bottom: 8px;">Databases &amp; Stores</h4>
                            <ul style="padding-left: 20px; font-size: 0.85rem; color: #cbd5e1;">${(p.componentDiagram?.databases || []).map(s => `<li>${s}</li>`).join('')}</ul>
                        </div>
                        <div style="background: rgba(30,41,59,0.8); padding: 16px; border-radius: 10px; border-top: 3px solid #a855f7;">
                            <h4 style="color: #a855f7; margin-bottom: 8px;">External Integrations</h4>
                            <ul style="padding-left: 20px; font-size: 0.85rem; color: #cbd5e1;">${(p.componentDiagram?.externalAPIs || []).map(s => `<li>${s}</li>`).join('')}</ul>
                        </div>
                    </div>
                `;
                break;

            case 'infrastructureDiagram':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">9. Cloud Infrastructure Diagram</h3>
                    <div style="background: #020617; border: 1px solid #FF9900; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.95rem; color: #FF9900;">
                        ${p.infrastructureDiagram || 'Cloud Infrastructure topology.'}
                    </div>
                `;
                break;

            case 'databaseER':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">10. Database ER Schema</h3>
                    <div style="background: #020617; border: 1px solid #38bdf8; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.9rem; color: #38bdf8; white-space: pre-wrap;">${p.databaseER || ''}</div>
                `;
                break;

            case 'apiFlow':
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 16px;">11. API Lifecycle &amp; Routing Flow</h3>
                    <div style="background: #020617; border: 1px solid #34d399; border-radius: 12px; padding: 24px; font-family: var(--font-mono); font-size: 0.95rem; color: #34d399;">${p.apiFlow || ''}</div>
                `;
                break;

            case 'codeExplorer':
                const langs = Object.keys(p.codeExplorer || {});
                const firstLang = langs[0] || 'Python';
                window.renderCodeSnippet = function (langKey) {
                    document.querySelectorAll('.code-lang-tab').forEach(b => b.classList.toggle('active', b.innerText === langKey));
                    const snippetEl = document.getElementById('code-snippet-box');
                    if (snippetEl) {
                        snippetEl.innerText = p.codeExplorer[langKey] || '// Code snippet not available';
                    }
                };
                viewport.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                        <h3 style="color: #FF9900; margin: 0;">12. Multi-Language Code Explorer</h3>
                        <div style="display: flex; gap: 6px;">
                            ${langs.map(l => `<button class="code-lang-tab ${l === firstLang ? 'active' : ''}" onclick="window.renderCodeSnippet('${l}')">${l}</button>`).join('')}
                        </div>
                    </div>
                    <pre style="background: #020617; border: 1px solid rgba(255,153,0,0.3); border-radius: 12px; padding: 20px; color: #f8fafc; font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; line-height: 1.6;" id="code-snippet-box">${p.codeExplorer[firstLang] || ''}</pre>
                `;
                break;

            case 'performanceDashboard':
                const m = p.performanceDashboard || {};
                viewport.innerHTML = `
                    <h3 style="color: #FF9900; margin-bottom: 20px;">13. Live Performance Dashboard</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
                        <div style="background: rgba(30,41,59,0.8); border: 1px solid #FF9900; padding: 18px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.6rem; font-weight: 900; color: #FF9900;">${m.throughput || '120M+ events/day'}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Throughput</div>
                        </div>
                        <div style="background: rgba(30,41,59,0.8); border: 1px solid #38bdf8; padding: 18px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.6rem; font-weight: 900; color: #38bdf8;">${m.latency || '<1.2s SLA'}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Latency</div>
                        </div>
                        <div style="background: rgba(30,41,59,0.8); border: 1px solid #34d399; padding: 18px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.6rem; font-weight: 900; color: #34d399;">${m.costOptimization || '67% Reduced'}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Cost Savings</div>
                        </div>
                        <div style="background: rgba(30,41,59,0.8); border: 1px solid #a855f7; padding: 18px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.6rem; font-weight: 900; color: #a855f7;">${m.availability || '99.99%'}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Availability</div>
                        </div>
                    </div>
                `;
                break;

            case 'evolution':
                const evoHtml = (p.evolution || []).map(e => `
                    <div style="position: relative; padding-left: 24px; margin-bottom: 20px; border-left: 2px solid #FF9900;">
                        <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #FF9900;"></div>
                        <h4 style="color: #FF9900; font-weight: 800; margin-bottom: 4px;">${e.version}</h4>
                        <p style="font-size: 0.9rem; color: #cbd5e1; margin: 0; line-height: 1.5;">${e.notes}</p>
                    </div>
                `).join('');
                viewport.innerHTML = `<h3 style="color: #FF9900; margin-bottom: 20px;">14. Architecture Evolution Timeline</h3>${evoHtml || '<p style="color:#94a3b8;">Evolution timeline configured.</p>'}`;
                break;

            case 'downloads':
                const dlHtml = (p.downloads || []).map(d => {
                    const isExternal = d.url && (d.url.startsWith('http') || d.url.includes('github.com'));
                    const actionAttr = isExternal 
                        ? `href="${d.url}" target="_blank" rel="noopener noreferrer"` 
                        : `href="#contact" onclick="window.closeDedicatedExplorer(); jumpToSection('#contact');"`;
                    const actionText = isExternal ? 'Open GitHub Repository ↗' : 'Request Architecture Dossier →';
                    return `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(30,41,59,0.8); border: 1px solid rgba(255,153,0,0.3); padding: 16px 20px; border-radius: 10px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                            <span style="font-weight: 700; color: #fff;">${d.label}</span>
                            <a ${actionAttr} class="arch-tab-btn" style="text-decoration: none; color: #FF9900;">${actionText}</a>
                        </div>
                    `;
                }).join('');
                viewport.innerHTML = `<h3 style="color: #FF9900; margin-bottom: 20px;">15. Architecture Downloads &amp; Resources</h3>${dlHtml || '<p style="color:#94a3b8;">Architecture resources available on request.</p>'}`;
                break;
        }
    };

    window.zoomArchSvg = function (delta) {
        if (delta === 0) {
            currentZoom = 1.0;
        } else {
            currentZoom = Math.min(Math.max(currentZoom + delta, 0.5), 2.5);
        }
        const target = document.getElementById('svg-inner-target');
        if (target) {
            target.style.transform = `scale(${currentZoom})`;
        }
    };

    // Keyboard support (Escape key to close modal)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('architecture-explorer-modal');
            if (modal && modal.style.display !== 'none') {
                window.closeDedicatedExplorer();
            }
        }
    });

    // Deep-link hash listener for direct URL routes
    window.addEventListener('hashchange', function () {
        const hash = window.location.hash;
        if (hash.startsWith('#architecture/')) {
            const parts = hash.split('/');
            const projectId = parts[1];
            const tabId = parts[2] || 'highLevel';
            if (projectId) {
                window.openDedicatedExplorer(projectId, tabId);
            }
        }
    });

    // Check hash on initial load
    document.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash;
        if (hash.startsWith('#architecture/')) {
            const parts = hash.split('/');
            const projectId = parts[1];
            const tabId = parts[2] || 'highLevel';
            if (projectId) {
                window.openDedicatedExplorer(projectId, tabId);
            }
        }
    });
})();
