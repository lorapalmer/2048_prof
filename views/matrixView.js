function MatrixView() {
    this.matrixModel = new MatrixModel();
    this.template = document.getElementById('matrixTemplate').innerHTML;
    this.className = 'table';
}

MatrixView.prototype.render = function() {
    var i, j, attributes = this.matrixModel.attributes, str = '';

    for(i = 0; i < attributes.size.width; i += 1) {
        str += '<div class="row">';
        for(j = 0; j < attributes.size.height; j += 1) {
            str += '<div class="cell appear-' + attributes.grid[i][j] + ' ">' + attributes.grid[i][j] + '</div>';
        }
        str += '</div>';
    }

    return this.template.replace('{{matrix}}', str);
}