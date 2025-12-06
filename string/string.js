
let str = 'Aditya Kumar';
console.log('String Length:', str.length); // Output: 13

console.log('Character at index 0:', str.charAt(0)); // Output: 'A'
console.log('Character code at index 0:', str.charCodeAt(0)); // Output: 65

console.log('Substring (0, 6):', str.substring(0, 6)); // Output: 'Aditya'
console.log('Slice (0, 6):', str.slice(0, 6)); // Output: 'Aditya'

console.log('Index of "Kumar":', str.indexOf('Kumar')); // Output: 7
console.log('Last index of "a":', str.lastIndexOf('a')); // Output: 10

console.log('To Upper Case:', str.toUpperCase()); // Output: 'ADITYA KUMAR'
console.log('To Lower Case:', str.toLowerCase()); // Output: 'aditya kumar'

console.log('Trimmed String:', '   Hello World!   '.trim()); // Output: 'Hello World!'

console.log('Replace "Kumar" with "Singh":', str.replace('Kumar', 'Singh')); // Output: 'Aditya Singh'

console.log('Split by space:', str.split(' ')); // Output: ['Aditya', 'Kumar']

// Template Literals
let name = 'Aditya';
let greeting = `Hello, ${name}! Welcome to JavaScript.`;
console.log(greeting); // Output: 'Hello, Aditya! Welcome to JavaScript.'

// Escape Sequences
let multiLineStr = 'This is line 1.\nThis is line 2.\nThis is line 3.';
console.log(multiLineStr);

// Unicode Example
let unicodeStr = '\u0041\u0044\u0049\u0054\u0059\u0041'; // ADITYA
console.log('Unicode String:', unicodeStr); // Output: 'ADITYA'

// Function to demonstrate string manipulation
function reverseString(s) {
    let r = '';
    for (let i = s.length - 1; i >= 0; i--) {
        r += s[i];
    }
    return r;
}
console.log('Reversed String:', reverseString(str)); // Output: 'ramuK aytidA'

// Additional Examples
function asciiTable() {
    let table = '';
    for (let i = 32; i < 127; i++) {
        table += `${i}: ${String.fromCharCode(i)}\n`;
    }
    return table;
}
console.log('ASCII Table:\n', asciiTable());

// Example of padding
let paddedStr = '5';
console.log('Padded Start:', paddedStr.padStart(3, '0')); // Output: '005'
console.log('Padded End:', paddedStr.padEnd(3, '0')); // Output: '500'

// Example of includes
console.log('Includes "Kumar":', str.includes('Kumar')); // Output: true
console.log('Starts with "Adi":', str.startsWith('Adi')); // Output: true
console.log('Ends with "mar":', str.endsWith('mar')); // Output: true

// Example of repeat
let repeatStr = 'Ha! ';
console.log('Repeated String:', repeatStr.repeat(3)); // Output: 'Ha! Ha! Ha! '        
// Example of raw strings
let rawStr = String.raw`C:\Development\profile\aboutme.html`;
console.log('Raw String:', rawStr); // Output: 'C:\Development\profile\aboutme.html'    
// Example of searching
console.log('Search "Kumar":', str.search('Kumar')); // Output: 7           
console.log('Match "a":', str.match(/a/g)); // Output: ['a', 'a']   
// Example of localeCompare
let str1 = 'apple';
let str2 = 'banana';
console.log('Locale Compare:', str1.localeCompare(str2)); // Output: -1 (apple comes before banana) 

// Example of normalization
let accentedStr = 'café';
let normalizedStr = accentedStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
console.log('Normalized String:', normalizedStr); // Output: 'cafe'
// Example of charAt and charCodeAt
console.log('Character at index 2:', str.charAt(2));
console.log('Character code at index 2:', str.charCodeAt(2));

// Example of valueOf
console.log('Value of string object:', new String('Hello').valueOf());
console.log("+++", { id: 1, name: "Aditya" }.valueOf());
// Example of toString
console.log('String object toString:', new String('World').toString());
