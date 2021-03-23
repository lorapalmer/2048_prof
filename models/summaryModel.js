function SummaryModel() {

    this.attributes = {
        totalScore: 0,
        bestScore: 0
    }

    var instance = this;
    SummaryModel = function () {
        return instance;
    }
}

SummaryModel.prototype = Object.create(BaseModel.prototype);
SummaryModel.prototype.constructor = SummaryModel;

SummaryModel.prototype.add = function(newValue) {
    this.attributes.totalScore += newValue;
    if (this.attributes.bestScore < this.attributes.totalScore){
        this.attributes.bestScore = this.attributes.totalScore;
        window.localStorage.setItem('bestScore', this.attributes.bestScore);
    } 
    this.publish('changeData');
}

SummaryModel.prototype.getBestScore = function() {
    this.attributes.bestScore = window.localStorage.getItem('bestScore');
}
