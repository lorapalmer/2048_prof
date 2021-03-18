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

    //Needed to detect defeat
    var freeCellsCount = this.attributes.size.width * this.attributes.size.height; 
    
    var isFirstRender = true;
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function (key) {    
    this.publish('changeData');
}

MatrixModel.prototype.startNewGame = function () {    
    var row, column, i, initCellsNumber = 2, maxNumberOfCycles = 1000;

    var context = this;

    function getRandomCellCoords() {
        var row = Math.round(Math.random() * (context.attributes.size.height - 1));
        var column = Math.round(Math.random() * (context.attributes.size.width - 1));        
        return [row, column];
    }    

    //clearing cells
    for (i = 0; i < this.attributes.size.height; i += 1) {
        for (j = 0; j < this.attributes.size.width; j += 1) {
            this.attributes.grid[i][j] = '';
        }
    }

    for (i = 0; i < initCellsNumber; i += 1) {
        j = 0;
        do {  
            //limits the number of loop iterations. Also can be used as defeat indicator (no more free cells left).
            if (j > maxNumberOfCycles) {
                console.error('There are too many cycles!');
                this.publish('changeData');
                return;
            }
            j++;
            [row, column] = getRandomCellCoords();            
        } while (this.attributes.grid[row][column]);

        this.attributes.grid[row][column] = Math.round(Math.random() + 1) * 2; 
    }            

    //to prevent unnecessary subscriber renders during initialization
    if (!this.isFirstRender) this.publish('changeData');
}

