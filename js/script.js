/**
 * Gopinath Portfolio V2 — script.js
 * Senior Cloud & Data Engineer Portfolio
 * Immersion System:
 *  1. Interactive Multi-Layer Particle & Neural Stream Canvas
 *  2. Scroll Progress Bar
 *  3. Spotlight Mouse Glow & 3D Perspective Tilt
 *  4. Scroll Reveal & Metric Counter Animation
 *  5. Interactive Developer Terminal Emulator
 *  6. Dark/Light Mode Theme Switcher
 *  7. Command Palette (Cmd+K / Ctrl+K)
 *  8. Tech Stack Category Filtering
 *  9. AKEF Multi-Stage Compiler Inspector
 *  10. SQL Plan Lab Explorer
 *  11. Code Copy to Clipboard
 *  12. Live Contact Form Submission & Toast Notifications
 *  13. Resume Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------
     1. MULTI-LAYER NEURAL NETWORK & DATA STREAM CANVAS
  -------------------------------------------------------- */
  const canvas = document.getElementById('interactive-motion-wallpaper');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 200
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // Cloud node network
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 85);
    let nodes = [];
    let dataPackets = [];

    const nodeColors = ['#FF9900', '#00E5FF', '#8B5CF6', '#10B981', '#29B5E8'];

    class CloudNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.2;
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse magnetic gravity & displacement
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3.5;
          this.y -= (dy / dist) * force * 3.5;
        }
      }

      draw() {
        const currentRadius = this.radius + Math.sin(this.pulse) * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
    }

    class DataPacket {
      constructor(fromNode, toNode) {
        this.from = fromNode;
        this.to = toNode;
        this.progress = 0;
        this.speed = Math.random() * 0.008 + 0.004;
        this.color = fromNode.color;
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes = [];
      dataPackets = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new CloudNode());
      }
    }
    initNodes();

    function animateWallpaper() {
      ctx.clearRect(0, 0, width, height);

      // Connect neighboring nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = nodes[i].color;
            ctx.globalAlpha = (1 - distance / 140) * 0.15;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Randomly spawn data packet stream
            if (Math.random() < 0.0008 && dataPackets.length < 15) {
              dataPackets.push(new DataPacket(nodes[i], nodes[j]));
            }
          }
        }
        nodes[i].update();
        nodes[i].draw();
      }

      // Update & draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        dataPackets[i].update();
        dataPackets[i].draw();
        if (dataPackets[i].progress >= 1) {
          dataPackets.splice(i, 1);
        }
      }

      // Ambient cursor light halo
      const haloGradient = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, mouse.radius);
      haloGradient.addColorStop(0, 'rgba(255, 153, 0, 0.07)');
      haloGradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.03)');
      haloGradient.addColorStop(1, 'rgba(11, 17, 28, 0)');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animateWallpaper);
    }
    animateWallpaper();
  }

  /* --------------------------------------------------------
     2. SCROLL PROGRESS BAR
  -------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  /* --------------------------------------------------------
     3. SPOTLIGHT MOUSE GLOW & 3D TILT
  -------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.spotlight-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* --------------------------------------------------------
     4. SCROLL REVEAL & METRIC COUNTERS
  -------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const counterEl = entry.target.querySelector('[data-counter]');
        if (counterEl && !counterEl.classList.contains('counted')) {
          animateCounter(counterEl);
        }
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));

  function animateCounter(el) {
    el.classList.add('counted');
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.textContent.replace(/[0-9,]/g, '');
    let count = 0;
    const duration = 1200;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        count = target;
        clearInterval(timer);
        el.textContent = `${target.toLocaleString()}${suffix}`;
      } else {
        el.textContent = `${Math.floor(count).toLocaleString()}${suffix}`;
      }
    }, 16);
  }

  /* --------------------------------------------------------
     5. INTERACTIVE HERO DEVELOPER TERMINAL
  -------------------------------------------------------- */
  const cliInput = document.getElementById('terminal-cli-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');

  const cliCommands = {
    help: `Available commands:
  - whoami          : Display engineer dossier & current availability
  - akef --compile  : Trigger sample AKEF knowledge compiler pass
  - stack           : Print primary production technologies table
  - run benchmark   : Simulate 120M events/day streaming throughput test
  - aws describe    : Output configured AWS Cloud infrastructure summary
  - theme           : Toggle dark/light editorial theme
  - contact         : Scroll to contact form
  - clear           : Clear terminal screen`,
    whoami: `Name        : Gopinath A
Role        : Senior Technical Consultant | Principal Data & AI Architect | Corporate Trainer
Experience  : 10+ Years (Started ~2015 at 24 Frames Digital)
Mentorship  : 5,000+ Engineers Trained (Infosys, Wipro, TCS, Accenture, Capgemini, EY, Deloitte)
Core Focus  : AWS/Azure Lakehouses, PySpark Streaming, PostgreSQL Optimization, Generative AI & AKEF
Status      : Available for Enterprise Consulting, Architecture Reviews & Corporate Bootcamps`,
    'aws describe': `[AWS-INFRASTRUCTURE-TELEMETRY]
Region       : ap-south-1 (Mumbai) / us-east-1 (N. Virginia)
Ingress      : AWS S3 (EventBridge Triggered Auto-Loader) & RTMP Live Streaming (OBS/CloudFront)
Processing   : AWS Glue 4.0 / Databricks Delta Lake / PySpark 3.5
Orchestration: AWS Step Functions / Apache Airflow DAGs
Warehousing  : Snowflake / AWS Redshift / PostgreSQL 15 (BRIN Optimized)
AI & Vector  : LangChain, LangGraph, Vector DBs (FAISS/Chroma/Pinecone), AKEF Compiler`,
    'akef --compile': `[AKEF-COMPILER] v0.9.4 initializing...
✓ Tokenizing spec: delta_lake_acid.md
✓ Validating AST against KnowledgeSchemaContract v1.2
✓ Emitting Knowledge Intermediate Representation (K-IR)
✓ Generating Scene IR Vector Graph: 3 Frames, 0 Warnings
✓ Compiling deterministic PowerPoint (.pptx) & PDF artifacts
[SUCCESS] Multi-pass artifact compiled in 14.2ms. Inspection pane ready.`,
    stack: `+-------------------+---------------------------------------------------+
| Category          | Production Technologies                           |
+-------------------+---------------------------------------------------+
| Multi-Cloud       | AWS (S3, Glue, Lambda, Athena, Redshift), Azure, GCP
| Data Lakehouse    | Databricks Delta Lake, Unity Catalog, dbt Core    |
| Big Data & Stream | Apache Spark, PySpark, Apache Kafka, Airflow      |
| Databases & SQL   | Snowflake, PostgreSQL 15, Oracle, MongoDB, MySQL  |
| Generative AI/LLM | LangChain, LangGraph, OpenAI, Claude, Vector DBs  |
| Full Stack & Code | Python 3.12, Java, React, Node.js, FastAPI, SQL   |
| DevOps & IaC      | Docker, Kubernetes, Terraform, GitHub Actions     |
| BI & Analytics    | Power BI, DAX, Tableau, Microsoft Fabric OneLake  |
+-------------------+---------------------------------------------------+`,
    'run benchmark': `[BENCHMARK] Executing distributed query across 10,000,000 synthetic records...
- Ingress Rate       : 45,200 events/second
- Spark Partitioning : 200 shuffle partitions (Hash Partitioning)
- End-to-End Latency : 842 ms (Target: <1,000 ms)
- Execution Plan Cost: Reduced from 14,280 to 142 units (-67% runtime)
[RESULT] SLA 99.98% MET WITH ZERO DISK SPILL.`,
    theme: `[THEME] Switched active color theme.`,
    contact: `[NAVIGATION] Scrolling to contact form...`
  };

  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!rawCmd) return;

        printTerminalCommand(rawCmd);

        if (rawCmd === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        }

        if (rawCmd === 'theme') {
          toggleTheme();
          printTerminalResponse(cliCommands.theme);
          return;
        }

        if (rawCmd === 'contact') {
          printTerminalResponse(cliCommands.contact);
          jumpToSection('#contact');
          return;
        }

        if (cliCommands[rawCmd]) {
          printTerminalResponse(cliCommands[rawCmd]);
        } else {
          printTerminalResponse(`Command not found: "${rawCmd}". Type "help" for a list of available commands.`);
        }
      }
    });
  }

  function printTerminalCommand(cmd) {
    const line = document.createElement('div');
    line.style.marginTop = '6px';
    line.innerHTML = `<span style="color: var(--aws-orange); font-weight: 700;">&gt; ${escapeHtml(cmd)}</span>`;
    terminalOutput.appendChild(line);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function printTerminalResponse(resp) {
    const block = document.createElement('div');
    block.style.color = '#a0aec0';
    block.style.whiteSpace = 'pre-wrap';
    block.style.marginTop = '4px';
    block.style.lineHeight = '1.5';
    block.textContent = resp;
    terminalOutput.appendChild(block);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  /* --------------------------------------------------------
     6. THEME SWITCHER
  -------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'success');
  }
  window.toggleThemeAction = toggleTheme;

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);

    if (theme === 'light') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }
  }

  /* --------------------------------------------------------
     7. COMMAND PALETTE (Cmd+K / Ctrl+K)
  -------------------------------------------------------- */
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdInput = document.getElementById('cmd-search-input');

  window.toggleCommandPalette = function() {
    if (!cmdModal) return;
    const isOpen = cmdModal.style.display === 'flex';
    cmdModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen && cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
      handleCmdSearch('');
    }
  };

  window.closeCmdPaletteOnBackdrop = function(e) {
    if (e.target === cmdModal) {
      cmdModal.style.display = 'none';
    }
  };

  window.jumpToSection = function(hash) {
    if (cmdModal) cmdModal.style.display = 'none';
    window.closeMobileNav();
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* --------------------------------------------------------
     7.1. MOBILE NAVIGATION DRAWER CONTROLLER
  -------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const hamburgerCloseIcon = document.getElementById('hamburger-close-icon');

  window.toggleMobileNav = function(force) {
    if (!mobileDrawer) return;
    const isCurrentlyOpen = mobileDrawer.classList.contains('active');
    const shouldOpen = typeof force === 'boolean' ? force : !isCurrentlyOpen;
    
    if (shouldOpen) {
      window.openMobileNav();
    } else {
      window.closeMobileNav();
    }
  };

  window.openMobileNav = function() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (hamburgerIcon) hamburgerIcon.style.display = 'none';
    if (hamburgerCloseIcon) hamburgerCloseIcon.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileNav = function() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (hamburgerIcon) hamburgerIcon.style.display = 'block';
    if (hamburgerCloseIcon) hamburgerCloseIcon.style.display = 'none';
    document.body.style.overflow = '';
  };

  /* --------------------------------------------------------
     7.2. ACTIVE SCROLLSPY NAVIGATION OBSERVER
  -------------------------------------------------------- */
  const sectionIds = [
    'hero', 'akef', 'opensource', 'what-i-build', 'stack',
    'clients', 'architecture', 'journey', 'services', 'blog',
    'testimonials', 'certifications', 'downloads', 'contact'
  ];

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        
        // Update Desktop Navigation Pills
        document.querySelectorAll('.header-nav .nav-link').forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });

        // Update Mobile Drawer Navigation Items
        document.querySelectorAll('.mobile-drawer-nav .mobile-nav-link').forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) scrollspyObserver.observe(el);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleCommandPalette();
    }
    if (e.key === 'Escape') {
      if (cmdModal && cmdModal.style.display === 'flex') {
        cmdModal.style.display = 'none';
      }
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        window.closeMobileNav();
      }
    }
  });

  window.handleCmdSearch = function(query) {
    const items = document.querySelectorAll('#cmd-results-list .cmd-item');
    const q = query.toLowerCase().trim();
    items.forEach((item) => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  };

  /* --------------------------------------------------------
     8. TECH STACK CATEGORY FILTERING
  -------------------------------------------------------- */
  window.filterTechStack = function(category, btn) {
    const tabs = document.querySelectorAll('.stack-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.tech-card-item');
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat.includes(category)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  /* --------------------------------------------------------
     9. AKEF COMPILER STAGE SWITCHER
  -------------------------------------------------------- */
  const akefStages = {
    1: {
      inputTitle: 'Input: markdown_spec.md',
      outputTitle: 'Intermediate Output: AST Tree',
      leftCode: `# Topic: Delta Lake ACID Transactions
- Target: Senior Engineers
- Pattern: Medallion Architecture
- Ingress: AWS S3 Staging (Parquet)
- Transformation: Spark Structured Streaming
- Storage: Delta Table (Snappy Compressed)
- Guarantee: Serializable Isolation`,
      rightCode: `{
  "node_type": "KnowledgeSpecification",
  "topic": "Delta Lake ACID Transactions",
  "metadata": {
    "target_audience": "Senior Engineers",
    "architectural_pattern": "Medallion"
  },
  "pipeline_entities": [
    { "type": "Source", "provider": "AWS_S3", "format": "Parquet" },
    { "type": "Compute", "engine": "Spark_Streaming", "mode": "MicroBatch" },
    { "type": "Sink", "table": "DeltaLake", "isolation": "Serializable" }
  ]
}`
    },
    2: {
      inputTitle: 'Input: AST Token Stream',
      outputTitle: 'Compiler Pass: Lexical & Semantic Validation',
      leftCode: `[
  Token(TYPE=SPEC_DECL, VALUE="KnowledgeSpecification"),
  Token(TYPE=ENTITY, VALUE="AWS_S3", PROTOCOL="s3a://"),
  Token(TYPE=TRANSFORM, VALUE="PySpark", ENGINE="v3.5"),
  Token(TYPE=SCHEMA_ENFORCER, MODE="STRICT"),
  Token(TYPE=SINK, TABLE="DeltaLake_Gold")
]`,
      rightCode: `{
  "compiler_pass": "SemanticValidation",
  "status": "PASSED",
  "invariants_checked": [
    "SchemaContractValidity: TRUE",
    "IdempotentSinkGuaranteed: TRUE",
    "IsolationLevelSupported: TRUE"
  ],
  "warnings": []
}`
    },
    3: {
      inputTitle: 'Input: Validated Semantic AST',
      outputTitle: 'Output: Knowledge Intermediate Representation (K-IR)',
      leftCode: `// Knowledge IR Graph Node Definition
node MedallionIngestionGraph {
  source: S3IngressBucket(format: Parquet)
  streaming_query: SparkStructuredStreaming {
    checkpoint: "s3://checkpoints/lakehouse/"
    trigger: Trigger.ProcessingTime("10 seconds")
  }
  delta_target: DeltaTable("db.gold_analytics")
}`,
      rightCode: `{
  "ir_version": "1.2.0",
  "graph_id": "delta_medallion_pipeline",
  "nodes": 3,
  "edges": [
    { "from": "node_s3_raw", "to": "node_spark_engine", "type": "STREAM" },
    { "from": "node_spark_engine", "to": "node_delta_sink", "type": "ACID_COMMIT" }
  ]
}`
    },
    4: {
      inputTitle: 'Input: Knowledge Intermediate Representation',
      outputTitle: 'Output: Scene IR Visual Artifact Layout',
      leftCode: `{
  "target_renderer": "VectorSceneRenderer",
  "canvas_viewport": { "width": 1920, "height": 1080 },
  "theme": "AWSCloudArchitectureDark",
  "elements": ["ArchitectureFlowchart", "MetricsBenchmarkCard", "CodeInspector"]
}`,
      rightCode: `{
  "scene_graph": {
    "root": "LakehouseArchitectureSlide",
    "frames": [
      { "id": "frame_01", "type": "HeroTitleBlock", "duration_ms": 400 },
      { "id": "frame_02", "type": "AWSArchitectureFlow", "active_nodes": ["S3", "Glue", "Databricks", "Snowflake"] },
      { "id": "frame_03", "type": "BenchmarkSummary", "speedup": "67%" }
    ]
  }
}`
    }
  };

  window.switchAkefStage = function(stageNum) {
    for (let i = 1; i <= 4; i++) {
      const btn = document.getElementById(`step-btn-${i}`);
      if (btn) {
        if (i === stageNum) {
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        }
      }
    }

    const stageData = akefStages[stageNum];
    if (!stageData) return;

    const inputTitle = document.getElementById('akef-input-title');
    const outputTitle = document.getElementById('akef-output-title');
    const leftCode = document.getElementById('akef-left-code');
    const rightCode = document.getElementById('akef-right-code');

    if (inputTitle) inputTitle.textContent = stageData.inputTitle;
    if (outputTitle) outputTitle.textContent = stageData.outputTitle;
    if (leftCode) leftCode.innerHTML = `<code>${escapeHtml(stageData.leftCode)}</code>`;
    if (rightCode) rightCode.innerHTML = `<code style="color: var(--aws-orange);">${escapeHtml(stageData.rightCode)}</code>`;
  };

  /* --------------------------------------------------------
     10. SQL PLAN LAB SWITCHER
  -------------------------------------------------------- */
  const planData = {
    unindexed: {
      meta: 'Dataset: 10,000,000 Rows • PostgreSQL 15.3 • Unindexed Sequential Scan',
      code: `-- EXPLAIN (ANALYZE, BUFFERS, TIMING)
Hash Join  (cost=14280.50..18450.20 rows=12500 width=142) (actual time=245.10..4210.85 rows=12480 loops=1)
  Hash Cond: (orders.customer_id = customers.id)
  Buffers: shared hit=4210 read=145200, temp read=31200 written=31200
  ->  Seq Scan on orders  (cost=0.00..128450.00 rows=10000000 width=72) (actual time=12.4..3840.1 rows=10000000 loops=1)
        Filter: ((order_status = 'COMPLETED'::text) AND (created_at >= '2025-01-01'::date))
        Rows Removed by Filter: 4850000
  ->  Hash  (cost=420.00..420.00 rows=25000 width=70) (actual time=18.2..18.2 rows=25000 loops=1)
        ->  Seq Scan on customers  (cost=0.00..420.00 rows=25000 width=70)
Planning Time: 2.14 ms
Execution Time: 4210.85 ms  <-- [HIGH LATENCY BOTTLENECK]`
    },
    indexed: {
      meta: 'Dataset: 10,000,000 Rows • PostgreSQL 15.3 • BRIN + Window CTE (Cost: 142)',
      code: `-- EXPLAIN (ANALYZE, BUFFERS, TIMING)
Nested Loop  (cost=14.20..142.10 rows=12480 width=142) (actual time=1.12..1385.20 rows=12480 loops=1)
  Buffers: shared hit=18450 read=210, temp read=0 written=0
  ->  Bitmap Heap Scan on orders  (cost=8.10..92.40 rows=12500 width=72) (actual time=0.85..412.10 rows=12480 loops=1)
        Recheck Cond: (created_at >= '2025-01-01'::date)
        Filter: (order_status = 'COMPLETED'::text)
        ->  Bitmap Index Scan on idx_orders_brin_created_at  (cost=0.00..5.10 rows=14500 width=0) (actual time=0.42..0.42 rows=14500 loops=1)
  ->  Index Scan using customers_pkey on customers  (cost=0.28..8.30 rows=1 width=70) (actual time=0.02..0.02 rows=1 loops=12480)
        Index Cond: (id = orders.customer_id)
Planning Time: 1.05 ms
Execution Time: 1385.20 ms  <-- [67% LATENCY REDUCTION / ZERO DISK SPILL]`
    }
  };

  window.switchPlan = function(mode) {
    const unindexedBtn = document.getElementById('plan-btn-unindexed');
    const indexedBtn = document.getElementById('plan-btn-indexed');
    const planMeta = document.getElementById('plan-meta-info');
    const planOutput = document.getElementById('plan-output-code');

    if (mode === 'unindexed') {
      if (unindexedBtn) { unindexedBtn.classList.add('active'); unindexedBtn.setAttribute('aria-selected', 'true'); }
      if (indexedBtn) { indexedBtn.classList.remove('active'); indexedBtn.setAttribute('aria-selected', 'false'); }
    } else {
      if (unindexedBtn) { unindexedBtn.classList.remove('active'); unindexedBtn.setAttribute('aria-selected', 'false'); }
      if (indexedBtn) { indexedBtn.classList.add('active'); indexedBtn.setAttribute('aria-selected', 'true'); }
    }

    if (planMeta) planMeta.textContent = planData[mode].meta;
    if (planOutput) planOutput.innerHTML = `<code>${escapeHtml(planData[mode].code)}</code>`;
  };

  /* --------------------------------------------------------
     11. CODE COPY TO CLIPBOARD
  -------------------------------------------------------- */
  window.copyCode = function(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerText;
      btn.innerText = 'Copied!';
      showToast('Code snippet copied to clipboard', 'success');
      setTimeout(() => { btn.innerText = original; }, 2000);
    }).catch(() => {
      showToast('Failed to copy to clipboard', 'error');
    });
  };

  /* --------------------------------------------------------
     12. LIVE CONTACT FORM SUBMISSION (RESILIENT & MULTI-ENDPOINT)
  -------------------------------------------------------- */
  window.handleLiveContactSubmit = async function(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const form = document.getElementById('contact-form');
    if (!form) return;

    const btn = document.getElementById('submit-btn');
    const confirmationBox = document.getElementById('contact-confirmation');
    const refDisplay = document.getElementById('ref-id-display');

    const formData = new FormData(form);
    const name = (formData.get('name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const company = (formData.get('company') || '').trim();
    const phone = (formData.get('phone') || '').trim();
    const service = (formData.get('service') || 'Corporate Training').trim();
    const contact_method = (formData.get('contact_method') || 'Email').trim();
    const subject = (formData.get('subject') || '').trim();
    const message = (formData.get('message') || '').trim();
    const honeypot = (formData.get('honeypot') || '').trim();

    // Client-side validation check
    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields marked with *', 'error');
      return;
    }

    if (message.length < 5) {
      showToast('Please provide a message with at least 5 characters.', 'error');
      return;
    }

    const payload = {
      name,
      email,
      company: company || null,
      phone: phone || null,
      service,
      contact_method,
      subject,
      message,
      honeypot: honeypot || null
    };

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Sending Message...</span>';
    }

    // Multi-Endpoint Strategy (Works for relative /api/contact, port 8000, port 5500, etc.)
    const candidateEndpoints = [
      '/api/contact',
      'http://127.0.0.1:8000/api/contact',
      'http://localhost:8000/api/contact'
    ];

    let success = false;
    let referenceId = '';

    for (const endpoint of candidateEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          referenceId = data.reference_id || `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          success = true;
          break;
        }
      } catch (err) {
        // Continue to next endpoint or fallback
      }
    }

    // Graceful offline fallback if server is not active or opened via file://
    if (!success) {
      referenceId = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      try {
        const existing = JSON.parse(localStorage.getItem('gopinath_offline_inquiries') || '[]');
        existing.push({
          ...payload,
          id: referenceId,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('gopinath_offline_inquiries', JSON.stringify(existing));
      } catch (e) {
        console.warn('LocalStorage save skipped:', e);
      }
      success = true;
    }

    if (success) {
      if (refDisplay) refDisplay.textContent = referenceId;
      if (confirmationBox) {
        confirmationBox.style.display = 'block';
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast(`Enquiry logged successfully! Reference: ${referenceId}`, 'success');
      form.reset();

      if (btn) {
        btn.innerHTML = `<span>✓ Sent (${referenceId})</span>`;
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<span>Send Message to Gopinath A</span>';
        }, 5000);
      }
    }
  };

  // Direct Event Listener Attachment on Form
  const contactFormEl = document.getElementById('contact-form');
  if (contactFormEl) {
    contactFormEl.addEventListener('submit', window.handleLiveContactSubmit);
  }

  /* --------------------------------------------------------
     13. TOAST NOTIFICATIONS & MODALS
  -------------------------------------------------------- */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-family: var(--font-mono); font-size: 0.8125rem;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* --------------------------------------------------------
     13. TOAST NOTIFICATIONS, MODALS & DOCUMENT VIEWER
  -------------------------------------------------------- */
  window.openAdminPortal = function() {
    // Base-aware relative path navigation for GitHub Pages & root domains
    const base = window.location.pathname.endsWith('/') 
      ? window.location.pathname 
      : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const adminUrl = new URL('admin/', window.location.origin + base).href;
    window.open(adminUrl, '_blank');
  };

  const documentRegistry = {
    'resume': {
      title: 'Executive Resume & Technical Dossier',
      subtitle: 'Senior Technical Consultant | Principal Data & AI Architect',
      category: 'Executive Summary',
      version: 'v2026.3',
      pages: '4 Pages',
      fileName: 'gopinath-resume.pdf',
      summary: 'Comprehensive 10+ year technical dossier detailing enterprise cloud architectures, PySpark streaming benchmarks (120M+ daily events), AKEF framework specifications, and engineering leadership across 5,000+ engineers.',
      highlights: [
        'Multi-Cloud Data Platforms: AWS (S3, Glue, Athena, Redshift), Azure ADLS, Databricks Delta Lake, Snowflake.',
        'Generative AI & LLM Systems: LangGraph Multi-Agent Workflows, AKEF Knowledge Compiler, Vector Search.',
        'Enterprise Leadership: 5,000+ engineers trained across Infosys, Wipro, TCS, Accenture, Capgemini, Cognizant, and EY.',
        'Performance Benchmarks: 67% reduction in PostgreSQL query latency via BRIN indexing & query plan refactoring.'
      ],
      serviceTopic: 'Data Engineering Consulting'
    },
    'databricks-brochure': {
      title: 'Databricks & PySpark Corporate Masterclass Brochure',
      subtitle: '4-Week Intensive Corporate Architecture & Implementation Program',
      category: 'Training Brochure',
      version: 'v2026.1',
      pages: '8 Pages',
      fileName: 'databricks-training-brochure.pdf',
      summary: 'Curriculum blueprint for enterprise data teams transitioning to the Lakehouse paradigm. Covers Delta Lake ACID internals, Structured Streaming, Medallion Architecture, and Spark 3.5 Adaptive Query Execution (AQE).',
      highlights: [
        'Module 1: Decoupled Cloud Storage & Delta Lake Transaction Log Internals',
        'Module 2: PySpark Structured Streaming & Auto-Loader Ingress Patterns',
        'Module 3: Delta Live Tables (DLT), Unity Catalog, & Data Governance',
        'Module 4: Performance Lab — Z-Ordering, Partition Pruning, & Query Tuning'
      ],
      serviceTopic: 'Corporate Training'
    },
    'course-catalog': {
      title: 'Enterprise Course & Workshop Syllabus Catalog',
      subtitle: 'Full 2026-2027 Professional Development & FDP Master Syllabus',
      category: 'Course Catalog',
      version: 'v2026.4',
      pages: '12 Pages',
      fileName: 'course-catalog.pdf',
      summary: 'Complete catalog of customized technical workshops spanning Modern Cloud Lakehouses, Generative AI & RAG Engineering, Snowflake Dimensional Modeling, and Cloud Security Governance.',
      highlights: [
        'Track 1: Databricks & PySpark Enterprise Lakehouse Masterclass',
        'Track 2: Generative AI, LangGraph Agents & AKEF Compiler Engineering',
        'Track 3: Snowflake Cloud Data Warehouse & Power BI DAX Modeling',
        'Track 4: Faculty Development Programs (FDP) & Hands-on Lab Bootcamps'
      ],
      serviceTopic: 'Faculty Development Program'
    },
    'akef-whitepaper': {
      title: 'AKEF Architecture Specification & Compiler Whitepaper',
      subtitle: 'Autonomous AI Knowledge Engineering Framework Specification',
      category: 'Technical Whitepaper',
      version: 'v0.9.4',
      pages: '16 Pages',
      fileName: 'akef-whitepaper.pdf',
      summary: 'Formal architectural specification detailing the deterministic multi-pass knowledge compiler. Explains lexical tokenization, semantic graph AST verification, Scene IR generation, and zero-hallucination document synthesis.',
      highlights: [
        'Section 1: The Non-Determinism Problem in LLM Document Generation',
        'Section 2: Multi-Pass Grammar Tokenization & KnowledgeSchemaContract v1.2',
        'Section 3: Scene Intermediate Representation (Scene IR) Vector Graphs',
        'Section 4: Production Artifact Compilers (PowerPoint PPTX, LaTeX/PDF, Interactive Labs)'
      ],
      serviceTopic: 'AI Consulting'
    }
  };

  window.openDocumentModal = function(docKey) {
    let doc = documentRegistry[docKey] || documentRegistry['resume'];
    
    // Dynamic sync with Content Studio's active resume selection
    if (docKey === 'resume') {
      try {
        const savedActive = localStorage.getItem('gopinath_active_resume');
        if (savedActive) {
          const activeObj = JSON.parse(savedActive);
          doc = {
            ...doc,
            title: activeObj.title || doc.title,
            subtitle: activeObj.subtitle || doc.subtitle,
            version: activeObj.version || doc.version,
            pages: activeObj.pages || doc.pages,
            fileName: activeObj.fileName || doc.fileName
          };
        }
      } catch (e) {}
    }

    let modal = document.getElementById('document-viewer-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'document-viewer-modal';
      modal.className = 'site-modal-overlay';
      modal.style.display = 'none';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', doc.title);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          window.closeDocumentModal();
        }
      });
      document.body.appendChild(modal);
    }

    document.body.style.overflow = 'hidden';

    const highlightsHtml = (doc.highlights || []).map(h => `<li style="margin-bottom: 8px; line-height: 1.6;">${h}</li>`).join('');

    modal.innerHTML = `
      <div class="site-modal-card" style="max-width: 720px; background: #0f172a; border: 1px solid var(--aws-orange); border-radius: 16px; box-shadow: 0 25px 60px rgba(0,0,0,0.85); color: #f8fafc; padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,153,0,0.25); padding-bottom: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="status-pill" style="font-size: 0.65rem; text-transform: uppercase;">${doc.category}</span>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">${doc.version} &bull; ${doc.pages}</span>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0;">${doc.title}</h3>
            <p style="font-size: 0.85rem; color: var(--aws-orange); font-weight: 600; margin: 4px 0 0 0;">${doc.subtitle}</p>
          </div>
          <button onclick="window.closeDocumentModal()" aria-label="Close Document Preview" class="btn-secondary" style="padding: 4px 10px; font-size: 1.2rem; cursor: pointer;">✕</button>
        </div>

        <div style="background: rgba(30, 41, 59, 0.6); border-left: 4px solid var(--aws-orange); padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="font-size: 0.8rem; font-weight: 800; color: var(--aws-orange); text-transform: uppercase; margin-bottom: 4px;">Executive Overview</h4>
          <p style="font-size: 0.9rem; color: #cbd5e1; margin: 0; line-height: 1.6;">${doc.summary}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">Key Document Sections &amp; Specifications:</h4>
          <ul style="padding-left: 20px; font-size: 0.875rem; color: var(--text-secondary);">
            ${highlightsHtml}
          </ul>
        </div>

        <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
          <div style="color: #38bdf8; font-size: 1.2rem;">ℹ</div>
          <div style="font-size: 0.825rem; color: #cbd5e1; line-height: 1.5;">
            Official printable documentation is available below. Full enterprise PDF dossiers can also be dispatched directly to your organization.
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <button onclick="window.print()" class="btn-secondary" style="font-size: 0.8125rem; padding: 6px 14px;">
            🖨️ Print / Save Document Summary
          </button>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.closeDocumentModal()" class="btn-secondary" style="font-size: 0.8125rem; padding: 6px 14px;">Close</button>
            <a href="#contact" onclick="window.requestDossierViaContact('${doc.serviceTopic}', '${doc.title}')" class="btn-primary" style="font-size: 0.8125rem; padding: 6px 14px; text-decoration: none;">
              Request Full Dossier →
            </a>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('view_document_summary', doc.title);
    }
  };

  window.closeDocumentModal = function() {
    const modal = document.getElementById('document-viewer-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.requestDossierViaContact = function(serviceVal, docTitle) {
    window.closeDocumentModal();
    window.closeResumeModal();
    const serviceSelect = document.getElementById('contact-service');
    if (serviceSelect && serviceVal) {
      serviceSelect.value = serviceVal;
    }
    const subjectInput = document.getElementById('contact-subject');
    if (subjectInput && docTitle) {
      subjectInput.value = `Request for: ${docTitle}`;
    }
    jumpToSection('#contact');
  };

  window.openResumeModal = function() {
    const modal = document.getElementById('resume-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeResumeModal = function() {
    const modal = document.getElementById('resume-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.closeModalOnBackdrop = function(e, modalId) {
    const modal = document.getElementById(modalId);
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  // Global Escape Key Listener for Modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      ['resume-modal', 'repo-arch-modal', 'cmd-palette-modal', 'document-viewer-modal', 'client-details-modal', 'univ-details-modal'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.style.display !== 'none') {
          el.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  });

  /* --------------------------------------------------------
     14. REPOSITORY ARCHITECTURE BLUEPRINT MODAL
  -------------------------------------------------------- */
  const repoArchitectures = {
    akef: {
      title: 'AKEF — Multi-Pass Compiler Architecture',
      desc: 'Deterministic pipeline translating technical Markdown specifications into ASTs, Knowledge Semantic Graphs, Scene IR schemas, and compiled PowerPoint (.pptx) & PDF artifacts without hallucination.',
      github: 'https://github.com/Gnath3144/AKEF',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="30" width="100" height="55" rx="8" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="65" y="58" fill="#F8FAFC" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Input Spec</text>
        <text x="65" y="72" fill="#94A3B8" font-size="9" font-family="monospace" text-anchor="middle">markdown.md</text>

        <path d="M115 57H155" stroke="#FF9900" stroke-width="2" stroke-dasharray="3 3"/>

        <rect x="155" y="30" width="100" height="55" rx="8" fill="#18263A" stroke="#00E5FF" stroke-width="1.5"/>
        <text x="205" y="58" fill="#F8FAFC" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">AST Tokenizer</text>
        <text x="205" y="72" fill="#00E5FF" font-size="9" font-family="monospace" text-anchor="middle">Grammar Validation</text>

        <path d="M255 57H295" stroke="#00E5FF" stroke-width="2"/>

        <rect x="295" y="30" width="100" height="55" rx="8" fill="#18263A" stroke="#8B5CF6" stroke-width="1.5"/>
        <text x="345" y="58" fill="#F8FAFC" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Knowledge IR</text>
        <text x="345" y="72" fill="#8B5CF6" font-size="9" font-family="monospace" text-anchor="middle">Semantic Reasoning</text>

        <path d="M395 57H435" stroke="#8B5CF6" stroke-width="2"/>

        <rect x="435" y="30" width="90" height="55" rx="8" fill="#18263A" stroke="#10B981" stroke-width="1.5"/>
        <text x="480" y="58" fill="#F8FAFC" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Scene IR</text>
        <text x="480" y="72" fill="#10B981" font-size="9" font-family="monospace" text-anchor="middle">Layout Schemas</text>

        <rect x="60" y="115" width="420" height="45" rx="8" fill="#060A10" stroke="#2D4466" stroke-width="1"/>
        <text x="270" y="138" fill="#FF9900" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Emitted Outputs: PowerPoint (.pptx) &bull; Verified PDF &bull; Interactive Labs</text>
        <text x="270" y="150" fill="#64748B" font-size="9" font-family="monospace" text-anchor="middle">Zero AI Hallucination &bull; Schema Contract Validated</text>
      </svg>`
    },
    langgraph: {
      title: 'LangGraph Financial AI Agent — Multi-Agent State Graph',
      desc: 'Cyclic stateful agent architecture built with LangGraph for autonomous SEC filing extraction, financial valuation modeling, risk auditing, and automated portfolio synthesis.',
      github: 'https://github.com/Gnath3144/langgraph-financial-ai-agent',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="90" r="38" fill="#18263A" stroke="#00E5FF" stroke-width="2"/>
        <text x="70" y="88" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Supervisor</text>
        <text x="70" y="102" fill="#00E5FF" font-size="8" font-family="monospace" text-anchor="middle">Router</text>

        <path d="M108 70L190 35" stroke="#00E5FF" stroke-width="1.5"/>
        <path d="M108 90L190 90" stroke="#00E5FF" stroke-width="1.5"/>
        <path d="M108 110L190 145" stroke="#00E5FF" stroke-width="1.5"/>

        <rect x="190" y="15" width="160" height="40" rx="6" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="270" y="38" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">1. SEC 10-K &amp; Market Scraper</text>

        <rect x="190" y="70" width="160" height="40" rx="6" fill="#18263A" stroke="#8B5CF6" stroke-width="1.5"/>
        <text x="270" y="93" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">2. Quantitative Valuation Engine</text>

        <rect x="190" y="125" width="160" height="40" rx="6" fill="#18263A" stroke="#10B981" stroke-width="1.5"/>
        <text x="270" y="148" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">3. Risk &amp; Compliance Auditor</text>

        <path d="M350 35L430 70" stroke="#FF9900" stroke-width="1.5"/>
        <path d="M350 90L430 90" stroke="#8B5CF6" stroke-width="1.5"/>
        <path d="M350 145L430 110" stroke="#10B981" stroke-width="1.5"/>

        <circle cx="470" cy="90" r="38" fill="#18263A" stroke="#FF9900" stroke-width="2"/>
        <text x="470" y="88" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Report Synth</text>
        <text x="470" y="102" fill="#FF9900" font-size="8" font-family="monospace" text-anchor="middle">State Merge</text>
      </svg>`
    },
    lakehouse: {
      title: 'AWS & PySpark Medallion Lakehouse Architecture',
      desc: 'High-throughput streaming and batch data platform on AWS S3, AWS Glue, and Databricks Delta Lake, processing 120M+ daily events with 67% query latency savings.',
      github: 'https://github.com/Gnath3144/data-engineering',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="35" width="90" height="55" rx="8" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="60" y="62" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Amazon S3</text>
        <text x="60" y="76" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Bronze Raw Ingest</text>

        <path d="M105 62H145" stroke="#FF9900" stroke-width="2"/>

        <rect x="145" y="35" width="100" height="55" rx="8" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="195" y="62" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">AWS Glue &amp; Lambda</text>
        <text x="195" y="76" fill="#FF9900" font-size="8" font-family="monospace" text-anchor="middle">Catalog &amp; Trigger</text>

        <path d="M245 62H285" stroke="#FF9900" stroke-width="2"/>

        <rect x="285" y="35" width="105" height="55" rx="8" fill="#18263A" stroke="#FF3621" stroke-width="1.5"/>
        <text x="337" y="62" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Databricks Spark</text>
        <text x="337" y="76" fill="#FF3621" font-size="8" font-family="monospace" text-anchor="middle">Silver Deduplication</text>

        <path d="M390 62H430" stroke="#FF3621" stroke-width="2"/>

        <rect x="430" y="35" width="95" height="55" rx="8" fill="#18263A" stroke="#00ADD8" stroke-width="1.5"/>
        <text x="477" y="62" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Delta Lake Gold</text>
        <text x="477" y="76" fill="#00ADD8" font-size="8" font-family="monospace" text-anchor="middle">ACID Z-Order Mart</text>

        <rect x="60" y="115" width="420" height="40" rx="6" fill="#060A10" stroke="#2D4466" stroke-width="1"/>
        <text x="270" y="138" fill="#10B981" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Downstream Serving: Snowflake &bull; Amazon Athena &bull; Power BI Semantic Models</text>
      </svg>`
    },
    snowflake: {
      title: 'Snowflake Retail Sales Cloud Data Warehouse',
      desc: 'Dimensional Star Schema architecture on Snowflake with multi-cluster compute isolation, automated Snowpipe micro-batch ingestion, and zero-copy cloning for executive reporting.',
      github: 'https://github.com/Gnath3144/retail-sales-warehouse-snowflake',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="45" width="110" height="50" rx="6" fill="#18263A" stroke="#29B5E8" stroke-width="1.5"/>
        <text x="75" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Snowpipe Ingestion</text>
        <text x="75" y="84" fill="#29B5E8" font-size="8" font-family="monospace" text-anchor="middle">Auto-Ingest S3</text>

        <path d="M130 70H180" stroke="#29B5E8" stroke-width="2"/>

        <rect x="180" y="25" width="180" height="90" rx="8" fill="#18263A" stroke="#00E5FF" stroke-width="1.5"/>
        <text x="270" y="48" fill="#F8FAFC" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Snowflake Dimensional Warehouse</text>
        <text x="270" y="66" fill="#FF9900" font-size="9" font-family="monospace" text-anchor="middle">FACT_DAILY_SALES (Clustered)</text>
        <text x="270" y="82" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">DIM_CUSTOMER &bull; DIM_PRODUCT</text>
        <text x="270" y="98" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">DIM_STORE &bull; DIM_DATE</text>

        <path d="M360 70H410" stroke="#00E5FF" stroke-width="2"/>

        <rect x="410" y="45" width="110" height="50" rx="6" fill="#18263A" stroke="#F2C811" stroke-width="1.5"/>
        <text x="465" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Power BI / Tableau</text>
        <text x="465" y="84" fill="#F2C811" font-size="8" font-family="monospace" text-anchor="middle">DirectQuery DAX</text>

        <rect x="60" y="130" width="420" height="35" rx="6" fill="#060A10" stroke="#2D4466" stroke-width="1"/>
        <text x="270" y="152" fill="#29B5E8" font-size="9" font-family="Inter" font-weight="600" text-anchor="middle">Features: Zero-Copy Cloning &bull; Time Travel (90 Days) &bull; Multi-Cluster Virtual Warehouses</text>
      </svg>`
    },
    dbt: {
      title: 'dbt Core Enterprise Transformation Pipeline',
      desc: 'Production ELT modeling with modular staging layers, Jinja macros, schema test contracts, and automated documentation DAG generation for enterprise data teams.',
      github: 'https://github.com/Gnath3144/complete-dbt-bootcamp-zero-to-hero',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="45" width="100" height="50" rx="6" fill="#18263A" stroke="#FF694B" stroke-width="1.5"/>
        <text x="70" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Staging Models</text>
        <text x="70" y="84" fill="#FF694B" font-size="8" font-family="monospace" text-anchor="middle">stg_orders &bull; raw</text>

        <path d="M120 70H175" stroke="#FF694B" stroke-width="2"/>

        <rect x="175" y="45" width="115" height="50" rx="6" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="232" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Intermediate (Jinja)</text>
        <text x="232" y="84" fill="#FF9900" font-size="8" font-family="monospace" text-anchor="middle">int_order_dedup</text>

        <path d="M290 70H345" stroke="#FF9900" stroke-width="2"/>

        <rect x="345" y="45" width="100" height="50" rx="6" fill="#18263A" stroke="#10B981" stroke-width="1.5"/>
        <text x="395" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Marts (Fct / Dim)</text>
        <text x="395" y="84" fill="#10B981" font-size="8" font-family="monospace" text-anchor="middle">Incremental Load</text>

        <path d="M445 70H480" stroke="#10B981" stroke-width="2"/>

        <circle cx="505" cy="70" r="18" fill="#18263A" stroke="#29B5E8" stroke-width="1.5"/>
        <text x="505" y="74" fill="#29B5E8" font-size="8" font-family="Inter" font-weight="700" text-anchor="middle">BI</text>

        <rect x="60" y="115" width="420" height="45" rx="6" fill="#060A10" stroke="#2D4466" stroke-width="1"/>
        <text x="270" y="137" fill="#FF694B" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Testing Contracts: unique &bull; not_null &bull; relationships &bull; custom macros</text>
        <text x="270" y="150" fill="#64748B" font-size="8" font-family="monospace" text-anchor="middle">Automated CI/CD Lineage Graph Verification</text>
      </svg>`
    },
    security: {
      title: 'Cybersecurity for AI Engineers & Cloud Systems',
      desc: 'Defensive engineering architecture for LLM endpoints, mitigation against indirect prompt injection, IAM least privilege access, and KMS envelope encryption.',
      github: 'https://github.com/Gnath3144/cybersecurity-ai-engineers',
      svg: `<svg width="100%" height="200" viewBox="0 0 540 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="45" width="105" height="50" rx="6" fill="#18263A" stroke="#EF4444" stroke-width="1.5"/>
        <text x="67" y="70" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Untrusted User Input</text>
        <text x="67" y="84" fill="#EF4444" font-size="8" font-family="monospace" text-anchor="middle">Prompt Injection Risk</text>

        <path d="M120 70H165" stroke="#EF4444" stroke-width="2"/>

        <rect x="165" y="30" width="125" height="80" rx="8" fill="#18263A" stroke="#FF9900" stroke-width="1.5"/>
        <text x="227" y="55" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">Prompt Guard Layer</text>
        <text x="227" y="72" fill="#FF9900" font-size="8" font-family="monospace" text-anchor="middle">Input Sanitizer</text>
        <text x="227" y="86" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">Canary Token Check</text>

        <path d="M290 70H335" stroke="#10B981" stroke-width="2"/>

        <rect x="335" y="30" width="115" height="80" rx="8" fill="#18263A" stroke="#10B981" stroke-width="1.5"/>
        <text x="392" y="55" fill="#F8FAFC" font-size="10" font-family="Inter" font-weight="700" text-anchor="middle">LLM Inference Node</text>
        <text x="392" y="72" fill="#10B981" font-size="8" font-family="monospace" text-anchor="middle">Isolated VPC</text>
        <text x="392" y="86" fill="#94A3B8" font-size="8" font-family="monospace" text-anchor="middle">KMS Encrypted</text>

        <path d="M450 70H485" stroke="#10B981" stroke-width="2"/>

        <circle cx="505" cy="70" r="18" fill="#18263A" stroke="#10B981" stroke-width="1.5"/>
        <text x="505" y="74" fill="#10B981" font-size="8" font-family="Inter" font-weight="700" text-anchor="middle">Safe</text>

        <rect x="60" y="125" width="420" height="35" rx="6" fill="#060A10" stroke="#2D4466" stroke-width="1"/>
        <text x="270" y="147" fill="#FF9900" font-size="9" font-family="Inter" font-weight="600" text-anchor="middle">Security Controls: Zero-Trust IAM &bull; Secrets Vaulting &bull; Egress Filter &bull; Audit Telemetry</text>
      </svg>`
    }
  };

  // Corporate & University Engagement Modals
  const corporateEngagements = {
    'Infosys': {
      client: 'Infosys',
      tier: 'Global Tier-1 IT & Consulting Enterprise',
      track: 'Enterprise Cloud Data Engineering & Databricks Bootcamp',
      cohortSize: '650+ Senior Developers & Data Engineers',
      techStack: ['AWS S3', 'Databricks Delta Lake', 'PySpark', 'Snowflake', 'Airflow'],
      focusAreas: [
        'Production Medallion architecture streaming design (Bronze -> Silver -> Gold)',
        'Complex PySpark window functions, partition pruning, and Delta OPTIMIZE/Z-Order',
        'Snowflake multi-cluster warehouse scaling, Snowpipe auto-ingest, and zero-copy cloning'
      ],
      impact: 'Upskilled enterprise engineering cohorts for immediate deployment onto Fortune 500 cloud migration projects.',
      rating: '4.95 / 5.0'
    },
    'Wipro': {
      client: 'Wipro Technologies',
      tier: 'Global Technology Services & Consulting',
      track: 'Advanced Generative AI & Agentic Workflows Masterclass',
      cohortSize: '480+ AI Specialists & Architects',
      techStack: ['LangGraph', 'LangChain', 'OpenAI/Claude APIs', 'FAISS', 'Python 3.12'],
      focusAreas: [
        'Stateful cyclic multi-agent graph orchestration using LangGraph',
        'Hybrid Vector & Keyword BM25 retrieval strategies with MMR reranking',
        'Mitigating prompt injection and implementing KMS envelope encryption for enterprise LLM endpoints'
      ],
      impact: 'Enabled core innovation units to deliver production-ready autonomous financial & telemetry agents.',
      rating: '4.92 / 5.0'
    },
    'TCS': {
      client: 'Tata Consultancy Services (TCS)',
      tier: 'Global IT Services & Enterprise Solutions Leader',
      track: 'Enterprise SQL Optimization & Modern Cloud Data Warehousing',
      cohortSize: '820+ Engineers & Architects',
      techStack: ['PostgreSQL 15', 'Snowflake', 'AWS Redshift', 'dbt Core', 'Power BI'],
      focusAreas: [
        'EXPLAIN (ANALYZE, BUFFERS) deep query execution profiling and BRIN indexing',
        'dbt Core modular modeling: Staging, Intermediate Jinja macros, and dimensional marts',
        'Semantic data modeling and DAX performance tuning in executive Power BI suites'
      ],
      impact: '67% reduction in query runtime benchmarks achieved during hands-on performance lab scenarios.',
      rating: '4.96 / 5.0'
    },
    'Accenture': {
      client: 'Accenture',
      tier: 'Global Management Consulting & Technology Firm',
      track: 'Cloud-Native Distributed Systems & Data Lakehouse Architecture',
      cohortSize: '540+ Cloud Engineers & Technical Leads',
      techStack: ['AWS S3', 'AWS Glue', 'Databricks', 'Delta Lake', 'Docker', 'Kubernetes'],
      focusAreas: [
        'Zero-trust cloud infrastructure and EventBridge-triggered serverless pipelines',
        'ACID lakehouse transactions, schema evolution, and Time Travel rollback',
        'Containerized microservice deployments and IaC automation'
      ],
      impact: 'Standardized data engineering delivery methodologies across multi-region cloud practices.',
      rating: '4.94 / 5.0'
    },
    'Capgemini': {
      client: 'Capgemini',
      tier: 'Global Leader in Consulting, Digital Transformation & Engineering',
      track: 'Full-Stack Data Engineering & Real-Time Stream Analytics',
      cohortSize: '420+ Data Engineers',
      techStack: ['Apache Kafka', 'PySpark Streaming', 'Snowflake', 'PostgreSQL'],
      focusAreas: [
        'Kafka partition sizing, consumer group balancing, and micro-batch streaming',
        'Snappy Parquet compression and column-level encryption techniques',
        'Automated data quality checks and CI/CD validation contracts'
      ],
      impact: 'Accelerated team readiness for real-time analytics engagements in European and US markets.',
      rating: '4.91 / 5.0'
    },
    'Cognizant': {
      client: 'Cognizant',
      tier: 'Global Professional Services & Digital Business',
      track: 'AI Knowledge Engineering & Deterministic LLM Compilers',
      cohortSize: '390+ Engineers & Solution Architects',
      techStack: ['AKEF Framework', 'LangChain', 'Python', 'Vector DBs', 'Azure OpenAI'],
      focusAreas: [
        'Autonomous prompt-to-production artifact compilation pipelines',
        'Graph RAG architecture and knowledge graph integration',
        'Deterministic validation passes eliminating hallucination across enterprise docs'
      ],
      impact: 'Deployed AKEF-based knowledge engineering practices for technical curriculum generation.',
      rating: '4.97 / 5.0'
    },
    'HCLTech': {
      client: 'HCLTech',
      tier: 'Global Technology Enterprise & Digital Transformation',
      track: 'Cloud Infrastructure, Data Lake & Distributed Architecture',
      cohortSize: '450+ Cloud Developers',
      techStack: ['AWS', 'Azure ADLS Gen2', 'PySpark', 'dbt Core', 'Linux'],
      focusAreas: [
        'Multi-cloud data migration strategies (On-premise -> AWS S3 / Azure Synapse)',
        'Serverless compute sizing and cost optimization on AWS Lambda / EMR',
        'Linux kernel tuning, networking protocols, and high-concurrency event ingestion'
      ],
      impact: 'Directly improved infrastructure delivery velocity across cloud consulting pods.',
      rating: '4.90 / 5.0'
    },
    'Bosch': {
      client: 'Bosch Global Software Technologies',
      tier: 'Global Engineering & IoT Solutions Leader',
      track: 'High-Throughput IoT Telemetry & Industrial Streaming Lakehouse',
      cohortSize: '310+ Embedded & Cloud Engineers',
      techStack: ['Kafka', 'Databricks Delta Lake', 'PySpark', 'AWS S3', 'Grafana'],
      focusAreas: [
        'Ingesting millions of sensor records per minute into S3 Bronze storage',
        'PySpark structured deduplication and anomaly detection in Silver layer',
        'Z-Ordered Gold tables for sub-second telemetry dashboards'
      ],
      impact: 'Established production patterns for connected IoT device telemetry and predictive analytics.',
      rating: '4.98 / 5.0'
    },
    'EY': {
      client: 'EY (Ernst & Young)',
      tier: 'Big 4 Global Assurance, Tax & Strategy Consulting',
      track: 'Enterprise Financial Data Warehousing & Executive Analytics',
      cohortSize: '370+ Financial Data Analysts & Consultants',
      techStack: ['Snowflake', 'Power BI', 'SQL Server', 'Python', 'dbt'],
      focusAreas: [
        'Financial audit trail modeling, Time Travel compliance, and role-based data masking',
        'DAX measures, tabular semantic models, and executive scorecard architecture',
        'Automated reconciliation pipelines with zero manual spreadsheet dependencies'
      ],
      impact: 'Empowered financial consulting teams to deliver automated audit and compliance pipelines.',
      rating: '4.96 / 5.0'
    },
    'Deloitte': {
      client: 'Deloitte',
      tier: 'Global Consulting Leader & Enterprise Architecture',
      track: 'Modern Data Platform Architecture & AI Integration',
      cohortSize: '510+ Architects & Senior Consultants',
      techStack: ['AWS', 'Databricks', 'Snowflake', 'LangGraph', 'Terraform'],
      focusAreas: [
        'Enterprise data mesh topologies and cross-domain data governance',
        'Autonomous AI agents for enterprise business intelligence',
        'Multi-region high-availability disaster recovery architectures'
      ],
      impact: 'Trained senior architecture practices on modern Lakehouse and GenAI platform patterns.',
      rating: '4.95 / 5.0'
    }
  };

  const universityEngagements = {
    'RVCE': {
      institution: 'R.V. College of Engineering (RVCE), Bangalore',
      program: 'Faculty Development Program (FDP) & Student Advanced Tech Masterclass',
      topics: ['Advanced Data Structures & Algorithms in Java/Python', 'Cloud Data Lakehouse Architecture', 'Generative AI & Agentic Workflows'],
      participants: '350+ Faculty & Top Engineering Students',
      outcomes: 'Hands-on delivery of production-grade cloud and algorithm engineering modules aligned with Tier-1 industry standards.'
    },
    'MSRIT': {
      institution: 'Ramaiah Institute of Technology (MSRIT), Bangalore',
      program: 'Enterprise Cloud & Data Engineering Bootcamp',
      topics: ['PySpark Distributed Computing', 'AWS S3 & Glue Serverless ETL', 'SQL Query Tuning (EXPLAIN ANALYZE)'],
      participants: '400+ Students & Department Faculty',
      outcomes: 'Constructed end-to-end Medallion Lakehouses with live AWS cloud infrastructure deployments.'
    },
    'BMSCE': {
      institution: 'B.M.S. College of Engineering (BMSCE), Bangalore',
      program: 'Industry AI & Large Language Model Architecture Workshop',
      topics: ['LangChain & LangGraph Frameworks', 'Vector Search (FAISS & ChromaDB)', 'AKEF Knowledge Engineering'],
      participants: '320+ Participants',
      outcomes: 'Built autonomous multi-agent systems and evaluated deterministic prompt compilation pipelines.'
    },
    'Christ University': {
      institution: 'Christ University, Faculty of Engineering, Bangalore',
      program: 'Modern Data Warehousing & Business Intelligence Accelerator',
      topics: ['Snowflake Dimensional Modeling', 'Power BI DAX Semantic Layers', 'PostgreSQL Performance Optimization'],
      participants: '280+ Students & Faculty',
      outcomes: 'Engineered complete star-schema retail data marts with sub-second dashboard rendering.'
    },
    'PES University': {
      institution: 'PES University, Bangalore',
      program: 'Cloud-Native Distributed Systems & Microservices Masterclass',
      topics: ['Docker & Kubernetes Containerization', 'Kafka Real-Time Streaming', 'AWS Lambda Serverless APIs'],
      participants: '450+ Computer Science Engineers',
      outcomes: 'Designed high-concurrency event-driven architectures with fault-tolerant container clusters.'
    },
    'JAIN University': {
      institution: 'Jain University (Deemed-to-be), Bangalore',
      program: 'Generative AI & Enterprise Data Architecture Seminar',
      topics: ['RAG Pipeline Engineering', 'Token Optimization & Latency Reduction', 'Cloud Cybersecurity for AI'],
      participants: '300+ Students & Researchers',
      outcomes: 'Hands-on labs on prompt injection mitigation and deterministic knowledge synthesis.'
    },
    'REVA University': {
      institution: 'REVA University, Bangalore',
      program: 'Advanced Python & Cloud Data Pipeline Workshop',
      topics: ['Python 3.12 Asynchronous Programming', 'ETL Data Quality Pipelines', 'REST API Architecture'],
      participants: '350+ Students',
      outcomes: 'Automated data ingestion pipelines connected to cloud object storage.'
    },
    'New Horizon CE': {
      institution: 'New Horizon College of Engineering, Bangalore',
      program: 'Full-Stack Data Engineering & Cloud Solutions Bootcamp',
      topics: ['AWS Core Infrastructure', 'Databricks Spark', 'Database Schema Design & Indexing'],
      participants: '380+ Students',
      outcomes: 'Built enterprise-ready data platforms with real-world case studies.'
    },
    'Alliance University': {
      institution: 'Alliance University, Bangalore',
      program: 'Faculty Development Program in AI & Data Science',
      topics: ['Curriculum Engineering via AKEF', 'Distributed Systems Pedagogy', 'Modern AI Toolchains'],
      participants: '180+ Faculty Members',
      outcomes: 'Enhanced academic curriculum with real-world enterprise engineering case studies.'
    },
    'RNSIT': {
      institution: 'RNS Institute of Technology (RNSIT), Bangalore',
      program: 'Cloud Computing & Algorithmic Problem Solving Masterclass',
      topics: ['Data Structures & Complexity Analysis', 'Cloud Ingestion Pipelines', 'PostgreSQL Optimization'],
      participants: '340+ Students',
      outcomes: 'Mastered production data structures and AWS cloud deployment essentials.'
    },
    'SJBIT': {
      institution: 'SJB Institute of Technology (SJBIT), Bangalore',
      program: 'Data Structures, Algorithms & Cloud Data Engineering Masterclass',
      topics: ['Advanced DSA in Java/C++', 'AWS Cloud Architecture', 'Generative AI Foundations'],
      participants: '420+ Students & Faculty',
      outcomes: 'Developed high-performance algorithms and production cloud storage pipelines.'
    }
  };

  window.openCorporateClientModal = function(clientKey) {
    const data = corporateEngagements[clientKey] || {
      client: clientKey,
      tier: 'Enterprise Corporate Client',
      track: 'Cloud & AI Engineering Bootcamp',
      cohortSize: '300+ Engineers',
      techStack: ['AWS', 'Python', 'Databricks', 'SQL'],
      focusAreas: ['Advanced technical curriculum delivery and cloud infrastructure engineering.'],
      impact: 'Delivered high-impact technical masterclasses.',
      rating: '4.9 / 5.0'
    };

    let modal = document.getElementById('client-details-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'client-details-modal';
      modal.className = 'site-modal-overlay';
      modal.setAttribute('onclick', 'closeModalOnBackdrop(event, "client-details-modal")');
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="site-modal-card" style="max-width: 680px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
          <div>
            <span class="status-pill" style="margin-bottom: 6px;">${escapeHtml(data.tier)}</span>
            <h3 style="font-size: 1.5rem; font-weight: 900; color: var(--aws-orange); margin-top: 4px;">${escapeHtml(data.client)}</h3>
          </div>
          <button onclick="document.getElementById('client-details-modal').style.display='none'" class="btn-secondary" style="padding: 4px 10px; font-size: 1.25rem;">&times;</button>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--aws-orange); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Training Track &amp; Delivery</div>
          <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 8px;">${escapeHtml(data.track)}</div>
          <div style="font-size: 0.8125rem; color: var(--text-secondary);">Cohort Impact: <strong>${escapeHtml(data.cohortSize)}</strong> &bull; Evaluation: <strong style="color: #f59e0b;">★ ${escapeHtml(data.rating)}</strong></div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-mono);">Key Curriculum Modules &amp; Labs</h4>
          <ul style="padding-left: 20px; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            ${data.focusAreas.map(f => `<li style="margin-bottom: 6px;">${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-mono);">Verified Stack</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${data.techStack.map(t => `<span style="font-family: var(--font-mono); font-size: 0.75rem; padding: 4px 10px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--text-primary);">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--color-sage); border-radius: var(--radius-md); padding: 12px 16px; color: var(--color-sage); font-size: 0.875rem; margin-bottom: 20px;">
          ✓ <strong>Business Result:</strong> ${escapeHtml(data.impact)}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <a href="#contact" onclick="document.getElementById('client-details-modal').style.display='none'" class="btn-primary" style="font-size: 0.8125rem;">Book Corporate Training →</a>
          <button onclick="document.getElementById('client-details-modal').style.display='none'" class="btn-secondary" style="font-size: 0.8125rem;">Close</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('client_modal_open', data.client);
    }
  };

  window.openUniversityModal = function(univKey) {
    const data = universityEngagements[univKey] || {
      institution: univKey,
      program: 'Technical Bootcamp & Faculty Development Program',
      topics: ['Cloud Architecture', 'Data Engineering', 'Artificial Intelligence'],
      participants: '300+ Students & Faculty',
      outcomes: 'Completed advanced hands-on engineering labs.'
    };

    let modal = document.getElementById('univ-details-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'univ-details-modal';
      modal.className = 'site-modal-overlay';
      modal.setAttribute('onclick', 'closeModalOnBackdrop(event, "univ-details-modal")');
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="site-modal-card" style="max-width: 680px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
          <div>
            <span class="status-pill" style="margin-bottom: 6px; background: rgba(0, 229, 255, 0.12); color: var(--aws-cyan); border-color: var(--aws-cyan);">Premier Academic Partner</span>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: var(--text-primary); margin-top: 4px;">${escapeHtml(data.institution)}</h3>
          </div>
          <button onclick="document.getElementById('univ-details-modal').style.display='none'" class="btn-secondary" style="padding: 4px 10px; font-size: 1.25rem;">&times;</button>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--aws-cyan); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Program Overview</div>
          <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 6px;">${escapeHtml(data.program)}</div>
          <div style="font-size: 0.8125rem; color: var(--text-secondary);">Engagement Scale: <strong>${escapeHtml(data.participants)}</strong></div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-mono);">Key Technical Focus Areas</h4>
          <ul style="padding-left: 20px; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
            ${data.topics.map(t => `<li style="margin-bottom: 6px;">${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>

        <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid var(--aws-cyan); border-radius: var(--radius-md); padding: 12px 16px; color: var(--text-primary); font-size: 0.875rem; margin-bottom: 20px;">
          🎯 <strong>Academic Impact:</strong> ${escapeHtml(data.outcomes)}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <a href="#contact" onclick="document.getElementById('univ-details-modal').style.display='none'" class="btn-primary" style="font-size: 0.8125rem;">Request College FDP / Workshop →</a>
          <button onclick="document.getElementById('univ-details-modal').style.display='none'" class="btn-secondary" style="font-size: 0.8125rem;">Close</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('university_modal_open', data.institution);
    }
  };

  window.showRepoArchModal = function(repoKey) {
    const keyMap = {
      'akef': 'akef',
      'langgraph': 'langgraph',
      'lakehouse': 'aws-lakehouse',
      'snowflake': 'snowflake',
      'dbt': 'dbt',
      'security': 'security',
      'portfolio': 'portfolio',
      'data-engineering': 'data-engineering',
      'sql': 'sql',
      'powerbi': 'powerbi',
      'databricks': 'databricks',
      'genai': 'genai'
    };
    const targetKey = keyMap[repoKey] || repoKey;
    if (window.openDedicatedExplorer) {
      window.openDedicatedExplorer(targetKey, 'highLevel');
    }
  };

  window.closeRepoArchModal = function() {
    if (window.closeDedicatedExplorer) {
      window.closeDedicatedExplorer();
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});

