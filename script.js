// Show Code Input Section
document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("code-input-section").classList.remove("hidden");
});

// Clear Code Editor
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("code-editor").value = "";
});

// Handle Navigation Between Phases
document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".phase").forEach((phase) => {
            phase.classList.add("hidden");
        });
        const selectedPhase = btn.getAttribute("data-phase");
        const phaseDiv = document.getElementById(selectedPhase);
        if (phaseDiv) {
            phaseDiv.classList.remove("hidden");
        }
    });
});

// Lexical Analysis
document.getElementById("analyze-tokens-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const tokens = tokenizeCode(code);
    displayTokens(tokens);
});

function tokenizeCode(code) {
    const tokenRegex = /\b(int|if|else|return)\b|[a-zA-Z_]\w*|[=;{}()<>+-/*]/g;
    const tokenTypes = {
        int: "Keyword",
        if: "Keyword",
        else: "Keyword",
        return: "Keyword",
        "=": "Operator",
        "+": "Operator",
        "-": "Operator",
        "*": "Operator",
        "/": "Operator",
        ">": "Operator",
        "<": "Operator",
        ";": "Delimiter",
        "{": "Delimiter",
        "}": "Delimiter",
        "(": "Delimiter",
        ")": "Delimiter",
    };

    const tokens = [];
    let match;
    while ((match = tokenRegex.exec(code)) !== null) {
        const value = match[0];
        const type = tokenTypes[value] || "Identifier";
        tokens.push({ value, type });
    }
    return tokens;
}

function displayTokens(tokens) {
    const outputDiv = document.getElementById("token-output");
    outputDiv.innerHTML = "";
    tokens.forEach((token) => {
        const el = document.createElement("div");
        el.textContent = `Value: ${token.value}, Type: ${token.type}`;
        outputDiv.appendChild(el);
    });
}

// Syntax Analysis
document.getElementById("generate-parse-tree-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const tree = generateParseTree(code);
    displayParseTree(tree);
});

function generateParseTree(code) {
    const lines = code.split("\n").filter((line) => line.trim() !== "");
    return {
        node: "Program",
        children: lines.map((line, i) => ({
            node: `Line ${i + 1}`,
            children: [{ node: line.trim() }],
        })),
    };
}

function displayParseTree(tree) {
    const output = document.getElementById("parse-tree-output");
    output.innerHTML = "";

    function createNode(node) {
        const el = document.createElement("div");
        el.className = "parse-tree-node";
        el.textContent = node.node || node;

        if (node.children) {
            const container = document.createElement("div");
            container.style.textAlign = "center";

            node.children.forEach((child) => {
                const arrow = document.createElement("div");
                arrow.className = "parse-tree-arrow";
                arrow.textContent = "↓";
                container.appendChild(arrow);
                container.appendChild(createNode(child));
            });

            el.appendChild(container);
        }

        return el;
    }

    output.appendChild(createNode(tree));
}

// Semantic Analysis
document.getElementById("check-semantics-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const errors = performSemanticAnalysis(code);
    displaySemanticErrors(errors);
});

function performSemanticAnalysis(code) {
    const errors = [];
    if (!code.includes("int")) {
        errors.push("Error: No variable declaration found.");
    }
    if (code.includes("/ 0")) {
        errors.push("Error: Division by zero.");
    }
    return errors;
}

function displaySemanticErrors(errors) {
    const output = document.getElementById("semantic-errors-output");
    output.innerHTML = errors.length ?
        errors.map(e => `<div>${e}</div>`).join("") :
        "No semantic errors detected!";
}

// Intermediate Code
document.getElementById("generate-ic-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const ic = generateIntermediateCode(code);
    displayIntermediateCode(ic);
});

function generateIntermediateCode(code) {
    const lines = code.split("\n").filter((l) => l.trim());
    return lines.map((line, i) => ({
        step: i + 1,
        instruction: line.trim(),
    }));
}

function displayIntermediateCode(instructions) {
    const tbody = document.querySelector("#ic-table tbody");
    tbody.innerHTML = "";
    instructions.forEach(({ step, instruction }) => {
        const row = `<tr><td>${step}</td><td>${instruction}</td></tr>`;
        tbody.innerHTML += row;
    });
}

// Code Optimization
document.getElementById("optimize-code-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const ic = generateIntermediateCode(code);
    const optimized = optimizeIntermediateCode(ic);
    displayOptimizationResults(ic, optimized);
});

function optimizeIntermediateCode(ic) {
    // Example: Remove duplicate lines or unnecessary GOTO
    return ic.filter(i => !i.instruction.includes("GOTO L2"));
}

function displayOptimizationResults(before, after) {
    const beforeTbody = document.querySelector("#before-optimization-table tbody");
    const afterTbody = document.querySelector("#after-optimization-table tbody");

    beforeTbody.innerHTML = "";
    afterTbody.innerHTML = "";

    before.forEach(({ step, instruction }) => {
        beforeTbody.innerHTML += `<tr><td>${step}</td><td>${instruction}</td></tr>`;
    });

    after.forEach(({ instruction }, i) => {
        afterTbody.innerHTML += `<tr><td>${i + 1}</td><td>${instruction}</td></tr>`;
    });
}

// Final Code Generation
document.getElementById("generate-final-code-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const optimized = optimizeIntermediateCode(generateIntermediateCode(code));
    const final = generateFinalCode(optimized);
    displayFinalCode(final);
});

function generateFinalCode(optimized) {
    const instructions = [];
    optimized.forEach(({ instruction }, i) => {
        if (instruction.includes("x = 10")) {
            instructions.push({ step: i + 1, machine: "MOV R1, #10" });
        } else if (instruction.includes("x = x - 1")) {
            instructions.push({ step: i + 1, machine: "SUB R1, R1, #1" });
        } else if (instruction.includes("IF")) {
            instructions.push({ step: i + 1, machine: "CMP R1, #cond" });
            instructions.push({ step: i + 2, machine: "JMP L1" });
        } else {
            instructions.push({ step: i + 1, machine: `EXEC ${instruction}` });
        }
    });
    return instructions;
}

function displayFinalCode(instructions) {
    const tbody = document.querySelector("#final-code-table tbody");
    tbody.innerHTML = "";
    instructions.forEach(({ step, machine }) => {
        const row = `<tr><td>${step}</td><td>${machine}</td></tr>`;
        tbody.innerHTML += row;
    });
}

function saveCodeToPHP(code) {
    fetch("save_code.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "code=" + encodeURIComponent(code),
        })
        .then((res) => res.text())
        .then((msg) => alert(msg))
        .catch((err) => console.error("Error saving code:", err));
}

document.getElementById("generate-ic-btn").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    saveCodeToPHP(code); // ✅ Save to MySQL
    const ic = generateIntermediateCode(code);
    displayIntermediateCode(ic);
});