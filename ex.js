// List of verbs
var verbs = [
    ["Base form", "Past tense", "Past participle", "Translation"],
    ["abide", "abode", "abode", "demeurer"],
    ["awake", "awoke", "awoken", "(se) réveiller, aussi awake/awoke/awoke"],
    ["be", "was/were", "been", "être"],
    ["bear", "bore", "borne", "porter/supporter/soutenir"],
    ["beat", "beat", "beaten", "battre"],
    ["become", "became", "become", "become"],
    ["beget", "begat", "begotten", "engendrer, aussi beget/begot/begotten"],
    ["begin", "began", "begun", "commencer"],
    ["bend", "bent", "bent", "se courber, etc."],
    ["bereave", "bereft", "bereft", "déposséder/priver"],
    ["bring", "brought", "brought", "apporter"],
    ["build", "built", "built", "construire"],
    ["burn", "burnt", "burnt", "brûler"],
    ["burst", "burst", "burst", "éclater"],
    ["buy", "bought", "", "acheter"],
    ["cast", "cast", "cast", "jeter, etc."],
    ["catch", "caught", "caught", "attraper"],
    ["chide", "chid", "chidden", "gronder/réprimander, aussi chide/chid/chid"],
    ["choose", "chose", "chosen", "choisir"],
    ["cleave", "cleft", "cleft", "fendre/coller, aussi cleave/clove/clove"],
    ["cling", "clung", "clung", "se cramponner"],
    ["come", "came", "come", "venir"],
    ["cost", "cost", "cost", "coûter"],
    ["creep", "crept", "crept", "ramper/se glisser/se hérisser"],
    ["crow", "crew", "crowed", "chanter (un coq)/jubiler"],
    ["cut", "cut", "cut", "couper"],
    ["deal", "dealt", "dealt", "distribuer/traiter"],
    ["dig", "dug", "dug", "bêcher"],
    ["do", "did", "", "faire"],
    ["draw", "drew", "drawn", "tirer/dessiner"],
    ["dream", "dreamt", "dreamt", "rêver"],
    ["drink", "drank", "drunk", "boire"],
    ["drive", "drove", "driven", "conduire"],
    ["dwell", "dwelt", "dwelt", "habiter/rester"],
    ["eat", "ate", "eaten", "manger"],
    ["fall", "fell", "fallen", "tomber"],
    ["feed", "fed", "fed", "nourrir"],
    ["feel", "felt", "felt", "(se) sentir"],
    ["fight", "fought", "fought", "combattre"],
    ["find", "found", "found", "trouver"],
    ["...", "...", "...", "..."]
];
function saveVerbsToLocalStorage() {
    localStorage.setItem("verbs", JSON.stringify(verbs));
}

function loadVerbsFromLocalStorage() {
    const storedVerbs = localStorage.getItem("verbs");
    if (storedVerbs) {
        verbs = JSON.parse(storedVerbs);
    }
}


const VerbApp = {
    init() {
        this.tableBody = document.getElementById("verbsTable");
        this.setupEventListeners();
        this.populateTable();
        this.generateVerbLinks();
    },

    populateTable() {
        this.tableBody.innerHTML = "";

        verbs.slice(1).forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.className = index % 2 === 0 ? "row-jaune" : "row-white";

            row.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell || "N/A"; 
                tr.appendChild(td);
            });

            
            const actionTd = document.createElement("td");
            actionTd.innerHTML = `
                <input type="button" value="Edit" class="edit-btn">
                <input type="button" value="Update" class="update-btn" disabled>
                <input type="button" value="Delete" class="delete-btn">
            `;
            tr.appendChild(actionTd);
            this.tableBody.appendChild(tr);
        });

        saveVerbsToLocalStorage(); 
        this.updateStatistics();
    },

    setupEventListeners() {
        document.getElementById("add").addEventListener("click", this.addVerb.bind(this));
        document.getElementById("find").addEventListener("click", this.findVerb.bind(this));
        this.tableBody.addEventListener("click", this.handleTableActions.bind(this));
    },

    handleTableActions(e) {
        const target = e.target;
        const row = target.closest("tr");
        const rowIndex = Array.from(this.tableBody.children).indexOf(row);

        if (target.classList.contains("edit-btn")) {
            this.editRow(row);
        } else if (target.classList.contains("update-btn")) {
            this.updateRow(row, rowIndex);
        } else if (target.classList.contains("delete-btn")) {
            this.deleteRow(row, rowIndex);
        }
    },

    editRow(row) {
        const cells = row.querySelectorAll("td:not(:last-child)");
        cells.forEach((cell, index) => {
            const content = cell.textContent;
            if (index < 3) {
                cell.innerHTML = `<input type="text" value="${content}" style="width: 60px;">`;
            } else if (index === 3) { 
                cell.innerHTML = `<input type="text" value="${content}" style="width: 240px;">`;
            }
        });
        row.querySelector(".update-btn").disabled = false;
        row.querySelector(".edit-btn").disabled = true;
    },

    updateRow(row, rowIndex) {
        const cells = row.querySelectorAll("td:not(:last-child)");
        cells.forEach((cell, colIndex) => {
            const input = cell.querySelector("input");
            if (input) verbs[rowIndex + 1][colIndex] = input.value; 
            if (input) cell.textContent = input.value; 
        });

        row.querySelector(".update-btn").disabled = true;
        row.querySelector(".edit-btn").disabled = false;

        saveVerbsToLocalStorage(); 
    },

    deleteRow(row, rowIndex) {
        verbs.splice(rowIndex + 1, 1); 
        row.remove(); 
        saveVerbsToLocalStorage(); 
    },

    addVerb() {
        
        const newRow = document.createElement("tr");
        newRow.className = "row-white"; 
        const newInputs = ["Base Form", "Past Tense", "Past Participle", "Translation"].map(field => {
            const td = document.createElement("td");
            td.innerHTML = `<input type="text" placeholder="${field}" style="width: 100%;">`;
            newRow.appendChild(td);
            return td;
        });
    
      
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <input type="button" value="Add" class="add-row-btn">
            <input type="button" value="Cancel" class="cancel-row-btn">
        `;
        newRow.appendChild(actionTd);
        this.tableBody.appendChild(newRow);
    
     
        actionTd.querySelector(".add-row-btn").addEventListener("click", () => {
            const inputs = newInputs.map(td => td.querySelector("input").value.trim());
            
            if (inputs.some(input => !input)) {
                alert("All fields are required!");
                return;
            }
    
           
            verbs.push(inputs);
    
            
            verbs = [verbs[0]].concat(
                verbs.slice(1).sort((a, b) => a[0].localeCompare(b[0]))
            );
    
         
            this.populateTable();
            this.updateStatistics();
            this.generateVerbLinks(); 
        });
    
        
        actionTd.querySelector(".cancel-row-btn").addEventListener("click", () => {
            newRow.remove();
        });
    },    

    findVerb() {
        const searchVerb = document.getElementById("inputverb").value.trim().toLowerCase();
        const tableBody = document.getElementById("verbsTable");
    
        if (!searchVerb) {
            alert("Please enter a verb to search for.");
            return;
        }
    
       
        const rows = Array.from(tableBody.querySelectorAll("tr"));
    
        
        rows.forEach(row => row.style.backgroundColor = "");
    
        let foundIndex = -1;
    
        
        rows.forEach((row, index) => {
            const baseFormCell = row.children[0]; 
            if (baseFormCell.textContent.trim().toLowerCase() === searchVerb) {
                foundIndex = index;
            }
        });
    
        if (foundIndex !== -1) {
            const foundRow = rows[foundIndex];
    
            
            tableBody.insertBefore(foundRow, rows[0]);
    
            
            foundRow.style.backgroundColor = "red";
        } else {
            alert(`Verb "${searchVerb}" not found.`);
        }
    },
     

    generateVerbLinks() {
        const listContainer = document.querySelector(".list ul");
    
      
        const uniqueLetters = [...new Set(verbs.slice(1).map(v => v[0][0].toLowerCase()))].sort();
    
        listContainer.innerHTML = ""; 
    
        uniqueLetters.forEach(letter => {
            const li = document.createElement("li");
            li.innerHTML = `
                Here is a link to verbs that start with the letter 
                <a href="#" class="highlight-letter" data-letter="${letter}">${letter}</a>
            `;
        
            li.querySelector("a").addEventListener("click", e => {
                e.preventDefault();
                this.highlightVerbsByLetter(letter); 
    
                
                const firstVerb = document.querySelector(`#leftpanel .verb[data-letter="${letter}"]`);
                if (firstVerb) {
                    firstVerb.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
            listContainer.appendChild(li);
        });
    }
    ,
    
    
    highlightVerbsByLetter(letter) {
       
        const rows = this.tableBody.querySelectorAll("tr");
        rows.forEach(row => row.style.backgroundColor = "");
    
      
        verbs.slice(1).forEach((verb, index) => {
            if (verb[0][0].toLowerCase() === letter) {
                const row = this.tableBody.children[index];
                row.style.backgroundColor = "yellow";
            }
        });
    },
   
    updateStatistics() {
     
        const stats = {};
    
        
        verbs.slice(1).forEach(verb => {
            const firstLetter = verb[0][0].toLowerCase(); 
            stats[firstLetter] = (stats[firstLetter] || 0) + 1;
        });
    
       
        const result = Object.entries(stats)
            .sort(([a], [b]) => a.localeCompare(b)) 
            .map(([letter, count]) => `${letter.toUpperCase()}: ${count}`)
            .join(", ");
    
       
        const footer = document.querySelector("#rightpanel .footer");
    
        
        if (footer) {
            footer.style.backgroundColor = "red";
            footer.style.fontSize = "20px";
            footer.style.padding = "10px";
            footer.querySelector("p").textContent = `Statistics: ${result}`;
        }
    },
    
   
};


let body = document.getElementById("body");
        let leftpanel = document.getElementById("leftpanel");
        let rightpanel = document.getElementById("rightpanel");
        let verbtable = document.getElementById("verbtable");
        let btn1 = document.getElementById("btn1");
        let btn2 = document.getElementById("btn2");
        let btn3 = document.getElementById("btn3");
        let btn4 = document.getElementById('btn4');
        let bluebar = document.getElementById('bluebar');
        let thElements = document.querySelectorAll('th');
        let leftPosition = 0;
        let rightPosition = 60;

        leftpanel.style.position = "absolute";
        leftpanel.style.left = `${leftPosition}%`;
        leftpanel.style.top = "0";

        rightpanel.style.position = "absolute";
        rightpanel.style.left = `${rightPosition}%`;
        rightpanel.style.top = "0";

        let isPanel1Active = true; 1

        function swapPanels() {
            if (isPanel1Active) {
                leftPosition = 41;
                rightPosition = 0;
                isPanel1Active = false;
            } else {
                leftPosition = 0;
                rightPosition = 60;
                isPanel1Active = true;
            }
        
            leftpanel.style.transition = "left 0.3s ease";
            rightpanel.style.transition = "left 0.3s ease";
            leftpanel.style.left = `${leftPosition}%`;
            rightpanel.style.left = `${rightPosition}%`;
        }
        
        btn1.onclick = swapPanels;
        btn2.onclick = swapPanels;
        
        btn3.onclick = function() {
            leftPosition = 0;
            rightPosition = 98; 

            leftpanel.style.transition = "left 0.3s ease, width 0.3s ease";
            rightpanel.style.transition = "left 0.3s ease";
            thElements.forEach(function(th) {
            let currentWidth = window.getComputedStyle(th).width;
            let newWidth = parseFloat(currentWidth) * 2;
        
            th.style.width = `${newWidth}px`;
            });

            leftpanel.style.width = "163%";
            leftpanel.style.left = `${leftPosition}%`;
            btn3.hidden = true;
            btn4.hidden = false;
            rightpanel.style.left = `${rightPosition+0.1}%`;

        };

        btn4.onclick = function() {
            leftPosition = 0;
            rightPosition = 60;

            leftpanel.style.transition = "left 0.3s ease, width 0.3s ease";
            rightpanel.style.transition = "left 0.3s ease";

            let thElements = document.querySelectorAll('th');
            thElements.forEach(function(th) {
            th.style.width = ''; 
            });

            leftpanel.style.width = "100%";
            leftpanel.style.left = `${leftPosition}%`;

            rightpanel.style.left = `${rightPosition}%`;

            btn3.hidden = false;
            btn4.hidden = true;
};


loadVerbsFromLocalStorage();
window.onload = () => VerbApp.init();
