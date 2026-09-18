const D = {
                transparency: 12,
                blur: 18,
                saturation: 150,
                brightness: 100,
                borderWidth: 1,
                borderOpacity: 22,
                radius: 24,
                shadowX: 0,
                shadowY: 24,
                shadowBlur: 50,
                shadowOpacity: 30,
                reflectionIntensity: 12,
                tint: "#ffffff",
                borderColor: "#ffffff",
                shadowColor: "#000000",
            };
            let c = { ...D },
                stack = [],
                redoStack = [],
                tabName = "css";
            const P = [
                ["Frosted", "#fff", "#64748b", { transparency: 14, blur: 22 }],
                [
                    "Crystal",
                    "#dbeafe",
                    "#38bdf8",
                    { transparency: 18, blur: 28 },
                ],
                [
                    "Deep Glass",
                    "#111827",
                    "#312e81",
                    { transparency: 24, blur: 16 },
                ],
                [
                    "Aurora",
                    "#a855f7",
                    "#22d3ee",
                    { transparency: 12, blur: 30 },
                ],
                ["Ice", "#e0f2fe", "#93c5fd", { transparency: 22, blur: 34 }],
                ["Rose", "#fda4af", "#c084fc", { transparency: 16, blur: 20 }],
                ["Cyber", "#06b6d4", "#d946ef", { transparency: 10, blur: 14 }],
                ["Smoke", "#64748b", "#0f172a", { transparency: 28, blur: 12 }],
                ["Ocean", "#0e7490", "#1e3a8a", { transparency: 19, blur: 25 }],
                [
                    "Violet",
                    "#8b5cf6",
                    "#ec4899",
                    { transparency: 13, blur: 24 },
                ],
                ["Minimal", "#fff", "#94a3b8", { transparency: 8, blur: 10 }],
                [
                    "Liquid",
                    "#34d399",
                    "#06b6d4",
                    { transparency: 15, blur: 31 },
                ],
            ];
            const $ = (x) => document.getElementById(x),
                rgb = (h) => {
                    h = h.slice(1);
                    let n = parseInt(h, 16);
                    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
                },
                rgba = (h, a) => {
                    let x = rgb(h);
                    return `rgba(${x[0]},${x[1]},${x[2]},${a})`;
                };
            function toast(x) {
                $("toast").textContent = x;
                $("toast").classList.add("show");
                setTimeout(() => $("toast").classList.remove("show"), 2000);
            }
            function apply(push = true) {
                if (push) {
                    stack.push(JSON.stringify(c));
                    if (stack.length > 30) stack.shift();
                    redoStack = [];
                }
                let o = $("card").style,
                    bg = rgba(c.tint, c.transparency / 100),
                    bd = rgba(c.borderColor, c.borderOpacity / 100),
                    sh = `${c.shadowX}px ${c.shadowY}px ${c.shadowBlur}px ${c.shadowBlur / 3}px ${rgba(c.shadowColor, c.shadowOpacity / 100)}`;
                o.setProperty("--glassbg", bg);
                o.setProperty("--glassborder", bd);
                o.setProperty("--bw", c.borderWidth + "px");
                o.setProperty("--radius", c.radius + "px");
                o.setProperty("--blur", c.blur + "px");
                o.setProperty("--sat", c.saturation + "%");
                o.setProperty("--bright", c.brightness + "%");
                o.setProperty("--shadow", sh);
                document
                    .querySelector(".card")
                    .style.setProperty(
                        "--reflection",
                        c.reflectionIntensity / 100,
                    );
                for (let k in c) {
                    let e = $(k);
                    if (e && e.type !== "color") e.value = c[k];
                    let v = $(k + "V");
                    if (v)
                        v.textContent =
                            c[k] +
                            ([
                                "transparency",
                                "borderOpacity",
                                "shadowOpacity",
                                "reflectionIntensity",
                            ].includes(k)
                                ? "%"
                                : "px");
                }
                $("tintV").textContent = c.tint;
                generate();
                localStorage.setItem("glass-config", JSON.stringify(c));
            }
            function generate() {
                let bg = rgba(c.tint, c.transparency / 100),
                    bd = rgba(c.borderColor, c.borderOpacity / 100),
                    sh = `${c.shadowX}px ${c.shadowY}px ${c.shadowBlur}px ${c.shadowBlur / 3}px ${rgba(c.shadowColor, c.shadowOpacity / 100)}`,
                    css = `.glass {\n  background: ${bg};\n  border: ${c.borderWidth}px solid ${bd};\n  border-radius: ${c.radius}px;\n  box-shadow: ${sh};\n  backdrop-filter: blur(${c.blur}px) saturate(${c.saturation}%) brightness(${c.brightness}%);\n  -webkit-backdrop-filter: blur(${c.blur}px) saturate(${c.saturation}%) brightness(${c.brightness}%);\n  overflow: hidden;\n}`;
                let vars = `:root {\n  --glass-bg: ${bg};\n  --glass-blur: ${c.blur}px;\n  --glass-border: ${bd};\n  --glass-radius: ${c.radius}px;\n  --glass-shadow: ${sh};\n}\n\n.glass { background: var(--glass-bg); border-radius: var(--glass-radius); backdrop-filter: blur(var(--glass-blur)); }`;
                let tw = `<div class="bg-white/[.${String(c.transparency).padStart(2, "0")}] border-white/[.${String(c.borderOpacity).padStart(2, "0")}] rounded-[${c.radius}px] backdrop-blur-[${c.blur}px]">\n  Your content\n</div>`;
                let react = `export function GlassCard({ children }) {\n  return <div className="glass">{children}</div>;\n}\n\n/* Generated CSS */\n${css}`;
                $("output").textContent = { css, vars, tailwind: tw, react }[
                    tabName
                ];
            }
            function tab(b) {
                document
                    .querySelectorAll(".tabs button")
                    .forEach((x) => x.classList.remove("active"));
                b.classList.add("active");
                tabName = b.dataset.tab;
                generate();
            }
            function preset(p) {
                Object.assign(c, D, p[3]);
                $("preview").style.background =
                    `linear-gradient(130deg,${p[1]},${p[2]},#0e7490)`;
                apply();
                toast(p[0] + " preset applied");
            }
            function randomize() {
                let p = P[Math.floor(Math.random() * P.length)];
                preset(p);
                c.transparency = 6 + Math.floor(Math.random() * 25);
                c.blur = 8 + Math.floor(Math.random() * 28);
                c.radius = 12 + Math.floor(Math.random() * 25);
                apply();
                toast("A fresh style was generated");
            }
            function reset() {
                c = { ...D };
                apply();
                toast("Reset completed");
            }
            function undo() {
                if (stack.length < 2) return;
                redoStack.push(stack.pop());
                c = JSON.parse(stack[stack.length - 1]);
                apply(false);
                toast("Undo");
            }
            function redo() {
                if (!redoStack.length) return;
                c = JSON.parse(redoStack.pop());
                apply();
                toast("Redo");
            }
            function copyCode() {
                navigator.clipboard
                    ?.writeText($("output").textContent)
                    .then(() => toast("CSS copied to clipboard"))
                    .catch(() => toast("Copy failed"));
            }
            function openSave() {
                $("modal").classList.add("open");
                $("name").focus();
            }
            function closeSave() {
                $("modal").classList.remove("open");
            }
            function savePreset() {
                let a = JSON.parse(localStorage.getItem("saved-glass") || "[]");
                a.push({
                    name: $("name").value || "Untitled glass",
                    config: c,
                });
                localStorage.setItem("saved-glass", JSON.stringify(a));
                closeSave();
                renderSaved();
                toast("Preset saved");
            }
            function renderSaved() {
                let a = JSON.parse(localStorage.getItem("saved-glass") || "[]");
                $("savedList").innerHTML = a.length
                    ? a
                          .map(
                              (x, i) =>
                                  `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #ffffff18;padding:10px 0"><b>${x.name}</b><span><button class="ghost" onclick="c={...D,...JSON.parse(localStorage.getItem('saved-glass'))[${i}].config};apply();toast('Preset loaded')">Load</button><button class="ghost" onclick="del(${i})">Delete</button></span></div>`,
                          )
                          .join("")
                    : "No saved glass yet. Create a style you love and save it here.";
            }
            function del(i) {
                let a = JSON.parse(localStorage.getItem("saved-glass"));
                a.splice(i, 1);
                localStorage.setItem("saved-glass", JSON.stringify(a));
                renderSaved();
                toast("Preset deleted");
            }
            function exportConfig() {
                let a = document.createElement("a");
                a.href = URL.createObjectURL(
                    new Blob([JSON.stringify(c, null, 2)], {
                        type: "application/json",
                    }),
                );
                a.download = "glass-config.json";
                a.click();
                toast("Configuration exported");
            }
            function changeCard(v) {
                $("ct").textContent = {
                    "Glass Card": "Frosted clarity.",
                    "Profile Card": "Meet your future.",
                    "Pricing Card": "Simple, elevated.",
                    Notification: "You are all caught up.",
                }[v];
            }
            function go(id) {
                $(id).scrollIntoView({ behavior: "smooth" });
            }
            document.querySelectorAll(".range,.color").forEach((e) =>
                e.addEventListener("input", () => {
                    let id = e.id;
                    c[id] = e.type === "color" ? e.value : Number(e.value);
                    if (id === "tint") $("tintText").value = e.value;
                    apply();
                }),
            );
            $("tintText").addEventListener("input", (e) => {
                if (/^#[\da-f]{6}$/i.test(e.target.value)) {
                    c.tint = e.target.value;
                    $("tint").value = e.target.value;
                    apply();
                }
            });
            $("preview").addEventListener("mousemove", (e) => {
                let r = e.currentTarget.getBoundingClientRect();
                $("glow").style.left = e.clientX - r.left + "px";
                $("glow").style.top = e.clientY - r.top + "px";
            });
            $("presetGrid").innerHTML = P.map(
                (p, i) =>
                    `<button class="preset" style="--p1:${p[1]};--p2:${p[2]}" onclick="preset(P[${i}])"><b>${p[0]}</b></button>`,
            ).join("");
            try {
                c = {
                    ...D,
                    ...JSON.parse(localStorage.getItem("glass-config")),
                };
            } catch {}
            apply(false);
            stack.push(JSON.stringify(c));
            renderSaved();
            document.addEventListener("keydown", (e) => {
                if (e.key.toLowerCase() === "r" && !e.shiftKey) randomize();
                if (e.key.toLowerCase() === "r" && e.shiftKey) reset();
                if ((e.ctrlKey || e.metaKey) && e.key === "z") {
                    e.preventDefault();
                    e.shiftKey ? redo() : undo();
                }
            });
