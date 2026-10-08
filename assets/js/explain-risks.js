// Risk checks for the Explain page. No DOM access, so tests/explain.test.mjs
// can load it. Attaches window.ExplainRisks (globalThis.ExplainRisks in Node).
//
// The checks are a safety net, not a scanner. They must never say "this is
// safe" or "this only previews" about something that is not, so text is
// cleaned up the way PowerShell itself would read it before any rule runs.
(function (root) {
  "use strict";

  // Text copied from web pages and chat apps often has typographic dashes and
  // quotes. PowerShell treats them like - and ' and ", so the checks must too.
  function normalize(text) {
    let changed = 0;
    const swap = (to) => () => {
      changed++;
      return to;
    };
    const out = String(text ?? "")
      .replace(/[–—―−]/g, swap("-"))
      .replace(/[‘’‚‛]/g, swap("'"))
      .replace(/[“”„]/g, swap('"'))
      .replace(/ /g, swap(" "));
    return { text: out, changed };
  }

  // Drops comments (# to end of line, and <# ... #> blocks). With
  // blankStrings, also empties quoted strings, so text inside them (such as
  // '-WhatIf' in a message) cannot count as a parameter.
  function scrub(text, blankStrings) {
    let out = "";
    let quote = null;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quote) {
        if (ch === "`" && quote === '"') {
          if (!blankStrings) {
            out += ch + (text[i + 1] || "");
          }
          i++;
        } else if (ch === quote && text[i + 1] === quote) {
          if (!blankStrings) {
            out += ch + ch;
          }
          i++;
        } else if (ch === quote) {
          quote = null;
          out += ch;
        } else if (!blankStrings) {
          out += ch;
        }
        continue;
      }
      if (ch === "<" && text[i + 1] === "#") {
        const end = text.indexOf("#>", i + 2);
        i = end === -1 ? text.length : end + 1;
        out += " ";
      } else if (ch === "#" && (i === 0 || /[\s;|({]/.test(text[i - 1]))) {
        const end = text.indexOf("\n", i);
        i = end === -1 ? text.length : end - 1;
      } else {
        if (ch === "'" || ch === '"') {
          quote = ch;
        }
        out += ch;
      }
    }
    // A backtick at the end of a line continues it; anywhere else it is an
    // escape PowerShell ignores in a bare word, so ie`x is still iex.
    return out.replace(/`\r?\n/g, " ").replace(/`/g, "");
  }

  // Split on | and ; (and new lines) outside quotes, braces, and parentheses.
  function splitPipeline(text) {
    const segments = [];
    let current = "";
    let depth = 0;
    let quote = null;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quote) {
        current += ch;
        if (ch === quote) {
          quote = null;
        } else if (ch === "`" && quote === '"') {
          current += text[++i] || "";
        }
        continue;
      }
      if (ch === "'" || ch === '"') {
        quote = ch;
        current += ch;
      } else if (ch === "{" || ch === "(" || ch === "[") {
        depth++;
        current += ch;
      } else if (ch === "}" || ch === ")" || ch === "]") {
        depth = Math.max(0, depth - 1);
        current += ch;
      } else if (depth === 0 && (ch === "|" || ch === ";" || ch === "\n")) {
        if (ch === "|" && text[i + 1] === "|") {
          current += "||";
          i++;
          continue;
        }
        if (current.trim()) {
          segments.push({ text: current.trim(), piped: ch === "|" });
        }
        current = "";
      } else if (ch === "`" && text[i + 1] === "\n") {
        i++;
      } else {
        current += ch;
      }
    }
    if (current.trim()) {
      segments.push({ text: current.trim(), piped: false });
    }
    return segments;
  }

  // Matches a command name where a command can start (start of text, or after
  // | ; { ( & or the dot-source operator), so short aliases like rm or ri do
  // not match inside paths such as .\ri or words such as "form".
  function commandAt(names) {
    return new RegExp(`(^|[|;{(&\\n]|\\.\\s)\\s*(${names})(\\.exe)?(?=$|[\\s;|})])`, "im");
  }

  // A bare -WhatIf (or -WhatIf:$true) in code, not in a string or comment.
  function hasWhatIf(code) {
    return /(^|\s)-whatif(:\s*\$true)?(?=$|[\s;|})])/i.test(code);
  }

  const DOWNLOAD = /\b(iwr|irm|invoke-webrequest|invoke-restmethod|curl|wget|downloadstring|downloadfile|downloaddata|start-bitstransfer|net\.webclient)\b/i;
  const RUN_TEXT = /\b(iex|invoke-expression)\b|\|\s*&?\s*(powershell|pwsh)(\.exe)?\b|\[scriptblock\]::create/i;

  // level: high, medium, or info. whatIf: true when -WhatIf on the same step
  // really does stop the change.
  const RISKS = [
    {
      level: "high",
      text: "Downloads code from the internet and runs it immediately. Open the URL and read the script before you run anything like this.",
      test: (t) => DOWNLOAD.test(t) && RUN_TEXT.test(t),
    },
    { level: "high", text: "Invoke-Expression (iex) runs any text as code. It is how most copy-paste malware works.", test: (t) => /\b(iex|invoke-expression)\b/i.test(t) },
    {
      level: "high",
      text: "Sends text into a new PowerShell or Command Prompt to run as code.",
      test: (t) => /\|\s*&?\s*(powershell|pwsh|cmd)(\.exe)?\b/i.test(t),
    },
    {
      level: "high",
      text: "Turns text into code and runs it. That works just like Invoke-Expression.",
      test: (t) => /\[scriptblock\]::create|\.invokescript\s*\(|\$executioncontext\.invokecommand|\bnewscriptblock\b/i.test(t),
    },
    {
      level: "high",
      text: "Builds a command name from wildcards or pieces of other text so you cannot read it. Hiding the name like this is a common way to disguise Invoke-Expression.",
      test: (t) => /[&.]\s*\(\s*(gcm|get-command|gal|get-alias)\b[^)]*[*?]/i.test(t) || /\$(shellid|pshome|env:comspec)\s*\[\s*\d+\s*\]/i.test(t),
    },
    {
      level: "high",
      text: "Runs a hidden, encoded command. Legitimate instructions almost never need this; malware often does.",
      test: (t) => /(^|\s)-(ec|e(n(c(o(d(e(d(c(o(m(m(a(nd?)?)?)?)?)?)?)?)?)?)?)?)?)\s+['"]?[A-Za-z0-9+/=]{16,}/i.test(t),
    },
    {
      level: "high",
      text: "Downloads a file and then runs it. Only do this with a download you trust, from the publisher's own site.",
      test: (t) =>
        /-outfile\b|downloadfile|start-bitstransfer|\bcurl(\.exe)?\b[^|;\n]*\s-o\b|\bwget\b/i.test(t) &&
        (/\b(start-process|saps|invoke-item|msiexec)\b/i.test(t) ||
          commandAt("start|ii").test(t) ||
          /(^|[\s;|&])&?\s*['"]?\.?[\\/][^\s'"]+\.(exe|msi|bat|cmd|ps1|vbs|js|hta|scr)\b/i.test(t)),
    },
    {
      level: "high",
      text: "Uses a built-in Windows program that attackers often use to download or run code (mshta, certutil, rundll32, and similar). Fake \"verify you are human\" pages ask people to paste exactly this kind of line.",
      test: (t) => commandAt("mshta|rundll32|regsvr32|certutil|bitsadmin|wscript|cscript|installutil|msbuild|regasm|regsvcs|cmstp").test(t),
    },
    { level: "high", text: "Erases a disk or partition. Everything on it is gone.", test: (t) => /\b(format-volume|clear-disk|initialize-disk|remove-partition)\b/i.test(t) || commandAt("format|diskpart").test(t) },
    {
      level: "high",
      whatIf: true,
      text: "Deletes files or folders, or empties them. There is no recycle bin.",
      test: (t) =>
        commandAt("remove-item|ri|rm|del|erase|rd|rmdir|clear-content|clc").test(t) ||
        /\]::delete\s*\(/i.test(t) ||
        /\bcmd(\.exe)?\s+\/c\s+(del|erase|rd|rmdir)\b/i.test(t),
      extra: (t) => [
        /(^|\s)-r(e(c(u(r(se?)?)?)?)?)?(?=$|[\s;|})])|(^|\s)\/s\b/i.test(t) ? "-Recurse means everything inside folders goes too." : "",
        /(^|\s)-fo(r(ce?)?)?(?=$|[\s;|})])|(^|\s)\/[fq]\b/i.test(t) ? "-Force also deletes hidden and read-only files without asking." : "",
      ],
    },
    {
      level: "high",
      text: "Turns off part of Microsoft Defender antivirus, or tells it to stop scanning something.",
      test: (t) => /\b(set|add)-mppreference\b[^|;\n]*-(disable|exclusion)/i.test(t),
    },
    {
      level: "high",
      text: "Turns off Windows Firewall.",
      test: (t) => /\bset-netfirewallprofile\b[^|;\n]*-enabled\s+(\$?false|0)\b/i.test(t) || /\bnetsh\b[^|;\n]*\bstate\s+off\b/i.test(t),
    },
    {
      level: "high",
      text: "Turns off the script-safety check for this computer or user. See the execution policy guide.",
      test: (t) => /\bset-executionpolicy\b[^|;\n]*\b(unrestricted|bypass)\b/i.test(t),
    },
    {
      level: "medium",
      text: "Skips the script-safety check for this one run.",
      test: (t) => /(^|\s)-(ep|ex|exe|exec\w*)\s+['"]?(bypass|unrestricted)\b/i.test(t) && !/\bset-executionpolicy\b/i.test(t),
    },
    {
      level: "high",
      text: "Creates a user account, changes one, or adds someone to a local group (possibly Administrators).",
      test: (t) => /\b(new-localuser|set-localuser|enable-localuser|add-localgroupmember)\b/i.test(t) || /\bnet(\.exe)?\s+(user|localgroup)\b[^|;\n]*\s\/add\b/i.test(t),
    },
    {
      level: "high",
      text: "Deletes backups or restore points, or changes how Windows starts. Ransomware does this before it encrypts files.",
      test: (t) =>
        /\b(vssadmin|wbadmin)\b[^|;\n]*\bdelete\b|\bwmic\b[^|;\n]*\bshadowcopy\b[^|;\n]*\bdelete\b|\bbcdedit\b|\b(disable-computerrestore|remove-computerrestorepoint)\b/i.test(t),
    },
    {
      level: "medium",
      whatIf: true,
      text: "Changes the Windows registry. Wrong values can break programs or Windows itself.",
      test: (t) => /\b(remove-itemproperty|set-itemproperty|new-itemproperty)\b|\breg(\.exe)?\s+(add|delete|import)\b|\b(hklm|hkcu):/i.test(t),
    },
    {
      level: "medium",
      text: "Sets something to run automatically later, at sign-in, or as a service.",
      test: (t) => /\b(register-scheduledtask|new-service)\b|\bschtasks(\.exe)?\s+\/create\b|currentversion\\run/i.test(t),
    },
    { level: "medium", text: "Asks Windows for administrator rights (the UAC prompt). Whatever runs next can change anything on the computer.", test: (t) => /-verb\s+['"]?runas\b/i.test(t) },
    { level: "medium", whatIf: true, text: "Shuts down or restarts the computer. Save your work first.", test: (t) => /\b(stop-computer|restart-computer)\b/i.test(t) || commandAt("shutdown").test(t) },
    { level: "medium", whatIf: true, text: "Closes running programs. Unsaved work in them is lost.", test: (t) => commandAt("stop-process|kill|spps|taskkill").test(t) },
    {
      level: "medium",
      whatIf: true,
      text: "Stops or reconfigures a Windows service. Something may stop working until it is started again.",
      test: (t) => /\b(stop-service|set-service)\b/i.test(t) || /\bsc(\.exe)?\s+(stop|delete|config)\b/i.test(t),
    },
    { level: "medium", whatIf: true, text: "Empties the recycle bin for good.", test: (t) => /\bclear-recyclebin\b/i.test(t) },
    {
      level: "medium",
      whatIf: true,
      text: "Writes to a file and replaces whatever was in it.",
      test: (t) => /\b(set-content|out-file|export-csv)\b(?![^|;]*-append)|(^|[^2-9>])>(?!>)/i.test(t),
    },
    { level: "medium", whatIf: true, text: "Moves items. The originals are no longer where they were.", test: (t) => commandAt("move-item|mi|mv|move").test(t) },
  ];

  // Everything the page needs: the risks found, whether -WhatIf really makes
  // every risky step a preview, and how many characters were cleaned up.
  function assess(input) {
    const { text: normalized, changed } = normalize(input);
    const text = scrub(normalized, false);
    const segments = splitPipeline(text).map((s) => ({ ...s, code: scrub(s.text, true) }));

    const found = [];
    for (const rule of RISKS) {
      if (rule.test(text)) {
        const extra = rule.extra ? rule.extra(text).filter(Boolean).join(" ") : "";
        found.push({ level: rule.level, text: extra ? `${rule.text} ${extra}` : rule.text, rule });
      }
    }

    // Only a preview when every risk can be stopped by -WhatIf, and every
    // step that triggers one has its own bare -WhatIf.
    let previewOnly = found.length > 0 && found.every((f) => f.rule.whatIf);
    if (previewOnly) {
      for (const f of found) {
        const steps = segments.filter((s) => f.rule.test(s.text));
        if (!steps.length || steps.some((s) => !hasWhatIf(s.code))) {
          previewOnly = false;
        }
      }
    }

    const risks = found.map(({ level, text: message }) => ({ level, text: message }));
    if (previewOnly) {
      risks.push({ level: "info", text: "Good news: every step that changes something has -WhatIf, so this run only previews. Remove -WhatIf to make the changes." });
    }
    return { risks, previewOnly, changed, normalized };
  }

  root.ExplainRisks = { normalize, scrub, splitPipeline, assess, hasWhatIf };
})(typeof window !== "undefined" ? window : globalThis);
