function AppView() {
    var summaryView = new SummaryView();
    var matrixView = new MatrixView();

    this.render = function(selector) {
        var element = document.getElementById(selector);

        // Insert summary view
        var summaryContainer = document.createElement('div');
        summaryContainer.innerHTML = summaryView.render();
        summaryContainer.classList.add(summaryView.className);
        element.appendChild(summaryContainer);

        // Insert matrix view
        var matrixContainer = document.createElement('div');
        matrixContainer.innerHTML = matrixView.render();
        matrixContainer.classList.add(matrixView.className);
        element.appendChild(matrixContainer);
    }
}

var appView = new AppView();
appView.render('root');