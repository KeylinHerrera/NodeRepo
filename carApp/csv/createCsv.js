const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

module.exports = {
	create
};

function create(filename, data){
	let event = new EventEmitter();
	// mocked csv content
	var csv = new Array();
	data.records.forEach(function (item, index, array) {
		csv.push(item.model + ',' + item.brand + ',' + item.year + ',' + item.price+ ',' + item.color + ',' + item.style);
	});

	var csv = csv.join("\n");

	// write the csv file
	fs.writeFile(filename, csv, error => {
		if(error) event.emit('error', error);
		event.emit('done', csv);
	});

	return event;
}