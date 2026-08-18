/**
 * js/ai-assistant.js - Floating AI Assistant Widget (Component 16)
 * Full client-side & backend dual-engine support for GitHub Pages static hosting.
 */
(function () {
    const predefinedIntents = [
        {
            keywords: ["who is", "tell me about", "about gopinath", "gopinath", "bio", "experience", "background", "profile"],
            response: "Gopinath A is a Senior Technical Consultant, Principal Data Engineer, Generative AI Architect, and Creator of AKEF with 10+ years of experience across AWS Cloud, Databricks, PySpark, Snowflake, and enterprise bootcamps. He has trained over 5,000 engineers and architects globally.",
            actions: [{ label: "View Experience", target: "#journey" }, { label: "GitHub Profile", target: "https://github.com/Gnath3144", external: true }]
        },
        {
            keywords: ["akef", "ai knowledge", "rag framework", "knowledge engineering", "compiler"],
            response: "AKEF (AI Knowledge Engineering Framework) is a deterministic multi-pass compiler translating structured domain knowledge into validated ASTs, Reasoning semantic graphs, Scene IR, and production-ready artifacts with sub-second hybrid search accuracy.",
            actions: [{ label: "Explore AKEF Section", target: "#akef" }, { label: "AKEF GitHub Repo", target: "https://github.com/Gnath3144/AKEF", external: true }]
        },
        {
            keywords: ["data engineering", "projects", "show projects", "portfolio", "medallion", "databricks", "snowflake", "spark", "pipeline"],
            response: "Gopinath has architected key enterprise projects including Databricks Medallion Lakehouse (Bronze/Silver/Gold Delta Lake), LangGraph Financial AI Agent, High-throughput AWS Streaming (120M+ events/day), and Snowflake Retail Sales Warehouse.",
            actions: [{ label: "Browse Flagship Projects", target: "#what-i-build" }]
        },
        {
            keywords: ["training", "bootcamp", "courses", "fdp", "faculty", "workshops", "programs", "masterclass"],
            response: "Available corporate training programs include Corporate Databricks & PySpark Masterclasses, Executive GenAI & RAG Workshops, Faculty Development Programs (FDP), and Cybersecurity Awareness Certifications.",
            actions: [{ label: "View Services & Training", target: "#services" }, { label: "Request Training", target: "#contact" }]
        },
        {
            keywords: ["resume", "download resume", "cv", "profile pdf", "dossier"],
            response: "You can download Gopinath's official executive resume and enterprise portfolio directly from the downloads center or request a tailored dossier.",
            actions: [{ label: "Downloads Center", target: "#downloads" }, { label: "Request PDF Dossier", target: "#contact" }]
        },
        {
            keywords: ["certifications", "certified", "credentials", "aws certified", "databricks certified"],
            response: "Gopinath holds key industry credentials including AWS Certified Solutions Architect, Databricks Certified Data Engineer, Snowflake SnowPro Core, and multiple postgraduate credentials in AI/Cloud systems.",
            actions: [{ label: "View Certifications", target: "#certifications" }]
        },
        {
            keywords: ["contact", "hire", "consulting", "email", "reach out", "book", "message"],
            response: "You can contact Gopinath directly using the contact form on this page or email gnath3144@gmail.com for enterprise consulting, corporate masterclasses, or speaking engagements.",
            actions: [{ label: "Go to Contact Form", target: "#contact" }]
        }
    ];

    function getLocalAIResponse(query) {
        const textClean = query.trim().toLowerCase();

        for (const intent of predefinedIntents) {
            for (const kw of intent.keywords) {
                if (textClean.includes(kw)) {
                    return {
                        answer: intent.response,
                        actions: intent.actions
                    };
                }
            }
        }

        return {
            answer: "I am Gopinath's AI Assistant! I can tell you about his enterprise projects, AKEF compiler, Databricks & Cloud architecture, corporate training tracks, or help you connect with him.",
            actions: [
                { label: "About Gopinath", target: "#journey" },
                { label: "AKEF Framework", target: "#akef" },
                { label: "Enterprise Projects", target: "#what-i-build" },
                { label: "Corporate Training", target: "#services" },
                { label: "Contact", target: "#contact" }
            ]
        };
    }

    function injectAIAssistantWidget() {
        if (document.getElementById('ai-assistant-widget')) return;

        const widgetHtml = `
            <div id="ai-assistant-widget" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: var(--font-sans, system-ui, sans-serif);">
                <!-- Floating Toggle Button -->
                <button id="ai-assistant-toggle" style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #FF9900, #E65100); color: #fff; border: none; box-shadow: 0 4px 20px rgba(255, 153, 0, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;" title="Ask Gopinath's AI Assistant">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zM4 11a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z"/><path d="M9 16h6M9 12h.01M15 12h.01"/></svg>
                </button>

                <!-- Floating Chat Box -->
                <div id="ai-assistant-box" style="display: none; position: absolute; bottom: 70px; right: 0; width: 360px; height: 480px; background: #0f172a; border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6); flex-direction: column; overflow: hidden;">
                    <!-- Header -->
                    <div style="background: rgba(24, 38, 58, 0.95); padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: #34d399;"></div>
                            <span style="font-weight: 700; font-size: 0.95rem; color: #f8fafc;">Gopinath's AI Assistant</span>
                        </div>
                        <button id="ai-assistant-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem;">✕</button>
                    </div>

                    <!-- Messages Log -->
                    <div id="ai-assistant-messages" style="flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.875rem;">
                        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 153, 0, 0.2); color: #cbd5e1; padding: 10px 12px; border-radius: 12px; max-width: 90%;">
                            Hello! I am Gopinath's AI Assistant. How can I help you today?
                        </div>
                    </div>

                    <!-- Quick Prompt Chips -->
                    <div id="ai-assistant-chips" style="padding: 8px 12px; background: rgba(15, 23, 42, 0.8); display: flex; gap: 6px; overflow-x: auto; white-space: nowrap; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                        <button class="ai-chip" onclick="window.sendAIPrompt('Tell me about Gopinath.')">About Gopinath</button>
                        <button class="ai-chip" onclick="window.sendAIPrompt('Explain AKEF.')">AKEF</button>
                        <button class="ai-chip" onclick="window.sendAIPrompt('Show Data Engineering projects.')">Projects</button>
                        <button class="ai-chip" onclick="window.sendAIPrompt('What training programs are available?')">Training</button>
                        <button class="ai-chip" onclick="window.sendAIPrompt('Download resume.')">Resume</button>
                    </div>

                    <!-- Input Box -->
                    <div style="padding: 10px; background: rgba(24, 38, 58, 0.95); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 8px;">
                        <input id="ai-assistant-input" type="text" placeholder="Ask a question..." style="flex: 1; background: #020617; border: 1px solid rgba(255, 153, 0, 0.3); color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; outline: none;">
                        <button id="ai-assistant-send" style="background: var(--aws-orange, #FF9900); color: #080d16; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 700; cursor: pointer;">Send</button>
                    </div>
                </div>
            </div>

            <style>
                .ai-chip {
                    background: rgba(30, 41, 59, 0.9);
                    color: #FF9900;
                    border: 1px solid rgba(255, 153, 0, 0.3);
                    border-radius: 12px;
                    padding: 4px 10px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ai-chip:hover {
                    background: #FF9900;
                    color: #0f172a;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHtml);

        const toggleBtn = document.getElementById('ai-assistant-toggle');
        const closeBtn = document.getElementById('ai-assistant-close');
        const box = document.getElementById('ai-assistant-box');
        const sendBtn = document.getElementById('ai-assistant-send');
        const inputField = document.getElementById('ai-assistant-input');

        toggleBtn.addEventListener('click', () => {
            box.style.display = box.style.display === 'none' ? 'flex' : 'none';
        });

        closeBtn.addEventListener('click', () => {
            box.style.display = 'none';
        });

        sendBtn.addEventListener('click', () => {
            const query = inputField.value.trim();
            if (query) {
                window.sendAIPrompt(query);
                inputField.value = '';
            }
        });

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    window.sendAIPrompt = async function (promptText) {
        const msgContainer = document.getElementById('ai-assistant-messages');
        if (!msgContainer) return;

        // User message bubble
        const userBubble = document.createElement('div');
        userBubble.style.cssText = 'background: #1e293b; color: #fff; padding: 10px 12px; border-radius: 12px; align-self: flex-end; max-width: 85%;';
        userBubble.innerText = promptText;
        msgContainer.appendChild(userBubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Typing indicator
        const typingBubble = document.createElement('div');
        typingBubble.style.cssText = 'background: rgba(30, 41, 59, 0.8); color: #94a3b8; padding: 8px 12px; border-radius: 12px; align-self: flex-start; max-width: 85%; font-style: italic;';
        typingBubble.innerText = 'Thinking...';
        msgContainer.appendChild(typingBubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        let responseData = null;

        // Try backend if available
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const resp = await fetch('/api/ai-assistant/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: promptText }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (resp.ok) {
                responseData = await resp.json();
            }
        } catch (e) {
            // Backend offline, fallback to client-side engine
        }

        if (!responseData || !responseData.answer) {
            responseData = getLocalAIResponse(promptText);
        }

        if (msgContainer.contains(typingBubble)) {
            msgContainer.removeChild(typingBubble);
        }

        const aiBubble = document.createElement('div');
        aiBubble.style.cssText = 'background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255, 153, 0, 0.3); color: #f8fafc; padding: 10px 12px; border-radius: 12px; align-self: flex-start; max-width: 90%;';

        let responseHtml = `<div>${responseData.answer || "I am here to assist with Gopinath's portfolio!"}</div>`;

        if (responseData.actions && responseData.actions.length > 0) {
            responseHtml += `<div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">`;
            responseData.actions.forEach(act => {
                if (act.external) {
                    responseHtml += `<a href="${act.target}" target="_blank" rel="noopener" class="ai-chip" style="text-decoration: none;">${act.label} ↗</a>`;
                } else {
                    responseHtml += `<a href="${act.target}" onclick="document.getElementById('ai-assistant-box').style.display='none'" class="ai-chip" style="text-decoration: none;">${act.label}</a>`;
                }
            });
            responseHtml += `</div>`;
        }

        aiBubble.innerHTML = responseHtml;
        msgContainer.appendChild(aiBubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        if (window.trackAnalyticsEvent) {
            window.trackAnalyticsEvent('ai_assistant_query', promptText);
        }
    };

    document.addEventListener('DOMContentLoaded', injectAIAssistantWidget);
})();
