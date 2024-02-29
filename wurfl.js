var dieCount=0; 
var ergebnisArray; 
var postedged; 
var row; 
var die; 
var revealCalledAfterEdge; 
var preEdge; 
var newSixCount; 
var revealDieCount; 
var feld; 
var numberOfRows; 
var diesInLastRow; 
 
function init() { 
	var feld = document.getElementById("wuerfelfeld");			 
	var len = feld.childNodes.length; 
	var sub = document.getElementById("sub"); 
	updatedice(-dieCount); 
	disableChangeButtons(0); 
	while (feld.firstChild) {											// entfernt alle Zellen aus dem Wuerfelbildraster 
		feld.removeChild(feld.firstChild); 
	} 
	while (sub.firstChild) { 
		sub.removeChild(sub.firstChild); 
	} 
	ergebnisArray = [];	 
	revealCalledAfterEdge = false; 
	postedged = false; 
	row = 0;															// resette die Zeilen- und Wuerfelindizes auf den Anfang fuer reveal() 
	die = 0; 
	document.getElementById("ergebnisfeld").innerHTML = null;			// leere und verstecke Anzeigefelder 
	document.getElementById("glitchanzeige").innerHTML = null; 
	document.getElementById("ergebnisfeld").className = "invisible"; 
	document.getElementById("glitchanzeige").className = "invisible"; 
	document.getElementById("preEdgeCheck").checked = false;			// entferne evtl. Haken im pre-Edge-Auswahlfeld 
	disableElement("postedge",1);										// deaktiviere nachedge-button 
	disableElement("preEdgeCheck",0);									// aktiviere pre-Edge-Auswahlfeld 
	disableElement("wuerfelbutton",0); 
	disableElement("dieRange",0); 
	numberOfNewSixes = 0; 
	var slider = document.getElementById("dieRange"); 
	var output = document.getElementById("anzahl"); 
	slider.value = 0; 
	output.innerHTML = slider.value; 
	slider.oninput = function() { 
		output.innerHTML = this.value; 
		dieCount = parseInt(this.value); 
	} 
} 
 
function updatedice(k) {
	dieCount = Math.max(dieCount + k,0); 
	document.getElementById("anzahl").innerHTML = dieCount;
	document.getElementById("dieRange").value = dieCount;
} 
 
function einzelwurf() { 
	rnd = Math.random(); 										// bestimmt Zufallszahl zw. 0 und 1 
	return Math.floor(rnd*6)+1;									// skaliert auf ganze Zufallszahl in [1,6] 
} 
 
function createDie(zahl) { 
	var wurfl = document.createElement("img"); 
	wurfl.setAttribute("src","images/"+String(zahl)+".png"); 	// bestimmt die richtige Bilddatei 
	wurfl.setAttribute("height","90px"); 						// setzt die Höhe der Bilddatei auf 60 Pixel 
	wurfl.setAttribute("width","90px");							// setzt die Breite der Bilddatei auf 60 Pixel 
	return wurfl; 
} 
 
function disableChangeButtons(i) { 
	var changeButtons = document.getElementsByClassName("change"); 
	var nrOfChangeButtons = changeButtons.length; 
	for (k=0;k<nrOfChangeButtons;k++) { 
		changeButtons[k].disabled = [false,true][i]; 
	} 
} 
 
function disableElement(id,i) { 
	document.getElementById(id).disabled = [false,true][i]; 
} 
 
function wurf() { 
	if (dieCount > 0) { 
		var feld = document.getElementById("wuerfelfeld"); 
		var wurfArray = [];												// erzeuge leeres Array, das später zur Matrix mit den Würfelergebnissen wird 
		disableChangeButtons(1); 
		disableElement("preEdgeCheck",1);								// deaktiviere alle interaktiven Elemente, werden von reveal() oder clearfield() wieder aktiviert 
		disableElement("clear",1); 
		disableElement("postedge",1); 
		disableElement("wuerfelbutton",1); 
		disableElement("dieRange",1); 
		preEdge = document.getElementById("preEdgeCheck").checked; 
		for (n=0;n<=dieCount-1;n++) { 
			var ergebnis = einzelwurf(); 
			var cell = document.createElement("td") 
			var wurfl = createDie(ergebnis); 
			if (n%5==0) { 												// beginnt bei jedem 5. Würfel eine neue Zeile im Würfelfeld 
				var row = document.createElement("tr");					// erzeuge neue Reihe im Würfelfeld 
				feld.appendChild(row);									// hänge neue Reihe am Würfelfeld an 
				var reihenindex = n/5; 
				wurfArray[reihenindex] = [];							// füge neue Reihe in Ergebnisarray ein 
			} 
			actualRow =	feld.childNodes[Math.floor(n/5)]				// bestimmt die aktuell zu beschreibende Zeile des Würfelfeldes 
			actualCell = actualRow.appendChild(cell);					// fügt erzeugte neue Zelle hinten an die aktuelle Reihe an 
			actualCell.appendChild(wurfl); 
			wurfArray[reihenindex][n%5] = ergebnis; 
		}		 
		aktualisiere(wurfArray); 
		revealDieCount = dieCount; 
		reveal(); 
		displayHits(); 
		check4glitch(); 
		if (preEdge) {													// Aufruf von initRuleOfSix falls Edge angeklickt wurde und sechsen gewürfelt wurden 
			var numberOfSixes = ergebnisArray.flat().filter(function sixes(wurf) {return wurf==6;}).length; 
			(numberOfSixes > 0) ? initRuleOfSix(numberOfSixes) : null; 
		} 
	} 
} 
 
function countsucc() { 
	return ergebnisArray.flat().filter(function succ(wurf) {return wurf > 4;}).length; 
} 
 
function aktualisiere(array) { 
	(postedged) ? ergebnisarray = array : ergebnisArray = ergebnisArray.concat(array); 
} 
 
function postedge() { 
	if (ergebnisArray.length != 0) { 
		disableChangeButtons(1) 
		disableElement("clear",1); 
		disableElement("postedge",1); 
		document.getElementById("ergebnisfeld").className="invisible"; 
		document.getElementById("glitchanzeige").className="invisible"; 
		row = 0; 
		die = 0; 
		var ergebnis 
		for (r=0;r<ergebnisArray.length;r++) { 
			for (c=0;c<ergebnisArray[r].length;c++) { 
				if (ergebnisArray[r][c] < 5) { 
					ergebnis = einzelwurf(); 
					ergebnisArray[r][c] = ergebnis; 
					wurfl = createDie(ergebnis); 
					actualRow = document.getElementById("wuerfelfeld").childNodes[r]; 
					actualCell = actualRow.childNodes[c]; 
					actualCell.className=("invisible"); 
					actualCell.removeChild(actualCell.childNodes[0]); 
					actualCell.appendChild(wurfl); 
				} 
			}			 
		} 
		postedged = true; 
		reveal(); 
		aktualisiere(ergebnisArray); 
		displayHits(); 
		check4glitch(); 
	} 
} 
 
function check4glitch() { 
	document.getElementById("glitchanzeige").innerHTML = null; 
	oneCount = 0 
	for (k=0;k<ergebnisArray.length;k++) { 
		oneCount += ergebnisArray[k].filter(function one(wurf) {return wurf == 1;}).length; 
		if (oneCount > dieCount/2) { 
			if (countsucc() == 0) { 
				document.getElementById("glitchanzeige").innerHTML = "Oooops.<br>Critical Glitch!"; 
			} else { 
				document.getElementById("glitchanzeige").innerHTML = "Glitch!"; 
			} 
		} 
	} 
} 
 
function displayHits() { 
	if (ergebnisArray.length > 0) { 
		hits = countsucc(); 
		if (hits == 1) { 
			document.getElementById("ergebnisfeld").innerHTML =  "1 Erfolg!" 
		} else { 
			document.getElementById("ergebnisfeld").innerHTML =  hits + " Erfolge!" 
		} 
	} 
} 
 
function initRuleOfSix(sixCount) { 
	var feld = document.createElement("table"); 
	var rerollSixesButton = document.createElement("input"); 
	newSixCount = sixCount; 
	function exec() { 
		execRuleOfSix(sixCount) 
	} 
	sub = document.getElementById("sub"); 
	rerollSixesButton.setAttribute("type","button"); 
	rerollSixesButton.setAttribute("value","6en nochmal ("+sixCount+"x)!"); 
	rerollSixesButton.setAttribute("class","sixReroll invisible"); 
	rerollSixesButton.onclick = exec; 
	feld.setAttribute("id","rerollfeld"); 
	feld.setAttribute("class","invisible"); 
	sub.appendChild(rerollSixesButton); 
	sub.appendChild(feld);	 
} 
 
function execRuleOfSix(sixCount) { 
	var row; 
	var reihenindex; 
	var feld = sub.childNodes[sub.childNodes.length-1];				// das neue Wuerfelfeld ist das letzte child von sub 
	var reRolls = []; 
	for (n=0;n<=sixCount-1;n++) { 
		var ergebnis = einzelwurf(); 
		var cell = document.createElement("td") 
		var wurfl = createDie(ergebnis); 
		if (n%5==0) { 												// beginnt bei jedem 5. Würfel eine neue Zeile im Würfelfeld 
			row = document.createElement("tr");						// erzeuge neue Reihe im Würfelfeld 
			actualRow = feld.appendChild(row);						// hänge neue Reihe am Würfelfeld an 
			reihenindex = n/5;							 
			reRolls[reihenindex] = [];								// füge neue Reihe in Ergebnisarray ein 
		} 
		actualCell = actualRow.appendChild(cell);					// fügt erzeugte neue Zelle hinten an die aktuelle Reihe an 
		actualCell.appendChild(wurfl);								// fuegt Wuerfelbild in Tabellenzelle ein 
		reRolls[reihenindex][n%5] = ergebnis; 
	} 
	aktualisiere(reRolls); 
	displayHits(); 
	newSixCount = reRolls.flat().filter(function sixes(wurf) {return wurf==6;}).length; 
	sub.childNodes[sub.childNodes.length-2].disabled = true; 
	revealDieCount = sixCount; 
	if (newSixCount>0) { 
		initRuleOfSix(newSixCount);		 
		initRevealReRoll(3); 
	} else { 
		initRevealReRoll(1); 
	} 
} 
 
 
function reveal() { 
	if (revealCalledAfterEdge || !postedged){												// Setzt eine Zeitverzoegerung fuer das erste reveal nach einem nachedgen 
		var feld = document.getElementById("wuerfelfeld"); 
		var numberOfRows = feld.childNodes.length; 
		var diesInLastRow; 
		var cell = feld.childNodes[row].childNodes[die]; 
		var visibilityIndex=0; 
		(cell.className=="visible") ? visibilityIndex=1 : cell.className="visible";			// macht die aktuelle Zelle sichtbar, oder markiert sie als sichtbar, wenn sie es bereits war 
		(revealDieCount%5==0) ? diesInLastRow = 5 : diesInLastRow = revealDieCount%5;		// bestimmt die Wuerfelanzahl in der letzten Reihe 
		 
		if (row<numberOfRows-1) {															// solange nicht in der letzten oder vorletzten Zeile 
			if (die<4) {																	// solange nicht der letzte Wuerfel in der Zeile 
				die++;																		// erhoehe die Wuerfelnummer und bleib in der selben Zeile 
			} else { 
				row++;																		// falls akuteller Wuerfel letzter in der Zeile ist: Zeilennr++, Wuerfelnr=0 
				die=0; 
			} 
			(visibilityIndex==1) ? reveal() : setTimeout("reveal()",300);					// falls Wuerfel bereits sichtbar rufe reveal() ohne Verzoegerung, sonst mit 
		} else if (die<diesInLastRow-1) { 
			die++; 
			(visibilityIndex==1) ? reveal() : setTimeout("reveal()",300); 
		} else { 
			document.getElementById("ergebnisfeld").className="visible"; 
			document.getElementById("glitchanzeige").className="visible"; 
			if (!postedged && !document.getElementById("preEdgeCheck").checked) { 
				disableElement("postedge",0); 
			} 
			if (sub.firstChild) { 
				sub.childNodes[sub.childNodes.length-2].className="sixReroll visible"; 
			} else { 
				disableElement("clear",0); 
			} 
		} 
	} else { 
		revealCalledAfterEdge = true; 
		setTimeout("reveal()",500); 
	} 
} 
 
function initRevealReRoll(index) { 
	die = 0; 
	row = 0; 
	document.getElementById("ergebnisfeld").className="invisible"; 
	feld = sub.childNodes[sub.childNodes.length-index]; 
	numberOfRows = feld.childNodes.length; 
	(revealDieCount%5==0 && revealDieCount>0) ? diesInLastRow = 5 : diesInLastRow = revealDieCount%5;			// bestimmt die Wuerfelanzahl in der letzten Reihe 
	revealReRoll(); 
} 
 
function revealReRoll() { 
	var cell = feld.childNodes[row].childNodes[die]; 
	var visibilityIndex=0; 
	cell.className="visible"; 
	if (row<numberOfRows-1) {															// solange nicht in der letzten oder vorletzten Zeile 
		if (die<4) {																	// solange nicht der letzte Wuerfel in der Zeile 
			die++;																		// erhoehe die Wuerfelnummer und bleib in der selben Zeile 
		} else { 
			row++;																		// falls akuteller Wuerfel letzter in der Zeile ist: Zeilennr++, Wuerfelnr=0 
			die=0; 
		} 
		setTimeout("revealReRoll()",300);												// rufe revealReRoll mit Verzoegerung 
	} else if (die<diesInLastRow-1) { 
		die++; 
		setTimeout("revealReRoll()",300); 
	} else { 
		document.getElementById("ergebnisfeld").className="visible"; 
		document.getElementById("glitchanzeige").className="visible";		 
		(newSixCount > 0) ? sub.childNodes[sub.childNodes.length-2].className="sixReroll visible" : disableElement("clear",0); 
	} 
}