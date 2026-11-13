(() => {
  const ACCENTS = {
    python: { hex: '#ffd43b', rgb: '255, 212, 59' },
    cpp: { hex: '#56a8f5', rgb: '86, 168, 245' },
    csharp: { hex: '#c77dff', rgb: '199, 125, 255' },
  };

  let currentLang = 'python';
  let matrixMode = false;

  // 1. YEAR & COUNTERS
  document.getElementById('year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    let current = 0;
    const step = () => {
      current += 1;
      el.textContent = current;
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // 2. CURSOR GLOW
  const glow = document.getElementById('cursor-glow');
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  // 3. TYPEWRITER
  const phrases = [
    'python3 main.py --fast',
    'g++ -O3 -std=c++20 engine.cpp',
    'dotnet run -c Release',
    'open https://t.me/alsoplay',
  ];
  const twEl = document.getElementById('typewriter');
  let pIdx = 0;
  let cIdx = 0;
  let deleting = false;

  function tickTypewriter() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      cIdx += 1;
      twEl.textContent = phrase.slice(0, cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(tickTypewriter, 1600);
        return;
      }
      setTimeout(tickTypewriter, 55);
    } else {
      cIdx -= 1;
      twEl.textContent = phrase.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tickTypewriter, 320);
        return;
      }
      setTimeout(tickTypewriter, 28);
    }
  }
  tickTypewriter();

  // 4. CODE SANDBOX
  const snippets = {
    python: {
      code: [
        '<span class="tok-kw">import</span> asyncio',
        '',
        '<span class="tok-kw">async def</span> <span class="tok-fn">hello</span>(user: <span class="tok-fn">str</span>) -> <span class="tok-fn">dict</span>:',
        '    <span class="tok-kw">await</span> asyncio.sleep(<span class="tok-num">0.05</span>)',
        '    <span class="tok-kw">return</span> {',
        '        <span class="tok-str">"dev"</span>: user,',
        '        <span class="tok-str">"stack"</span>: [<span class="tok-str">"Python"</span>, <span class="tok-str">"C++"</span>, <span class="tok-str">"C#"</span>],',
        '        <span class="tok-str">"tg"</span>: <span class="tok-str">"https://t.me/alsoplay"</span>',
        '    }',
        '',
        'print(asyncio.run(hello(<span class="tok-str">"@alsoplay"</span>)))',
      ].join('\n'),
      output: [
        '$ python3 main.py',
        "{'dev': '@alsoplay', 'stack': ['Python', 'C++', 'C#'], 'tg': 'https://t.me/alsoplay'}",
        '[exit 0 · 14ms]',
      ],
    },
    cpp: {
      code: [
        '<span class="tok-com">// zero-overhead greeting</span>',
        '<span class="tok-kw">#include</span> <span class="tok-str">&lt;iostream&gt;</span>',
        '<span class="tok-kw">#include</span> <span class="tok-str">&lt;string_view&gt;</span>',
        '',
        '<span class="tok-kw">int</span> <span class="tok-fn">main</span>() {',
        '    <span class="tok-kw">constexpr</span> std::string_view tg = <span class="tok-str">"@alsoplay"</span>;',
        '    std::cout &lt;&lt; <span class="tok-str">"Ready. Ping "</span> &lt;&lt; tg &lt;&lt; <span class="tok-str">"\\n"</span>;',
        '    <span class="tok-kw">return</span> <span class="tok-num">0</span>;',
        '}',
      ].join('\n'),
      output: [
        '$ g++ -O3 -std=c++20 engine.cpp -o engine && ./engine',
        'Ready. Ping @alsoplay',
        '[exit 0 · 0.8ms]',
      ],
    },
    csharp: {
      code: [
        '<span class="tok-kw">using</span> System;',
        '',
        '<span class="tok-kw">record</span> <span class="tok-fn">Developer</span>(<span class="tok-kw">string</span> Handle, <span class="tok-kw">string</span>[] Stack);',
        '',
        '<span class="tok-kw">var</span> dev = <span class="tok-kw">new</span> Developer(<span class="tok-str">"@alsoplay"</span>, [<span class="tok-str">"Python"</span>, <span class="tok-str">"C++"</span>, <span class="tok-str">"C#"</span>]);',
        'Console.WriteLine($<span class="tok-str">"{dev.Handle} :: {string.Join(\", \", dev.Stack)}"</span>);',
      ].join('\n'),
      output: [
        '$ dotnet run -c Release',
        '@alsoplay :: Python, C++, C#',
        '[exit 0 · 19ms]',
      ],
    },
  };

  const codeDisplay = document.getElementById('code-display');
  const codeConsole = document.getElementById('code-console');
  const langTabs = document.querySelectorAll('.lang-tab');
  const stackCards = document.querySelectorAll('.stack-card');

  function setLanguage(lang) {
    currentLang = lang;
    const accent = ACCENTS[lang];
    document.documentElement.style.setProperty('--accent', accent.hex);
    document.documentElement.style.setProperty('--accent-rgb', accent.rgb);

    langTabs.forEach((t) => t.classList.toggle('active', t.dataset.lang === lang));
    stackCards.forEach((c) => c.classList.toggle('active', c.dataset.accent === lang));

    codeDisplay.innerHTML = snippets[lang].code;
    codeConsole.innerHTML = '<span class="console-muted">// Нажми Run, чтобы выполнить сниппет</span>';
  }

  langTabs.forEach((tab) => {
    tab.addEventListener('click', () => setLanguage(tab.dataset.lang));
  });

  stackCards.forEach((card) => {
    card.addEventListener('click', () => setLanguage(card.dataset.accent));
  });

  document.getElementById('run-code-btn').addEventListener('click', () => {
    const lines = snippets[currentLang].output;
    codeConsole.textContent = '';
    lines.forEach((line, idx) => {
      setTimeout(() => {
        codeConsole.textContent += (idx > 0 ? '\n' : '') + line;
      }, idx * 140);
    });
  });

  setLanguage('python');

  // 5. COPY TELEGRAM HANDLE
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.getElementById('copy-tg').addEventListener('click', async (e) => {
    const handle = e.currentTarget.dataset.handle;
    try {
      await navigator.clipboard.writeText(handle);
      showToast(`Скопировано: ${handle}`);
    } catch {
      showToast(`Telegram: ${handle}`);
    }
  });

  // 6. INTERACTIVE TERMINAL
  const termOut = document.getElementById('terminal-output');
  const termForm = document.getElementById('terminal-form');
  const termInput = document.getElementById('terminal-input');
  const cmdHistory = [];
  let histIdx = -1;

  const COMMANDS = ['help', 'whoami', 'stack', 'ping', 'matrix', 'tg', 'clear', 'sudo'];

  function printLine(text, cls = '') {
    const div = document.createElement('div');
    div.className = `term-line ${cls}`.trim();
    div.textContent = text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
  }

  function printBanner() {
    printLine('Добро пожаловать в shell @alsoplay. Введи "help" для списка команд.', 'muted');
  }
  printBanner();

  function toggleMatrix(forceState) {
    matrixMode = typeof forceState === 'boolean' ? forceState : !matrixMode;
    document.getElementById('matrix-toggle').textContent = `[ matrix: ${matrixMode ? 'on' : 'off'} ]`;
    return matrixMode;
  }

  document.getElementById('matrix-toggle').addEventListener('click', () => {
    const state = toggleMatrix();
    showToast(state ? 'Matrix mode: ON' : 'Matrix mode: OFF');
  });

  document.getElementById('clear-term').addEventListener('click', () => {
    termOut.innerHTML = '';
  });

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    printLine(`alsoplay@dev:~$ ${raw}`, 'accent');
    if (!cmd) return;

    switch (cmd) {
      case 'help':
        printLine('Доступные команды:');
        printLine('  whoami   — кто я');
        printLine('  stack    — языки и инструменты');
        printLine('  ping     — проверить отклик');
        printLine('  matrix   — переключить Matrix-дождь на фоне');
        printLine('  tg       — ссылка на Telegram @alsoplay');
        printLine('  clear    — очистить терминал');
        break;
      case 'whoami':
        printLine('@alsoplay — разработчик на Python, C++ и C#.', 'success');
        break;
      case 'stack':
        printLine('[Python] FastAPI, asyncio, aiogram, скрипты и автоматизация');
        printLine('[C++]    C++20, STL, CMake, производительность и потоки');
        printLine('[C#]     .NET 8, ASP.NET, LINQ, Unity');
        break;
      case 'ping':
        printLine('PONG from @alsoplay: 1ms · готов к задачам.', 'success');
        break;
      case 'matrix': {
        const on = toggleMatrix();
        printLine(`Matrix mode -> ${on ? 'ENABLED' : 'DISABLED'}`, 'success');
        break;
      }
      case 'tg':
        printLine('Telegram: https://t.me/alsoplay (@alsoplay)', 'success');
        window.open('https://t.me/alsoplay', '_blank', 'noopener,noreferrer');
        break;
      case 'clear':
        termOut.innerHTML = '';
        break;
      case 'sudo':
        printLine('Nice try. Пиши сразу в Telegram: @alsoplay', 'error');
        break;
      default:
        printLine(`Команда не найдена: "${cmd}". Введи "help".`, 'error');
    }
  }

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = termInput.value;
    if (val.trim()) {
      cmdHistory.unshift(val);
      histIdx = -1;
    }
    runCommand(val);
    termInput.value = '';
  });

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx += 1;
        termInput.value = cmdHistory[histIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx -= 1;
        termInput.value = cmdHistory[histIdx];
      } else {
        histIdx = -1;
        termInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = termInput.value.trim().toLowerCase();
      if (!val) return;
      const match = COMMANDS.find((c) => c.startsWith(val));
      if (match) termInput.value = match;
    }
  });

  // 7. CANVAS BACKGROUND (PARTICLES + MATRIX MODE + FPS)
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const fpsEl = document.getElementById('fps-counter');

  let w = 0;
  let h = 0;
  let particles = [];
  let drops = [];
  const MATRIX_CHARS = '01アイウエオカキクケコPythonC++C#@alsoplay';

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(75, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.8 + 0.8,
    }));
    const cols = Math.floor(w / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }
  window.addEventListener('resize', resize);
  resize();

  let frames = 0;
  let lastFpsTime = performance.now();

  function animate(now) {
    frames += 1;
    if (now - lastFpsTime >= 1000) {
      fpsEl.textContent = `${frames} fps`;
      frames = 0;
      lastFpsTime = now;
    }

    const rgb = ACCENTS[currentLang].rgb;

    if (matrixMode) {
      ctx.fillStyle = 'rgba(8, 10, 15, 0.14)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#38e58d';
      ctx.font = '14px "JetBrains Mono", monospace';
      for (let i = 0; i < drops.length; i += 1) {
        const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.65;
      }
    } else {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 1) {
            p.x -= (dx / dist) * 0.45;
            p.y -= (dy / dist) * 0.45;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.55)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb}, ${0.14 * (1 - d / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
