/*
*	Menu Class
*/

var Menu = function(id, options, visible) {

	if (typeof(id) !== 'string') {
		return console.error('No id defined for this.node class');
	}
	else {
		this.id = id;
	}

	this.node = document.createElement('ul');
	this.node.id = this.id;
	this.node.className = 'hover-menu';

	// Default to not being visible
	if (typeof(visible) == 'undefined') {
		this.node.style.visibility = 'hidden';
	}
	else {
		if ( visible === true ) {
			this.node.style.visibility = 'visible';
		}
		else {
			this.node.style.visibility = 'hidden';
		}
	}

	this.options = options;

	var that = this;
	this.options.forEach(function(element, index){
		var item = document.createElement('li');
		var text = document.createTextNode(element.text);

		item.appendChild(text);

		item.addEventListener('click', function() {
			that.hide();
		});
		that.node.appendChild(item);
	});

	document.body.appendChild(this.node);

};

/*
*	Methods
*/

Menu.prototype.setPosition = function(x, y) {
	this.node.style.top = x + 'px';
	this.node.style.left = y + 'px';
};

Menu.prototype.show = function() {
	this.node.style.visibility = 'visible';
};

Menu.prototype.hide = function() {
	this.node.style.visibility = 'hidden';
};