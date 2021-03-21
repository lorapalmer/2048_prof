function MatrixModel() {
    BaseModel.call(this);
    this.attributes = {
        size: {
            width: 4,
            height: 4
        },    
        // grid: [
        //     ['', '', '', ''],
        //     ['', '', '', ''],
        //     ['', '', '', ''],
        //     ['', '', '', '']
        // ]
        grid: [
            ['2', '2', '2', '2'],
            ['2', '2', '2', '2'],
            ['2', '2', '2', '2'],
            ['2', '2', '2', '']
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
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function(key) {
    var i, j, k,
        grid = this.attributes.grid,
        size = this.attributes.size,        
        shouldNextCellMove = false,
        shouldCellMerge = false,        
        currentCell,
        distance = 0,        
        lastSignificantCell,
        occupiedCellIndex = -1,
        lastColumnIndex,
        context = this,
        destinationColumn;           

    invertMatrix = function() {                
        for (i = 0; i < grid.length; i += 1) {          
            for (j = i + 1; j < grid.length; j += 1) {
                k = grid[i][j];                
                grid[i][j] = grid[j][i];                
                grid[j][i] = k;                
            }
        }
    }

    createCell = function(row, column){                
        var cell = {
            value: grid[row][column],
            shouldCellMove: shouldNextCellMove,
            distance: distance,
            shouldCellMerge: shouldCellMerge
        }

        if (cell.value === '') {
            distance += 1;
            cell.shouldCellMove = false;
            shouldNextCellMove = true;
        }                

        if (lastSignificantCell) {
            if (cell.value === lastSignificantCell.value && !lastSignificantCell.shouldCellMerge) {
                cell.shouldCellMerge = true;
                distance += 1;
                cell.distance = distance;
                shouldNextCellMove = true;
                cell.shouldCellMove = shouldNextCellMove;
            } 
        }
        
        if (cell.value !== '') {
            lastSignificantCell = cell;
        }

        return cell;
    }

    getFreeCellIndex = function(row, destinationColumn, isMatrixTurned) {
        //search for the index of the coordinates of the cell that will be occupied                                        
        for (k = 0; k < context.freeCellsCoords.length; k += 1) {
            if (context.freeCellsCoords[k][0] === row && context.freeCellsCoords[k][1] === destinationColumn && !isMatrixTurned) {
                return k;
            } else if (context.freeCellsCoords[k][0] === destinationColumn && context.freeCellsCoords[k][1] === row && isMatrixTurned) {
                return k;
            } 
        }
        return -1;
    }
        
    moveCell = function(row, column, direction, isMatrixTurned) {                
        currentCell = createCell(row, column);
                       
        if (currentCell.shouldCellMove === true) {
            grid[row][column] = '';
            if (isMatrixTurned) {
                context.freeCellsCoords.push([column, row]);
            } else {
                context.freeCellsCoords.push([row, column]); 
            }                        
            destinationColumn = direction === 'left' ? column - currentCell.distance : column + currentCell.distance;            
            grid[row][destinationColumn] = currentCell.value;                                       
            
            occupiedCellIndex = getFreeCellIndex(row, destinationColumn, isMatrixTurned);

            if (occupiedCellIndex !== -1) {
                context.freeCellsCoords.splice(occupiedCellIndex, 1);
                occupiedCellIndex = -1;                        
            }                                        

            if (currentCell.shouldCellMerge) {
                grid[row][destinationColumn] = String(currentCell.value * context.base);
            }
        }
        
        lastColumnIndex = direction === 'left' ? size.width - 1 : 0;

        if (column === lastColumnIndex) {
            distance = 0;
            lastSignificantCell = null;
        }        
    }
        
    switch (key) {
        case 'left':                        
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {                                 
                    moveCell(i, j, 'left');
                }
            }        
            break;
        case 'right':
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    moveCell(i, j, 'right');
                }
            }
            break;
        case 'up':  
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {
                    moveCell(i, j, 'left', true);
                }
            }            
            invertMatrix();
            break;
        case 'down':
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    moveCell(i, j, 'right', true);
                }
            }
            invertMatrix();
            break;                   
        default:
            console.error('wrong direction value!');
            break;
    }    
    this.addRandomValues(this.initCellsNumber);
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
        //no more free cells
        } else if (i === 0) {
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
        
        context.attributes.grid[row][column] = String(value);        

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
    this.freeCellsCoords = new Array();
    var i, j, cellCoords;    
    for (i = 0; i < this.attributes.size.height; i += 1) {
        for (j = 0; j < this.attributes.size.width; j += 1) {                        
            if (this.attributes.grid[i][j] === '') {                
                cellCoords = [i, j];
                this.freeCellsCoords.push(cellCoords);
            }             
        }
    }                   
}
