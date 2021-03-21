var grid = [
        ['2', '2', '2', '2'],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ];

var i, j;
var turnedArray = new Array(grid.length);      
    for (i = 0; i < grid.length; i += 1) {          
        for (j = 0; j < grid[i].length; j += 1) {
            turnedArray[i] = grid[i].slice(0);
            // turnedArray[i][j] = grid[i][j];
            turnedArray[i][j] = grid[j][i];
            // turnedArray[0][3] = '4';
            console.log(`grid[${j}][${i}] = ${grid[j][i]}`);
            console.log(`turnedArray[${i}][${j}] = ${turnedArray[i][j]}`);
            console.log(turnedArray);
        }
    }