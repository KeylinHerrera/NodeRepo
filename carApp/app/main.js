(function($, window){
	// constants
	var BASE_URL = 'http://localhost:8080'; // server

	// variables
	var form = null;
	var table = null;
	var formStyle = null;
	var select = null;

	/**
	 * Load the car data table
	 * If data is passed the uses the data to load the table
	 * If data is not passed then request the data to the server
	 * @param {Object} data optional
	 * @private
	 */
	function _loadTable(dataCar){
		// clear the table content
		table.find('tbody').html('');

		if(!dataCar)
			$.ajax({
				url: BASE_URL+'/cars',
				type: 'GET',
			}).then(_composeTBody, _logError);
		else
			_composeTBody(dataCar);
	}

	/**
	 * Compose the tbody for the cars table
	 * @param {Array} data
	 * @private
	 */
	function _composeTBody(data){
		var tbody = $('<tbody></tbody>');

		// there are no cars
		if(!data.total){
			tbody.append($('<tr><th colspan="8" class="text-center">There are no cars.</th></tr>'));
			return table.append(tbody);
		}

		// create the tds for echa car
		data.records.forEach(function(car){
			var tr = $('<tr></tr>');
			tr.append($('<th>#'+car.id+'</th>'));
			tr.append($('<td>'+car.model+'</td>'));
			tr.append($('<td>'+car.brand+'</td>'));
			tr.append($('<td>'+car.year+'</td>'));
      		tr.append($('<td>'+car.price+'</td>'));
      		tr.append($('<td>'+car.color+'</td>'));
      		tr.append($('<td>'+car.style+'</td>'));
			var actions = $('<td width="150px"></td>');
			actions.append(_composeEditButton(car));
			actions.append(_composeDeleteButton(car));
			tr.append(actions);
			tbody.append(tr);
		});
		table.append(tbody);
	}

	/**
	 * Compose the delete button for each car row
	 * @param {Object} car
	 * @returns {*|HTMLElement}
	 * @private
	 */
	function _composeDeleteButton(car){
		var button = $('<button class="btn btn-sm btn-danger pull-right">Delete</button>');
		button.on('click', function(){
			var message = 'Are you sure you want to delete '+ car.model+' '+ car.brand;
			message += "\nThis action will delete the users permanently."
			if(confirm(message)) _deleteCar(car.id);
		});
		return button;
	}

	/**
	 * Delete the car
	 * @param {String|Number} id car id
	 * @private
	 */
	function _deleteCar(id){
		$.ajax({
			url: BASE_URL+'/car',
			type: 'DELETE',
			data: {id: id}
		}).then(_loadTable, _logError);
	}

	/**
	 * Compose the edit button for each car row
	 * @param {Object} car
	 * @returns {*|HTMLElement}
	 * @private
	 */
	function _composeEditButton(car){
		var button = $('<button class="btn btn-sm btn-primary">Edit</button>');
		button.on('click', function(){
			// load the data into the form
			form[0].id.value = car.id;
			form[0].model.value = car.model;
			form[0].brand.value = car.brand;
			form[0].year.value = car.year;
      		form[0].color.value = car.color;
      		form[0].price.value = car.price;
      		form[0].style.value = car.style;
		});
		return button
	}

	/**
	 * Submits the add/edit car form
	 * @param {Object} event
	 * @private
	 */
	function _submitForm(event){
		event.preventDefault();
		var data = form.serializeArray();
		var dataStyle = formStyle.serializeArray();
		var data = {
      		id: form[0].id.value,
			model: form[0].model.value,
			brand: form[0].brand.value,
			year: form[0].year.value,
      		color: form[0].color.value,
      		price: form[0].price.value,
      		style: form[0].style.value
		}

		$.ajax({
			url: BASE_URL+'/car',
			type: data.id == 0 ? 'POST' : 'PUT',
			data: data
		}).then(
			function (data){
				form[0].reset();
				_loadTable(data);
			},
			_logError
		);
	}

	/**
	 * Submits the add/edit style form
	 * @param {Object} event
	 * @private
	 */
	function _submitStyle(event){
		event.preventDefault();
		var dataStyle = {
      		id: formStyle[0].id.value,
			description: formStyle[0].description.value,
			carStyle: formStyle[0].carStyle.value,
		}
		console.log('data', dataStyle);

		$.ajax({
			url: BASE_URL+'/style',
			type: dataStyle.id == 0 ? 'POST' : 'PUT',
			data: dataStyle
		}).then(
			function (data){
				formStyle[0].reset();
				_updateStyles(data);
			},
			_logError
		);
	}

	/**
	 * Compose the select
	 * @param {Array} data
	 * @private
	 */
	function _styleInput(data) {
		select.html('');
		data.records.forEach(function(style) {
			var option = $('<option></option>');
			option.text(style.carStyle);
			select.append(option);
		});
	}

	/**
	 * Update the styles input
	 * @param {Object} data
	 * @private
	 */
	function _updateStyles(data) {
		select.html('');
		if(!data) {
			$.ajax({
				url: BASE_URL+'/styles',
				type: 'GET'
			}).then(_styleInput, _logError);
		}
		else {
			_styleInput(data);
		}
	}

	/**
	 * Download CSV
	 * @private
	 */
	function _downloadCsv(filename) {
    	var element = document.createElement('a');
    	element.setAttribute('href', '../csv/myCsv.csv');
    	element.setAttribute('download', filename);
    	element.style.display = 'none';
    	document.body.appendChild(element);
    	element.click();
    	document.body.removeChild(element);
	}

	/**
	 * Simple method to log errors
	 * @param {Error|Object} error
	 * @private
	 */
	function _logError(error){
	}

	/**
	 * Compose the download button
	 * @private
	 */
	document.getElementById('exportCsv').addEventListener("click", function(){
    var filename = 'test';
    _downloadCsv(filename);
	}, false);

	/**
	 * Starts the app
	 * @private
	 */
	function _init(){
		form = $('#carForm');
		table = $('#cars');
		formStyle = $('#styleForm');
		select = $('#style');

		_loadTable();
		_updateStyles();

		form.on('submit', _submitForm)
		formStyle.on('submit', _submitStyle)
	}
	_init();
})(jQuery, window);
