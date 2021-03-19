function MatrixModel() {
    BaseModel.call(this);
    this.attributes = {
        size: {
            width: 4,
            height: 4
        },
        grid: [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ]
    }

    var instance = this;
    MatrixModel = function () {
        return instance;
    }

    this.initFreeCellsArray();    
    this.base = 2;
    this.initCellsNumber = 2;
    this.addRandomValues(this.initCellsNumber);   
    // this.displayActionResults('left'); 
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function(key) {
    var i, j,
        grid = this.attributes.grid,
        size = this.attributes.size,
        isUniqueInRow,
        shouldCellMove,
        shouldCellMerge = false,
        values = [],
        currentCell,
        distance = 0,
        cellsBehind,
        buffer,
        newCell,
        lastSignificantCell;


    console.log(key);
    // this.addRandomValues(this.initCellsNumber);
    if (key === 'left') {
        for (i = 0; i < grid.length; i += 1) {
            for (j = 0; j < grid[i].length; j += 1) { 
                cellsBehind = size.width * i + j;
                if (j === 0) {
                    shouldCellMove = false;        
                }
                values.push({
                            value: grid[i][j],
                            shouldCellMove: shouldCellMove,
                            distance: distance,
                            shouldCellMerge: shouldCellMerge,
                            pairToMergeRef: null,
                            coords: [i, j]
                });
                currentCell = values[cellsBehind];
                if (currentCell.value === '') {
                    distance += 1;
                    currentCell.shouldCellMove = false;
                    shouldCellMove = true;
                }
                if (j > 0) {                    
                    if (currentCell.value !== '' && !currentCell.shouldCellMove) {
                        shouldCellMove = false;                      
                    }
                }
                

                if (lastSignificantCell) {
                   if (currentCell.value === lastSignificantCell.value) {
                    currentCell.shouldCellMerge = true;  
                    currentCell.shouldCellMove = true;                  
                    distance += 1;
                    currentCell.distance = distance;
                    currentCell.pairToMergeRef = lastSignificantCell;
                    // lastSignificantCell = currentCell;
                    // lastSignificantCell.pairToMergeRef = currentCell;
                    } 
                }
                

                if (currentCell.value !== '') {
                    lastSignificantCell = currentCell;
                }

                

                if (currentCell.shouldCellMove) {
                    grid[i][j] = '';                   
                    grid[i][j - currentCell.distance] = currentCell.value;
                    if (currentCell.shouldCellMerge) {
                        grid[i][j - currentCell.distance] = currentCell.value * this.base;
                    }
                }
                
                if (j === size.width - 1) {
                    distance = 0;
                    lastSignificantCell = null;
                }
                console.log(distance, currentCell.coords);
                
            }

        }

        console.log(values);
    }
    this.publish('changeData');
}

MatrixModel.prototype.startNewGame = function() {          
    this.clearMatrix();
    this.addRandomValues(this.initCellsNumber);               
    this.publish('changeData');
}

MatrixModel.prototype.addRandomValues = function(initCellsNumber) {
    var row, column, i, freeCellIndex, randomValue, value, 
        chance = 0.5, //first value drop chance
        randomRangeOffset = 1;

    var context = this;

    function getRandomFreeCellIndex() {   
        if (context.freeCellsCoords.length > 0) {
            return Math.round(Math.random() * (context.freeCellsCoords.length - 1));
        } else {            
            return -1;
        }
        
    }  

    for (i = 0; i < initCellsNumber; i += 1) {                
        freeCellIndex = getRandomFreeCellIndex();
        //in case if user will continue pushing arrow buttons after defeat
        if (freeCellIndex >= 0) {
           [row, column] = context.freeCellsCoords[freeCellIndex]; 
        } else {
            console.error('defeat!');
            return;
        }
        
        //generate some value to fill cell.                
        randomValue = Math.random();
        if (randomValue < chance) {
            value = Math.floor(randomValue + randomRangeOffset) * context.base;
        } else if (randomValue >= chance) {
            value = Math.ceil(randomValue + randomRangeOffset) * context.base;
        }
        
        context.attributes.grid[row][column] = value;        

        //delete 1 current item from freeCellsCoords array
        context.freeCellsCoords.splice(freeCellIndex, 1);
    } 
}

MatrixModel.prototype.clearMatrix = function() {
    //clearing cells
    for (i = 0; i < this.attributes.size.height; i += 1) {
        for (j = 0; j < this.attributes.size.width; j += 1) {
            this.attributes.grid[i][j] = '';
        }
    }
    this.initFreeCellsArray();
}

MatrixModel.prototype.initFreeCellsArray = function() {
    //Needed to detect defeat    
    this.freeCellsCoords = new Array(this.attributes.size.height * this.attributes.size.width);
    var i, j, cellCoords;
    for (i = 0; i < this.attributes.size.height; i += 1) {
        for (j = 0; j < this.attributes.size.width; j += 1) {
            cellCoords = [i, j];             
            this.freeCellsCoords[i * this.attributes.size.width + j] = cellCoords;
        }
    } 
    console.log(this.freeCellsCoords);
}

