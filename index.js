function compareJsonStructure(structure, jsonData, path = '') {
    const mismatches = [];

    const getType = (value) => {
        if (Array.isArray(value)) return 'array';
        if (value === null) return 'null';
        return typeof value;
    };

    const compare = (struct, data, currentPath) => {
        const dataType = getType(data);

        // If the structure is an array (like ["string"]), check the type inside the array
        if (Array.isArray(struct)) {
            if (dataType !== 'array') {
                mismatches.push(currentPath || 'root');
                return;
            }
            if (data.length > 0) {
                struct.forEach((expectedType) => {
                    data.forEach((item, index) => {
                        compare(expectedType, item, `${currentPath}[${index}]`);
                    });
                });
            }
        } 
        // If the structure is an object, iterate through its keys
        else if (typeof struct === 'object' && struct !== null) {
            if (dataType !== 'object') {
                mismatches.push(currentPath || 'root');
                return;
            }
            for (const key in struct) {
                if (data.hasOwnProperty(key)) {
                    compare(struct[key], data[key], `${currentPath ? currentPath + '.' : ''}${key}`);
                } else {
                    mismatches.push(`${currentPath ? currentPath + '.' : ''}${key} is missing`);
                }
            }
        } 
        // Check for basic type mismatches (string, number, boolean, etc.)
        else if (dataType !== struct) {
            mismatches.push(currentPath || 'root');
        }
    };

    compare(structure, jsonData, path);
    return mismatches.length > 0 ? mismatches : 'No mismatches found';
}
function getJsonStructure(jsonObj) {
    const getType = (value) => {
        if (Array.isArray(value)) return 'array';
        if (value === null) return 'null';
        return typeof value;
    };

    const objectsEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

    const getUniqueArrayTypes = (arr) => {
        const typeSet = new Set();
        let allObjectsSame = true;
        let firstObjStructure = null;

        arr.forEach((item, index) => {
            const itemStructure = getStructure(item);

            // Check if all objects have the same structure
            if (index === 0) {
                firstObjStructure = itemStructure;
            } else if (!objectsEqual(firstObjStructure, itemStructure)) {
                allObjectsSame = false;
            }

            typeSet.add(JSON.stringify(itemStructure));
        });

        if (allObjectsSame && firstObjStructure !== null) {
            return [firstObjStructure];  // Return a single example if all items are the same
        }

        return Array.from(typeSet).map(item => JSON.parse(item));
    };

    const getStructure = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return getType(obj);
        }

        if (Array.isArray(obj)) {
            const arrayTypes = getUniqueArrayTypes(obj);
            return arrayTypes.length === 1 ? [arrayTypes[0]] : arrayTypes;
        }

        const structure = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                structure[key] = getStructure(obj[key]);
            }
        }
        return structure;
    };

    return getStructure(jsonObj);
}
document.getElementById('getStructureBtn').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        const parsedJson = JSON.parse(jsonInput);
        const structure = getJsonStructure(parsedJson); 
        document.getElementById('jsonStructure').value = JSON.stringify(structure, null, 2);
    } catch (error) {
        alert('Invalid JSON input. Please check your JSON syntax.');
    }
});

document.getElementById('copyBtn').addEventListener('click', function() {
    const jsonStructure = document.getElementById('jsonStructure');
    jsonStructure.select();
    jsonStructure.setSelectionRange(0, 99999); 
    document.execCommand('copy');
    const copyMessage = document.getElementById('copyMessage');
    copyMessage.style.opacity = 1;
    setTimeout(() => {
        copyMessage.style.opacity = 0;
    }, 1500);
});
document.getElementById('compareBtn').addEventListener('click', function() {
    const structureInput = document.getElementById('structureInput').value;
    const dataInput = document.getElementById('dataInput').value;

    try {
        const parsedStructure = JSON.parse(structureInput);
        const parsedData = JSON.parse(dataInput);
        const comparisonResult = compareJsonStructure(parsedStructure, parsedData); 
        const resultList = document.getElementById('resultList');
        resultList.innerHTML = ''; 
        if (Array.isArray(comparisonResult)) {
            comparisonResult.forEach((result) => {
                const li = document.createElement('li');
                li.textContent = result;
                resultList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No mismatches found';
            resultList.appendChild(li);
        }
    } catch (error) {
        alert('Invalid JSON input or structure. Please check your syntax.');
    }
});
function refreshPage() {
    location.reload(); 
}
document.getElementById('refreshBtn').addEventListener('click', refreshPage);

function showConsoleMessage() {
    const message = [
        "Hi there!...",
        "for any queries please contact me. :)"
    ];
    console.log(message.join('\n'));
}

const checkConsoleOpen = () => {
    const startTime = new Date().getTime();
    const checkTime = () => {
        const endTime = new Date().getTime();
        if (endTime - startTime > 100) {
            showConsoleMessage(); 
        } else {
            setTimeout(checkTime, 100);
        }
    };
    checkTime();
};

checkConsoleOpen();
