const fs = require('fs');
const PATH = __dirname+'/../data/styles.json';
module.exports = Style;

/**
 * Style Model
 * @param {Object} data
 * @constructor
 */
function Style(data = {description: '', carStyle: ''}){
	var self = this;
	self.id = _getId(data.id);
	self.description = data.description;
	self.carStyle = data.carStyle;
	self.valid = function(){
		let carStyle = +self.carStyle;
		if(self.carStyle === '')
		return false;
		return true;
	}
}

/**
 * Get the id for the style
 * If the id is valid use the passed id
 * If the id is not defined finds the counter or start a new counter
 * @param {Number} id
 * @returns {Number}
 * @private
 */
function _getId(id){
	if(id > 0) return id;
	let data = '';
	try{
		data = require(PATH);
	}catch (err){ 
		return 1;
	}
	return ++data.counter;
}