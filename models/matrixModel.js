function MatrixModel() {
    BaseModel.call(this); 
    this.summaryModel = new SummaryModel();
    createMatrix = function(height, width) {
        var newMatrix = new Array(height);
        for (var i = 0; i < newMatrix.length; i += 1) {
            newMatrix[i] = new Array(width);
            for (var j = 0; j < newMatrix[i].length; j += 1) {
                newMatrix[i][j] = '';
            }
        }        
        return newMatrix;
    }
    this.attributes = {
        size: {
            width: 4,
            height: 4
        }              
    }
    this.attributes.grid = createMatrix(this.attributes.size.height, this.attributes.size.width);
    console.table(this.attributes.grid);        

    var instance = this;
    MatrixModel = function () {
        return instance;
    }

    this.canContinue = true;
    this.initFreeCellsArray();    
    this.base = 2;
    this.initCellsNumber = 2;
    this.afterMoveCellsNumber = 1;
    this.addRandomValues(this.initCellsNumber);     
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function(key) {
    var i, j, k,
        grid = this.attributes.grid,
        size = this.attributes.size,        
        shouldNextCellMove = false,                        
        distance = 0,        
        lastSignificantCellProps,
        occupiedCellIndex = -1,
        lastColumnIndex,
        context = this,
        destinationColumn,
        newCell,
        didCellsMove = false;

    invertMatrix = function() {                
        for (i = 0; i < grid.length; i += 1) {          
            for (j = i + 1; j < grid.length; j += 1) {
                k = grid[i][j];                
                grid[i][j] = grid[j][i];                
                grid[j][i] = k;                
            }
        }
    }

    updateFreeCellsArray = function(row, column, destinationColumn, isMatrixTurned) {
        if (isMatrixTurned) {
            context.freeCellsCoords.push([column, row]);
        } else {
            context.freeCellsCoords.push([row, column]); 
        }                                                
        occupiedCellIndex = getFreeCellIndex(row, destinationColumn, isMatrixTurned);
        //when the cells should merge, then the second no longer needs to occupy a new cell
        if (occupiedCellIndex !== -1) {
            context.freeCellsCoords.splice(occupiedCellIndex, 1);
            occupiedCellIndex = -1;                        
        }
    }

    function Cell(row, column) {
        this.properties = {
            value: grid[row][column],
            shouldCellMove: shouldNextCellMove,
            distance: distance,
            shouldCellMerge: false,
            coords: [row, column]
        }
        var cellProps = this.properties;

        if (cellProps.value === '') {
            distance += 1;
            cellProps.shouldCellMove = false;
            shouldNextCellMove = true;
        }                

        if (lastSignificantCellProps) {
            if (cellProps.value === lastSignificantCellProps.value && !lastSignificantCellProps.shouldCellMerge) {
                cellProps.shouldCellMerge = true;
                distance += 1;
                cellProps.distance = distance;
                shouldNextCellMove = true;
                cellProps.shouldCellMove = shouldNextCellMove;
            } 
        }
        
        if (cellProps.value !== '') {
            lastSignificantCellProps = cellProps;
        }
    }

    Cell.prototype.moveCell = function(direction, isMatrixTurned) {                
        var properties = this.properties;
        var row = properties.coords[0];
        var column = properties.coords[1];
                       
        if (properties.shouldCellMove === true) {            
            grid[row][column] = '';
            destinationColumn = direction === 'left' ? column - properties.distance : column + properties.distance;
            // var newValue = properties.shouldCellMerge ? String(properties.value * context.base) : properties.value;
            var newValue = properties.shouldCellMerge ? String(Number(properties.value) + Number(properties.value)) : properties.value;
            grid[row][destinationColumn] = newValue;
            didCellsMove = true;
            //increase totalScore
            if (properties.shouldCellMerge) context.summaryModel.add(Number(newValue));
            updateFreeCellsArray(row, column, destinationColumn, isMatrixTurned);                                        
        }
        
        lastColumnIndex = direction === 'left' ? size.width - 1 : 0;

        if (column === lastColumnIndex) {
            distance = 0;
            lastSignificantCellProps = null;
            shouldNextCellMove = false;
        }                
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
        
    switch (key) {
        case 'left':                        
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {
                    newCell = new Cell(i, j);                                 
                    newCell.moveCell('left');
                }
            }        
            break;
        case 'right':
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    newCell = new Cell(i, j);                                 
                    newCell.moveCell('right');
                }
            }
            break;
        case 'up':  
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {
                    newCell = new Cell(i, j);                                 
                    newCell.moveCell('left', true);
                }
            }            
            invertMatrix();
            break;
        case 'down':
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    newCell = new Cell(i, j);                                 
                    newCell.moveCell('right', true);
                }
            }
            invertMatrix();
            break;                   
        default:
            console.error('wrong direction value!');
            break;
    }    
    this.addRandomValues(this.initCellsNumber, didCellsMove);
    didCellsMove = false;
    this.publish('changeData');   
}

MatrixModel.prototype.startNewGame = function() {          
    this.clearMatrix();
    this.addRandomValues(this.initCellsNumber);
    this.canContinue = true;
    this.summaryModel.add( - this.summaryModel.attributes.totalScore);    
    this.publish('changeData');
}

MatrixModel.prototype.addRandomValues = function(initCellsNumber, didCellsMove) {
    var row, column, i, j, freeCellIndex, randomValue, value, 
        chance = 0.5, //first value drop chance
        randomRangeOffset = 1,        
        height = this.attributes.size.height,
        width = this.attributes.size.width,
        grid = this.attributes.grid;

    var context = this;

    getRandomFreeCellIndex = function() {   
        if (context.freeCellsCoords.length > 0) {
            return Math.round(Math.random() * (context.freeCellsCoords.length - 1));
        } else {            
            return -1;
        }        
    } 
    
    checkPossibility = function() {
        for (i = 0; i < height; i += 1) {
            for (j = 0; j < width ; j += 1) {
 
                if (i < height - 1) {
                    // checkVerticalNeighbour
                    if (grid[i][j] === grid[i + 1][j]) {
                        return true;
                    }
                }
                if (j < width - 1) {
                    // checkHorizontalNeighbour
                    if (grid[i][j] === grid[i][j + 1]) {
                        return true;
                    }
                }                                                
            }
        }
        return false;
    }
    //at least 1 cell moved or it is initial render
    if (didCellsMove || didCellsMove === undefined) {
        var cellsNumber = didCellsMove === undefined ? initCellsNumber : this.afterMoveCellsNumber;
        for (i = 0; i < cellsNumber; i += 1) {                
            freeCellIndex = getRandomFreeCellIndex();
            //checking if there are free cells
            if (freeCellIndex >= 0) {            
                [row, column] = context.freeCellsCoords[freeCellIndex];                         
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
        //no more free cells
        if (context.freeCellsCoords.length === 0) {
            context.canContinue = checkPossibility();
        }        
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
