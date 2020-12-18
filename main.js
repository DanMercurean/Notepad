let notes = [];
let titels = [];

/**
 * open the input field "titel" 
 */
function showNote() {
    document.getElementById('showtitel').classList.remove('d-none');
    document.getElementById('showclose').classList.remove('d-none');
}

/**
 * close the input field "titel"  
 */
function closeNote() {
    document.getElementById('showtitel').classList.add('d-none');
    document.getElementById('showclose').classList.add('d-none');
}

/**
 * 
 */

function addNote() {
    let text = document.getElementById('message').value;
    let titel = document.getElementById('titel').value;
    notes.push(text);
    titels.push(titel);

    updateHTML();

    document.getElementById('message').value = '';
    document.getElementById('titel').value = '';
    saveNotes();
}

function updateHTML() {
    let mynotes = document.getElementById('mynotes');
    mynotes.innerHTML = '';
    for (let i = 0; i < notes.length; i++) {
        mynotes.innerHTML += `
        <div class = "note draggable">
            <div class = "delete-img"><b>${titels[i]}</b><br><a href="#" onclick='deleteNote(${i})'><img src="img/delete-property-16.png"></a></div>
            <div>${notes[i]}</div>
        </div>`;
    }
}


function loadNotes() {
    notes = getArray('notes');
    titels = getArray('titels');
    updateHTML();
}

function deleteNote(position) {
    titels.splice(position, 1);
    notes.splice(position, 1);
    updateHTML();
    saveNotes();
}

function saveNotes() {
    setArray('titels', titels);
    setArray('notes', notes);
}

function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function getArray(key) {
    return JSON.parse(localStorage.getItem(key));
}


/**
 * Draggable/Movable HTML elements  
 * */



// Alle Elemente mit der Klasse "draggable" werden verschiebbar gemacht
document.addEventListener("DOMContentLoaded", function () {
    "use strict"
    // Prüfen, welche Eventmodelle unterstützt werden und welches verwendet werden soll
    const pointer_event = ("PointerEvent" in window);
    const touch_event = ("TouchEvent" in window) && !pointer_event;
    // Klasse für verschiebbare Elemente
    const drag_class = "draggable";
    // Einige Variablen
    let posx, posy; // Pointerposition bei move
    let posx0, posy0; // Pointerposition bei down
    let startx, starty; // Position des Dragobjekts bei down
    let zmax = 100; // Start z-Index für die Dragelemente, muss evtl. angepasst werden
    let dragele = null; // Das aktuelle Dragelement
    // Bestimmen der Pointerposition
    function get_pointer_pos(e) {
        if (touch_event && e.targetTouches && e.targetTouches[0] && e.targetTouches[
            0].clientX) {
            posx = e.targetTouches[0].clientX;
            posy = e.targetTouches[0].clientY;
        } else if (e.clientX) {
            posx = e.clientX;
            posy = e.clientY;
        }
    } // get_pointer_pos
    //Eventhandler für pointerdown, touchstart oder mousedown
    function handle_down(e) {
        get_pointer_pos(e);
        down(e, posx, posy);
    } // handle_down
    //Eventhandler für pointermove, touchmove oder mousemove
    function handle_move(e) {
        get_pointer_pos(e);
        move(e, posx, posy);
    } // handle_move
    //Eventhandler für pointerup, touchend oder mouseup
    function handle_up(e) {
        up(e);
    } // handle_up
    //Eventhandler für keydown
    function handle_keydown(e) {
        const keyCode = e.keyCode;
        let xwert = 0,
            ywert = 0;
        if (keyCode && (keyCode == 27 || keyCode == 37 || keyCode == 38 || keyCode ==
            39 || keyCode == 40)) {
            let delta = e.shiftKey ? 10 : 1;
            down(e, 0, 0);
            switch (keyCode) {
                case 37: // links
                    xwert = -delta;
                    break;
                case 38: // rauf
                    ywert = -delta;
                    break;
                case 39: // rechts
                    xwert = delta;
                    break;
                case 40: // runter
                    ywert = delta;
                    break;
                case 27: // Escape
                    esc();
                    up(e);
                    return;
                    break;
            }
            move(e, xwert, ywert);
            up(e);
        }
    } // keydown
    // Auswahl des Dragelements und Start der Dragaktion
    function down(e, posx, posy) {
        const target = parent(e.target, drag_class);
        if (target) {
            document.body.style.touchAction = "none";
            e.preventDefault();
            dragele = target;
            startx = dragele.offsetLeft;
            starty = dragele.offsetTop;
            posx0 = posx;
            posy0 = posy;
            dragele.style.zIndex = ++zmax;
            dragele.focus();
        }
    } // down
    // Bewegen des Dragelements
    function move(e, posx, posy) {
        if (dragele) {
            e.preventDefault();
            dragele.style.left = (startx + posx - posx0) + "px";
            dragele.style.top = (starty + posy - posy0) + "px";
        }
    } // move
    // Ende der Aktion
    function up(e) {
        if (dragele) {
            dragele = null;
            document.body.style.touchAction = "auto";
        }
    } // up
    // Defokussieren bei ESC-Taste
    function esc() {
        if (dragele) dragele.blur();
    } // esc
    // Dragbares Element mit Tab-Index für die Fokussierbarkeit und Eventhandler für Unterdrückung der Standardaktion versehen
    function finish(ele) {
        ele.tabIndex = 0;
        if (!pointer_event) {
            ele.addEventListener("touchmove", function (e) {
                e.preventDefault()
            }, false);
        }
    } // finish
    // Vorfahrenelement mit Klasse classname suchen
    function parent(child, classname) {
        let ele = child;
        while (ele) {
            if (ele.classList && ele.classList.contains(classname)) return ele;
            else ele = ele.parentElement;
        }
        return null;
    } // parent
    // Alle Eventhandler notieren
    if (pointer_event) {
        document.body.addEventListener("pointerdown", handle_down, false);
        document.body.addEventListener("pointermove", handle_move, false);
        document.body.addEventListener("pointerup", handle_up, false);
    } else if (touch_event) {
        document.body.addEventListener("touchstart", handle_down, false);
        document.body.addEventListener("touchmove", handle_move, false);
        document.body.addEventListener("touchend", handle_up, false);
    } else {
        document.body.addEventListener("mousedown", handle_down, false);
        document.body.addEventListener("mousemove", handle_move, false);
        document.body.addEventListener("mouseup", handle_up, false);
    }
    document.body.addEventListener("keydown", handle_keydown, false);
    // finish für alle verschiebbaren Elemente aufrufen
    const draggable = document.querySelectorAll("." + drag_class);
    for (let i = 0; i < draggable.length; i++) {
        finish(draggable[i]);
    }

    // css-Angaben für die Bedienbarkeit
    const style = document.createElement('style');
    style.innerText = "." + drag_class + ":focus { outline: 2px solid blue; } " +
        "." + drag_class +
        " { position: absolute; cursor: move; touch-action: none; } ";
    document.head.appendChild(style);
    // finish für nachträglich erzeugte verschiebbare Elemente aufrufen
    new MutationObserver(function (mutationsList) {
        for (let i = 0; i < mutationsList.length; i++) {
            if (mutationsList[i].type === 'childList') {
                for (let j = 0; j < mutationsList[i].addedNodes.length; j++) {
                    if (mutationsList[i].addedNodes[j].classList && mutationsList[i].addedNodes[
                        j].classList.contains(drag_class)) {
                        finish(mutationsList[i].addedNodes[j]);
                    }
                }
            }
        }
    })
        .observe(document.body, {
            childList: true,
            subtree: true
        });
}, false); // DOMContentLoaded
// Ende drag_n_drop 