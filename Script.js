(function() {
  if (document.getElementById("khz-panel")) return;

  const features = {
    questionSpoof: false,
    videoSpoof: false,
    revealAnswers: false,
    autoAnswer: false,
    darkMode: true,
    rgbLogo: false
  };

  const config = {
    autoAnswerDelay: 1.5
  };

  function sendToast(message, duration = 4000) {
    const toast = document.createElement("div");
    toast.className = "khz-toast";
    toast.innerHTML = `
      <div class="khz-toast-message">${message}</div>
      <div class="khz-toast-progress"></div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // --- Modern RGB Theme ---
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeOut { 0% { opacity: 1 } 100% { opacity: 0 } }
    @keyframes khz-rgb-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes khz-btn-glow {
      0%,100% { box-shadow: 0 0 16px 4px rgba(0,255,255,0.3);}
      50% { box-shadow: 0 0 32px 8px rgba(255,0,255,0.4);}
    }
    .khz-splash {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgb(0,0,0);
      display: flex; justify-content: center; align-items: center;
      z-index: 999999; color: rgb(0,255,180);
      font-size: 42px; font-family: sans-serif; font-weight: bold;
      transition: opacity 1s ease;
    }
    .khz-splash.fadeout { animation: fadeOut 1s ease forwards; }
    .khz-toggle {
      position: fixed; bottom: 20px; left: 20px; width: 48px; height: 48px;
      background: linear-gradient(270deg, rgb(255,0,0), rgb(0,255,0), rgb(0,0,255), rgb(255,0,0));
      background-size: 600% 600%;
      animation: khz-rgb-gradient 8s ease infinite;
      border: none; border-radius: 18px; display: flex;
      align-items: center; justify-content: center; cursor: pointer;
      z-index: 100000; color: #fff; font-size: 26px; font-weight: bold;
      font-family: sans-serif; box-shadow: 0 0 18px 6px rgba(0,255,255,0.5);
      transition: transform 0.2s;
      user-select: none;
      outline: 3px solid rgb(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
    }
    .khz-toggle:hover { transform: scale(1.1); box-shadow: 0 0 24px 12px rgba(255,0,255,0.25);}
    .khz-panel {
      position: fixed; top: 100px; left: 100px; width: 340px;
      background: rgba(24,27,38,0.98);
      border-radius: 20px; padding: 26px 22px 18px 22px; z-index: 99999;
      color: rgb(200,255,245); font-family: 'Segoe UI',sans-serif;
      box-shadow: 0 0 48px 10px rgba(0,255,255,0.18),0 6px 24px 0 rgba(0,0,0,0.25);
      cursor: grab; display: none;
      border: 2px solid rgb(0,255,180,0.33);
      backdrop-filter: blur(3px);
    }
    .khz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .khz-title {
      font-weight: bold;
      font-size: 22px;
      color: rgb(255,0,180);
      letter-spacing: 2px;
      text-shadow: 0 2px 12px rgb(0,255,255,0.27);
    }
    .khz-button {
      display: block; width: 100%; margin: 8px 0; padding: 12px;
      background: rgba(0,0,0,0.80);
      color: rgb(200,255,245);
      border: 2px solid rgb(0,255,180);
      border-radius: 10px;
      cursor: pointer; font-size: 15px;
      font-weight: 600;
      transition: 0.25s;
      box-shadow: 0 0 0 0 rgba(0,255,255,0.08);
      outline: none;
      margin-bottom: 12px;
    }
    .khz-button:hover, .khz-button.active {
      background: linear-gradient(90deg, rgba(0,255,255,0.11), rgba(255,0,255,0.14));
      border-color: rgb(255,0,180);
      color: rgb(255,255,255);
      animation: khz-btn-glow 2.5s infinite;
    }
    .khz-button.active {
      background: linear-gradient(270deg, rgba(0,255,180,0.21), rgba(255,0,180,0.16));
      color: rgb(255,255,255);
    }
    .khz-input-group {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 8px; margin-bottom: 16px;
    }
    .khz-input-group label { font-size: 13px; color: rgb(110,255,210);}
    .khz-input-group input {
      width: 60px; background: rgb(32,38,54); color: #fff;
      border: 1.5px solid rgb(0,255,180);
      border-radius: 5px; padding: 5px;
      text-align: center;
      font-size: 15px;
      box-shadow: 0 0 3px 1px rgba(0,255,255,0.08);
    }
    .khz-toast {
      position: fixed; bottom: 20px; right: 20px;
      background: rgba(24,27,38,0.98); color: #fff;
      border: 1.5px solid rgb(0,255,180);
      border-radius: 11px; padding: 13px 18px;
      margin-top: 10px; box-shadow: 0 0 12px rgb(0,255,255,0.12);
      font-size: 15px; font-family: 'Segoe UI',sans-serif;
      z-index: 999999; animation: fadeIn 0.3s ease-out; overflow: hidden;
      width: fit-content; max-width: 320px; font-weight: 600;
    }
    .khz-toast.hide{animation:fadeOut 0.5s ease forwards}
    .khz-toast-progress {
      position: absolute; left: 0; bottom: 0; height: 4px;
      background: linear-gradient(90deg, rgb(0,255,180), rgb(255,0,180));
      animation: toastProgress linear forwards;
      animation-duration: 4s; width: 100%;
    }
    .khz-toast-message { position:relative; z-index:1 }
    @keyframes toastProgress{from{width:100%}to{width:0%}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);

  // ... lógica JSON.parse, fetch, etc.

  const originalParse = JSON.parse;
  JSON.parse = function(text, reviver) {
    let data = originalParse(text, reviver);
    if (features.revealAnswers && data?.data) {
      try {
        const dataValues = Object.values(data.data);
        for (const val of dataValues) {
          if (val?.item?.itemData) {
            let itemData = JSON.parse(val.item.itemData);
            if (itemData.question?.widgets) {
              for (const widget of Object.values(itemData.question.widgets)) {
                widget.options?.choices?.forEach(choice => {
                  if (choice.correct) {
                    choice.content = "✅ " + choice.content;
                    sendToast("Questão arrebentadakk.");
                  }
                });
              }
            }
            val.item.itemData = JSON.stringify(itemData);
          }
        }
      } catch (e) {}
    }
    return data;
  };

  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    let [input, init] = args;

    if (features.videoSpoof) {
      let requestBody, modifiedBody;
      if (input instanceof Request) {
        requestBody = await input.clone().text().catch(() => null);
      } else if (init?.body) {
        requestBody = init.body;
      }
      if (requestBody && requestBody.includes('"operationName":"updateUserVideoProgress"')) {
        try {
          let bodyObj = JSON.parse(requestBody);
          if (bodyObj.variables?.input) {
            const duration = bodyObj.variables.input.durationSeconds;
            bodyObj.variables.input.secondsWatched = duration;
            bodyObj.variables.input.lastSecondWatched = duration;
            modifiedBody = JSON.stringify(bodyObj);
          }
          if (modifiedBody) {
            if (input instanceof Request) {
                args[0] = new Request(input, { body: modifiedBody, ...init });
            } else {
                if (!args[1]) args[1] = {};
                args[1].body = modifiedBody;
            }
          }
        } catch (e) {}
      }
    }
    const originalResponse = await originalFetch.apply(this, args);
    if (features.questionSpoof && originalResponse.ok) {
        const clonedResponse = originalResponse.clone();
        try {
            let responseObj = await clonedResponse.json();
            if (responseObj?.data?.assessmentItem?.item?.itemData) {
                const phrases = ["I love you vanda 🤍", " desenvolvido por: jojao?", "💜", "#Luto marcos10pc"];
                let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "aqui é a questão certa seus burro", correct: true }, { content: "❌", correct: false }] } } };
                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                sendToast("Questão exploitada.");
                return new Response(JSON.stringify(responseObj), { status: 200, statusText: "OK", headers: originalResponse.headers });
            }
        } catch (e) {}
    }
    return originalResponse;
  };

  (async function autoAnswerLoop() {
    while (true) {
      if (features.autoAnswer) {
        const click = (selector) => document.querySelector(selector)?.click();
        click('[data-testid="choice-icon__library-choice-icon"]');
        await delay(100);
        click('[data-testid="exercise-check-answer"]');
        await delay(100);
        click('[data-testid="exercise-next-question"]');
        await delay(100);
        click('._1udzurba');
        click('._awve9b');
        const summaryButton = document.querySelector('._1udzurba[data-test-id="end-of-unit-test-next-button"]');
        if (summaryButton?.innerText.toLowerCase().includes("resumo")) {
          sendToast("🎉 Exercício concluído!");
        }
      }
      await delay(config.autoAnswerDelay * 1000);
    }
  })
  
  const splash = document.createElement("div");
  splash.className = "khz-splash";
  splash.textContent = "KhanMarquês";
  document.body.appendChild(splash);

  (async function initializeUI() {
    setTimeout(() => {
      splash.classList.add("fadeout");
      setTimeout(() => {
        splash.remove();

        const toggleBtn = document.createElement("div");
        toggleBtn.innerHTML = "≡";
        toggleBtn.className = "khz-toggle";
        toggleBtn.onclick = () => {
          const p = document.getElementById("khz-panel");
          p.style.display = p.style.display === "none" ? "block" : "none";
        };
        document.body.appendChild(toggleBtn);

        const panel = document.createElement("div");
        panel.id = "khz-panel";
        panel.className = "Jojao-panel";
        panel.innerHTML = `
          <div class="khz-header">
            <div class="khz-title">KhanSyntax</div>
            <div>V2.0</div>
          </div>
          <button id="foase-btn-question" class="fodase-button">Question Spoof [OFF]</button>
          <button id="fodase-btn-video" class="fodase-button">Video Spoof [OFF]</button>
          <button id="fodase-btn-reveal" class="fodase-button">Reveal Answers [OFF]</button>
          <button id="fodase-btn-auto" class="fodase-button">Auto Answer [OFF]</button>
          <div class="fodase-input-group">
            <label for="khz-input-speed">Velocidade (s):</label>
            <input type="number" id="khz-input-speed" value="${config.autoAnswerDelay}" step="0.1" min="0.2">
          </div>
          <button id="khz-btn-dark" class="khz-button active">Dark Mode [ON]</button>
          <button id="khz-btn-rgb" class="khz-button">RGB Logo [OFF]</button>
        `;
        document.body.appendChild(panel);

        const speedInput = document.getElementById('khz-input-speed');
        speedInput.addEventListener('input', () => {
          const newDelay = parseFloat(speedInput.value);
          if (newDelay >= 0.2) {
              config.autoAnswerDelay = newDelay;
          }
        });

        const setupButton = (buttonId, featureName, buttonText) => {
          const button = document.getElementById(buttonId);
          button.addEventListener('click', () => {
            if (featureName === 'darkMode') {
              if (features.darkMode) {
                if (window.DarkReader) DarkReader.disable();
                features.darkMode = false;
              } else {
                if (window.DarkReader) DarkReader.enable();
                features.darkMode = true;
              }
            } else {
              features[featureName] = !features[featureName];
            }
            const stateText = features[featureName] ? 'ON' : 'OFF';
            button.textContent = `${buttonText} [${stateText}]`;
            button.classList.toggle('active', features[featureName]);
          });
        };
        setupButton('fodase-btn-question', 'questionSpoof', 'Question Spoof');
        setupButton('fodase-btn-video', 'videoSpoof', 'Video Spoof');
        setupButton('fodase-btn-reveal', 'revealAnswers', 'Reveal Answers');
        setupButton('fodase-btn-auto', 'autoAnswer', 'Auto Answer');
        setupButton('fodase dnvkk-btn-dark', 'darkMode', 'Dark Mode');

        document.getElementById("fodase-btn-rgb").addEventListener("click", toggleRgbLogo);

        function toggleRgbLogo() {
          const khanLogo = document.querySelector('path[fill="#14bf96"]');
          const existingStyle = document.querySelector('style.RGBLogo');
          if (!khanLogo) {
            sendToast("❌ Logo do Khan Academy não encontrado.");
            return;
          }
          if (features.rgbLogo) {
            if (existingStyle) existingStyle.remove();
            khanLogo.style.filter = '';
            features.rgbLogo = false;
            sendToast("🎨 RGB Logo desativado.");
          } else {
            const styleElement = document.createElement('style');
            styleElement.className = "RGBLogo";
            styleElement.textContent = `
              @keyframes hueShift {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
              }
              .force-rgb-logo {
                animation: hueShift 5s infinite linear !important;
              }
            `;
            document.head.appendChild(styleElement);
            khanLogo.classList.add("force-rgb-logo");
            features.rgbLogo = true;
            sendToast("🌈 RGB Logo ativado!");
          }
          const rgbBtn = document.getElementById("khz-btn-rgb");
          const stateText = features.rgbLogo ? "ON" : "OFF";
          rgbBtn.textContent = `RGB Logo [${stateText}]`;
          rgbBtn.classList.toggle("active", features.rgbLogo);
        }

        // Arrastar painel
        let dragging = false, offsetX = 0, offsetY = 0;
        panel.addEventListener("mousedown", e => {
          if (e.target.closest("button") || e.target.closest("input")) return;
          dragging = true;
          offsetX = e.clientX - panel.offsetLeft;
          offsetY = e.clientY - panel.offsetTop;
          panel.style.cursor = "grabbing";
        });
        document.addEventListener("mousemove", e => {
          if (dragging) {
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
          }
        });
        document.addEventListener("mouseup", () => {
          dragging = false;
          panel.style.cursor = "grab";
        });

      }, 1000);
    }, 2000);
    const toastifyScript = document.createElement('script');
    toastifyScript.src = 'https://cdn.jsdelivr.net/npm/toastify-js';
    document.head.appendChild(toastifyScript);
    const darkReaderScript = document.createElement('script');
    darkReaderScript.src = 'https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js';
    darkReaderScript.onload = () => {
      if (features.darkMode && window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable();
      }
      sendToast("KHAN Ativado cacete");
    };
    document.head.appendChild(darkReaderScript);

  })();

})();
