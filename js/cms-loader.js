/**
 * js/cms-loader.js - Dynamic Resume CMS & Enterprise Feature Renderer
 * Renders Component 15 (Resume CMS), 17 (Case Studies), 18 (Blog Modal Reader), 19 (Gallery), 20 (Downloads), 21 (Services), 22 (Testimonials), 23 (Badges)
 */
(function () {
    let previousBlogActiveElement = null;
    let blogPostsCache = null;

    const fileMapping = {
        'services': 'services',
        'testimonials': 'testimonials',
        'certifications': 'certifications',
        'blog': 'blog',
        'projects': 'projects',
        'case-studies': 'projects',
        'training': 'training',
        'experience': 'experience',
        'education': 'education'
    };

    async function fetchCMS(section) {
        const mapped = fileMapping[section] || section;
        const endpoints = [
            `/api/cms/${mapped}`,
            `http://127.0.0.1:8000/api/cms/${mapped}`,
            `data/${mapped}.json`,
            `/data/${mapped}.json`,
            `data-static/${mapped}.json`
        ];

        for (const url of endpoints) {
            try {
                const resp = await fetch(url, { cache: 'no-cache' });
                if (resp.ok) {
                    const data = await resp.json();
                    if (data) return data;
                }
            } catch (err) {
                // Try next endpoint
            }
        }
        console.warn(`CMS Loader: all endpoints exhausted for section ${section}`);
        return null;
    }

    // Simple markdown to HTML parser for blog articles
    function formatMarkdownContent(mdText) {
        if (!mdText) return '<p style="color: var(--text-secondary);">Full article content coming soon.</p>';
        
        let html = mdText
            // Escape HTML tags to prevent XSS
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Code blocks
            .replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
                return `<pre style="background: #020617; border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 8px; padding: 16px; margin: 16px 0; overflow-x: auto; font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8; line-height: 1.6;"><code>${code.trim()}</code></pre>`;
            })
            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; font-weight: 800; color: var(--aws-orange, #FF9900); margin: 24px 0 10px 0;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); margin: 28px 0 12px 0;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.65rem; font-weight: 900; color: var(--text-primary); margin: 32px 0 14px 0;">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>')
            // Lists
            .replace(/^\d+\.\s+(.*$)/gim, '<li style="margin-bottom: 6px; margin-left: 20px; line-height: 1.6;">$1</li>')
            .replace(/^-\s+(.*$)/gim, '<li style="margin-bottom: 6px; margin-left: 20px; line-height: 1.6;">$1</li>')
            // Paragraphs
            .replace(/\n\n+/g, '</p><p style="margin-bottom: 16px; line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">');

        return `<p style="margin-bottom: 16px; line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">${html}</p>`;
    }

    // Component 21: Services Renderer
    async function renderServices() {
        const container = document.getElementById('services-grid-container');
        if (!container) return;

        const services = await fetchCMS('services');
        if (!services || !services.length) return;

        container.innerHTML = services.map(s => `
            <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--aws-orange);">
                <div>
                    <div style="font-size: 0.75rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase; margin-bottom: 8px;">
                        ${s.duration}
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">${s.title}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">${s.overview}</p>
                    
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Target Audience: <span style="color: var(--text-primary);">${s.audience}</span></div>
                    
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">Key Outcomes:</div>
                    <ul style="padding-left: 18px; margin-bottom: 20px; font-size: 0.85rem; color: var(--text-secondary);">
                        ${s.outcomes.map(o => `<li style="margin-bottom: 4px;">${o}</li>`).join('')}
                    </ul>
                </div>
                <a href="${s.ctaTarget}" class="btn btn-primary" style="text-align: center; text-decoration: none; font-size: 0.875rem;">${s.ctaText} →</a>
            </div>
        `).join('');
    }

    // Component 22: Testimonials Renderer
    async function renderTestimonials() {
        const container = document.getElementById('testimonials-grid-container');
        if (!container) return;

        const testimonials = await fetchCMS('testimonials');
        if (!testimonials || !testimonials.length) return;

        container.innerHTML = testimonials.map(t => `
            <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                        <span class="status-pill" style="font-size: 0.7rem; text-transform: uppercase;">${t.category}</span>
                        <div style="color: #f59e0b; font-size: 0.9rem;">${'★'.repeat(t.rating)}</div>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; font-style: italic; margin-bottom: 20px;">
                        "${t.text}"
                    </p>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--aws-orange); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #080d16; font-size: 1rem;">
                        ${t.author.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-primary);">${t.author}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${t.designation} &bull; ${t.organization}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Component 23: Badges & Certifications Renderer
    async function renderCertifications() {
        const container = document.getElementById('certifications-badges-container');
        if (!container) return;

        const certData = await fetchCMS('certifications');
        if (!certData) return;

        const certsHtml = (certData.certifications || []).map(c => `
            <div class="card card-hover" style="display: flex; align-items: center; gap: 16px; padding: 18px;">
                <div style="width: 60px; height: 60px; flex-shrink: 0;">
                    ${c.badgeSvg}
                </div>
                <div>
                    <div style="font-size: 0.7rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase;">${c.issuer}</div>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin: 2px 0 4px 0;">${c.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Issued ${c.issueDate} &bull; Verified</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = certsHtml;
    }

    // Component 18: Technical Blog Renderer
    async function renderBlog() {
        const container = document.getElementById('blog-grid-container');
        if (!container) return;

        const posts = await fetchCMS('blog');
        if (!posts || !posts.length) return;
        blogPostsCache = posts;

        container.innerHTML = posts.map(p => `
            <article class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 0.75rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase;">${p.category}</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">${p.readTime}</span>
                    </div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px; line-height: 1.4;">${p.title}</h3>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">${p.summary}</p>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 12px; font-size: 0.8rem; color: var(--text-secondary);">
                    <span>${p.date}</span>
                    <button onclick="window.openBlogModal('${p.id}')" class="btn btn-secondary" style="font-size: 0.8rem; padding: 4px 10px; color: var(--aws-orange); border-color: rgba(255,153,0,0.3); cursor: pointer;">Read Article →</button>
                </div>
            </article>
        `).join('');
    }

    // Component 18.1: Professional Blog Reader Modal
    window.openBlogModal = async function (postId) {
        previousBlogActiveElement = document.activeElement;

        if (!blogPostsCache) {
            blogPostsCache = await fetchCMS('blog');
        }

        const post = (blogPostsCache || []).find(item => item.id === postId || item.slug === postId);
        if (!post) {
            console.warn('Blog post not found:', postId);
            return;
        }

        let modal = document.getElementById('blog-reader-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'blog-reader-modal';
            modal.style.cssText = 'position: fixed; inset: 0; z-index: 10000; background: rgba(2, 6, 23, 0.94); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: var(--font-sans, system-ui, sans-serif);';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', post.title);
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeBlogModal();
                }
            });
            document.body.appendChild(modal);
        }

        document.body.style.overflow = 'hidden';

        const tagsHtml = (post.tags || []).map(t => `<span style="font-size: 0.75rem; background: rgba(255,153,0,0.12); color: var(--aws-orange); border: 1px solid rgba(255,153,0,0.3); padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono);">${t}</span>`).join('');

        modal.innerHTML = `
            <div style="background: #0f172a; border: 1px solid var(--aws-orange, #FF9900); border-radius: 16px; width: 100%; max-width: 860px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.85); color: #f8fafc; position: relative;">
                <!-- Header -->
                <div style="background: rgba(24, 38, 58, 0.95); padding: 20px 24px; border-bottom: 1px solid rgba(255, 153, 0, 0.25); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-shrink: 0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap;">
                            <span class="status-pill" style="font-size: 0.7rem; text-transform: uppercase;">${post.category}</span>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">${post.date}</span>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">&bull;</span>
                            <span style="font-size: 0.8rem; color: var(--aws-orange); font-weight: 700;">${post.readTime}</span>
                        </div>
                        <h2 style="font-size: 1.45rem; font-weight: 900; color: #fff; margin: 0; line-height: 1.35;">${post.title}</h2>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">By <strong style="color: var(--text-primary);">${post.author || 'Gopinath A'}</strong> &bull; Senior Technical Consultant</div>
                    </div>
                    <button id="blog-close-btn" onclick="window.closeBlogModal()" aria-label="Close Article" style="background: none; border: none; color: #94a3b8; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.2s;">✕</button>
                </div>

                <!-- Body / Long-form Scrollable Content -->
                <div style="flex: 1; padding: 28px; overflow-y: auto; background: #0b1329;">
                    <div style="background: rgba(30, 41, 59, 0.5); border-left: 4px solid var(--aws-orange); padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
                        <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase; margin-bottom: 4px;">Executive Summary</h4>
                        <p style="font-size: 0.95rem; color: #cbd5e1; margin: 0; line-height: 1.6;">${post.summary}</p>
                    </div>

                    <div class="blog-article-body">
                        ${formatMarkdownContent(post.content)}
                    </div>

                    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${tagsHtml}
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <a href="#contact" onclick="window.closeBlogModal(); jumpToSection('#contact');" class="btn btn-primary" style="font-size: 0.85rem; padding: 6px 14px; text-decoration: none;">Discuss Architecture →</a>
                            <button onclick="window.closeBlogModal()" class="btn btn-secondary" style="font-size: 0.85rem; padding: 6px 14px;">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        const closeBtn = document.getElementById('blog-close-btn');
        if (closeBtn) closeBtn.focus();

        if (window.trackAnalyticsEvent) {
            window.trackAnalyticsEvent('read_article', post.title);
        }
    };

    window.closeBlogModal = function () {
        const modal = document.getElementById('blog-reader-modal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
        if (previousBlogActiveElement && typeof previousBlogActiveElement.focus === 'function') {
            previousBlogActiveElement.focus();
        }
    };

    // Component 17: Case Study Modal Renderer
    window.openCaseStudyModal = async function (projectId) {
        const projects = await fetchCMS('projects');
        if (!projects) return;

        const p = projects.find(item => item.id === projectId);
        if (!p) return;

        let modal = document.getElementById('case-study-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'case-study-modal';
            modal.style.cssText = 'position: fixed; inset: 0; z-index: 10000; background: rgba(2, 6, 23, 0.94); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: var(--font-sans, system-ui, sans-serif);';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', p.title);
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeCaseStudyModal();
                }
            });
            document.body.appendChild(modal);
        }

        document.body.style.overflow = 'hidden';

        modal.innerHTML = `
            <div style="background: #0f172a; border: 1px solid var(--aws-orange); border-radius: 16px; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 32px; color: var(--text-primary); position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                <button onclick="window.closeCaseStudyModal()" aria-label="Close Case Study" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">✕</button>

                <span style="font-size: 0.8rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase;">Flagship Executive Case Study</span>
                <h2 style="font-size: 1.8rem; font-weight: 900; margin: 6px 0 12px 0;">${p.title}</h2>
                <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 24px; font-weight: 600;">${p.tagline}</p>

                <div style="background: rgba(30, 41, 59, 0.6); padding: 16px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--aws-orange);">
                    <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--aws-orange); margin-bottom: 6px;">Executive Summary</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary);">${p.executiveSummary}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 8px;">Business Problem</h4>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">${p.businessProblem}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 8px;">Architecture Blueprint</h4>
                    <div style="background: #020617; padding: 14px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8; border: 1px solid rgba(255,153,0,0.2);">
                        ${p.architectureDiagram}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 8px;">Quantifiable Business Impact</h4>
                    <div style="background: rgba(52, 211, 153, 0.1); border: 1px solid #34d399; padding: 14px; border-radius: 8px; color: #34d399; font-weight: 700; font-size: 0.95rem;">
                        ✓ ${p.businessImpact}
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
                    <a href="${p.repository}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration: none;">View Repository ↗</a>
                    <button onclick="window.closeCaseStudyModal()" class="btn btn-secondary">Close Case Study</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        if (window.trackAnalyticsEvent) {
            window.trackAnalyticsEvent('project_view', p.title);
        }
    };

    window.closeCaseStudyModal = function () {
        const modal = document.getElementById('case-study-modal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    // Keyboard support (Escape key to close modals)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const blogModal = document.getElementById('blog-reader-modal');
            if (blogModal && blogModal.style.display !== 'none') {
                window.closeBlogModal();
            }
            const caseModal = document.getElementById('case-study-modal');
            if (caseModal && caseModal.style.display !== 'none') {
                window.closeCaseStudyModal();
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        renderServices();
        renderTestimonials();
        renderCertifications();
        renderBlog();
    });
})();
