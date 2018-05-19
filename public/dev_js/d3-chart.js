$(document).ready(function() {
	var products = {};
	var genres = [];
	var dataRow = $("#dataRow");
	$.getJSON("/admin/reports/table").done(function(data) {
		data.forEach(function(item) {
			dataRow.append(`
				<tr>
					<td class="col-md-6"><p><strong>${item._id}</strong></p></td>
					<td class="col-md-6"><p>sisältää <strong>${item.total}</strong> tuotetta</p></td>
				</tr>
			`);
		})
	}).fail(function() {
		console.log("error occured");
	});
	// d3 comes in from here

});
