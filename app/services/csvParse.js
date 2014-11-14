app.service('csvParse', function() {
	this.parsedData = function(file){
		var reader = new FileReader();
		reader.readAsText(file);
		var data;
		reader.onload = function(event){
		  var csv = event.target.result;
		  data = $.csv.toArrays(csv);
		  var html = '';
		  for(var row in data) {
		    html += '<tr>\r\n';
		    for(var item in data[row]) {
		      html += '<td>' + data[row][item] + '</td>\r\n';
		    }
		    html += '</tr>\r\n';
		  }
		  $('#contents').html(html);
		  drawSelectBox();
		  alert("Data from your csv file has been loaded. Select the columns to proceed with column tabulation.");
		};
		reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
	};

	function drawSelectBox(){
		var html = '';
		var firstIndex;
		var secondIndex;
		var firstColumn = [] ,secondColumn = [];
		$('#contents tr:eq(0)').find('td').each(function(){
			html += '<option val=' + $(this).text() + '>'+ $(this).text() + '</option>';
		});
		$('#selectBox1').html(html);
		$('#selectBox2').html(html);
		var box1Value = $( "#selectBox1 option:selected" ).text();
		var box2Value = $( "#selectBox2 option:selected" ).text();
		$('#selectBox1').change(function() {
			box1Value = $( "#selectBox1 option:selected" ).text();
		});
		$('#selectBox2').change(function() {
			box2Value = $( "#selectBox2 option:selected" ).text();
		});
		$('#selectBox2, #selectBox1').on('change', function(){
			if (box1Value != box2Value) {
				firstColumn = [];
				secondColumn = [];
				$('#contents tr:eq(0)').find('td').each(function(index){
					if ( $(this).text() == box1Value )
						firstIndex = index;
					else if ( $(this).text() == box2Value )
						secondIndex = index;
				});
				$('#contents tr:gt(0)').find('td:eq('+firstIndex+')').each(function(index){
					if( !(($.inArray( $(this).text(), firstColumn) > -1)) ){
						firstColumn.push($(this).text());
					}
				});
				$('#contents tr:gt(0)').find('td:eq('+secondIndex+')').each(function(index){
					if( !(($.inArray( $(this).text(), secondColumn) > -1)) ){
						secondColumn.push($(this).text());
					}
				});
				var obj = new Object();
				$.each(firstColumn, function(index, val) {
					 obj[this] = new Object();
				});
				for ( var k in obj){
					$.each(secondColumn, function(){
						obj[k][this] = 0;
					});
				}
				$('#contents tr:gt(0)').each(function(){
					 var firstKey = $(this).find('td:eq('+firstIndex+')').text();
					 var secondKey = $(this).find('td:eq('+secondIndex+')').text();
					 obj[firstKey][secondKey] = obj[firstKey][secondKey] + 1;
				});
				console.log(JSON.stringify(obj));
				var tabulationContent = '<tbody><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
				$.each(secondColumn, function(){
					tabulationContent +='<td>'+this+'</td>';
				});
				tabulationContent += '<td>Total</td></tr>';
				var grandTotal =0;
				$.each(firstColumn, function(){
					var HorizontalTotal = 0;
					tabulationContent += '<tr><td>' + this + '</td>';
					for(var i = 0; i<secondColumn.length; i++){
						tabulationContent += '<td>'+ obj[this][secondColumn[i]] + '</td>';
						HorizontalTotal += obj[this][secondColumn[i]];
					}
					grandTotal += HorizontalTotal;
					tabulationContent += '<td>' + HorizontalTotal + '</td></tr>';
				});
				tabulationContent += '<tr><td> Total </td>';
				
				$.each(secondColumn, function(){
					var verticalTotal = 0;
					for (var i = 0; i < firstColumn.length; i++) {
						verticalTotal += obj[firstColumn[i]][this];
							
					};
					tabulationContent += '<td>' + verticalTotal + '</td>';
				});
				tabulationContent +='<td>'+ grandTotal +'</td></tr></tbody>';
				$('#columnTabulation').html(tabulationContent);
			}
		});
	}
});