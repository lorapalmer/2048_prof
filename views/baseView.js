function BaseView() {
    this.rootElement = document.createElement('div');
}

BaseView.prototype.show = function (element) {
    this.beforeRender();
    this.rootElement.innerHTML = this.render();
    this.rootElement.classList.add(this.className);
    element.appendChild(this.rootElement);
    this.afterRender();
}

// Phase 1
BaseView.prototype.beforeRender = function () {};

BaseView.prototype.render = function () {
    throw new Error('Render method is required');
}

BaseView.prototype.afterRender = function () {};

// Phase 2
BaseView.prototype.beforeUpdate = function () {};

BaseView.prototype.reRender = function () {
    this.beforeUpdate();
    this.rootElement.innerHTML = this.render();
    this.afterUpdate();
}

BaseView.prototype.afterUpdate = function () {};