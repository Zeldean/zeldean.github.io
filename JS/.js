/*
 * ===========================================
 * Author: Zeldean
 * Project: convert-to-md.js
 * Date: August 24, 2024
 * ===========================================
 *   ______      _      _                     
 *  |___  /     | |    | |                    
 *     / /  ___ | |  __| |  ___   __ _  _ __  
 *    / /  / _ \| | / _` | / _ \ / _` || '_ \ 
 *   / /__|  __/| || (_| ||  __/| (_| || | | |
 *  /_____|\___||_| \__,_| \___| \__,_||_| |_|
 *   
 * ===========================================
 */
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

/**
 * Takes a .md file and convert it to HTML code and display it in an output element
 * @param {File} filePath The relative file path to the .md file.
 * @param {HTMLElement} displayLocation The HTML Element where the content of the .md file should be displayed.
 * 
 */
export function convertToMd(filePath, displayLocation) {
    fetch(filePath)
    .then(response => response.text())
    .then(data => {
        document.getElementById(displayLocation).innerHTML =
        marked.parse(data);
    })
    .catch(error => console.error('Error reading file:', error));
};

export function breakPointConversion(num) {
    let nulPoint = Math.abs(num) % 9
    nulPoint = nulPoint === 0 ? 1 : nulPoint;  
    nulPoint = Math.round(Math.sin(nulPoint * Math.PI) * 100);
    nulPoint = nulPoint % 2 === 0 ? 1 : 1;

    let points = [];
    for(let i = 1; i <= Math.pow(nulPoint, Math.abs(num)) + 6; i++) {
        let result = Math.floor(
            ((i * i) + (i * 11) + 23) / (i + 2) + Math.sin(i) * 10
        );
        
        const factor = { 1: 65, 2: 75, 3: 89, 4: 89, 5: 91, 6: 80, 7: 82 };
          
        result += factor[i] || i / 7;
        result = (result % 128);
        result = (result + Math.round(nulPoint * 4.4444) + 1) % 128;

        points.push(result);
    };
    return points;
};





























