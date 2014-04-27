ontradableload = function () {
	// var script,checkFBL;this.FBL===undefined&&(script=document.createElement("script"),script.type="text/javascript",script.src="https://getfirebug.com/firebug-lite-debug.js#startOpened=true",document.head.appendChild(script),checkFBL=setInterval(function(){this.FBL&&(clearInterval(checkFBL),ontradableload())},100));

	var currency = $.url().param('currency');
	$('#title').text('Price of 1 ' + currency);

	function updateChart(data, options) {
		var canvas = $('#chart');
		var width = canvas.parent().width();
		var aspect = 5 / 16;
		canvas.prop( { 'width': width, 'height': width * aspect } );

		var ctx = canvas.get(0).getContext("2d");
		var chart = new Chart(ctx).Line(data, options);
	}

	function updateWithNewCandle(oldArray, currentCandle) {
		// Searching for an element with the same time
		for (var i = 0; i < oldArray.length; i++) {
			if (oldArray[i].time == currentCandle.time && 		// checking time
				oldArray[i].sequence <= currentCandle.sequence) {		// checking sequence
				oldArray[i] = currentCandle;
				return oldArray;
			}
		}
		// Adding a new candle to the end
		oldArray.push(currentCandle);

		// Sorting according to time
		oldArray.sort(function(candleOne, candleTwo) {
			return (parseInt(candleOne.time) - parseInt(candleTwo.time));
		});

		// Splicing the array if it is too big
		// if (oldArray.length > 50)
			// oldArray.splice(0, oldArray.length - 50);

		return oldArray;
	}

	var dataDays = 90;
	var symbol = currency + '/JPY';
	var period = '1d';
	var today = new Date();
	var fromDate = new Date();
	fromDate.setFullYear(today.getFullYear() - 1);
	var from = fromDate.getTime();

	var candleData = [];
	var properties = { "symbol": symbol, "period": period, "from": from };

	var chartOptions = {
		animation: false,
		datasetill: false,
	};

	tradable.historic.onUpdate(properties, function(update) {
		console.log(update);

		var candles = update.candles;
		if (candles) {
			var savedLength = candleData.length;
			for (var i = 0; i < candles.length; i++) {
				candleData = updateWithNewCandle(candleData, candles[i]);
			}
			if (candleData.length == savedLength) {
				return;
			}

			// Array for showing within the plot
			var labels = [];
			var prices = [];
			for (var i = 0; i < candleData.length; i++) {
				var candle = candleData[i];
				var date = new Date(candle.time);
				if (date.getDate() % 10 == 0) {
					labels.push(date.getMonth() + '/' + date.getDate());
				} else {
					labels.push('');
				}
				prices.push((candle.high + candle.low) / 2.0);
			}

			var data = {
				'labels': labels,
				'datasets': [
					{
						'strokeColor' : "rgba(220,220,220,1)",
						'pointColor' : "rgba(220,220,220,1)",
						'pointStrokeColor' : "#fff",
						'data' : prices,
					},
				],
			};
			updateChart(data, chartOptions);
		}
	});
};
