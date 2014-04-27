var before = [];
const THRESHOULD = 0.03;

window.ontradableload = function() {
    // Code here will be executed
    // after the tradable API is available
	// Position by percentage
	function Position (x, y) {
		this.x = x;
		this.y = y;
	}

	var positions = {
		'AUD' : new Position(39, 73),
		'CAD' : new Position(71, 20),
		'EUR' : new Position(10, 23),
		'GBP' : new Position(1, 24),
		'HKD' : new Position(33, 30),
		'USD' : new Position(74, 36),
		'ZAR' : new Position(9, 71),
		// 'BRA' : new Position(87, 66),
		// 'ARG' : new Position(85, 80),
		// 'RUS' : new Position(29, 16),
		// 'IND' : new Position(24, 44),
		// 'EGY' : new Position(10, 48),
	};

	console.log('get and set weather \n');

	for (var currency in positions) {
		var position = positions[currency];
		var iconImage = $('<img id="' + currency + '"/>')
			.attr( { src: 'images/' + 'sunny' + '.png'  } );
		var iconLink = $('<a></a>')
			.attr( { href: 'detail.html?currency=' + currency } )
			.append(iconImage);
		var icon = $('<div></div>')
			.css( { top: position.y + '%', left: position.x + '%' } )
			.addClass('weather icon ' + 'sunny')
			.append(iconLink);
		$('#forexcast').append(icon);

		// decide the weather
		getWeather(currency);
	}
}

function setImage(currency, weather) {
	// place the icon
	console.log('currency: ' + currency + ' '
		+ 'weather: ' + weather + '\n');

	$('#' + currency).attr('src', 'images/' + weather + '.png');
}

function judgeWeather(before, after) {
	if (((after['high'] + after['low'])/2 - (before['high'] + before['low'])/2) > THRESHOULD) {
		return 'sunny';
	} else if (((after['high'] + after['low'])/2 - (before['high'] + before['low'])/2) < -THRESHOULD) {
		return 'cloudy';
	}

	return 'rainy';
}

function calclateMarket(candles) {
	if(candles.length > 1) {
		after = {
			'time'	: candles[0].time,
			'open'	: candles[0].open,
			'high'	: candles[0].high,
			'low'	: candles[0].low,
			'close'	: candles[0].close,
			'sequence'	: candles[0].sequence
		};
		before = {
			'time'	: candles[1].time,
			'open'	: candles[1].open,
			'high'	: candles[1].high,
			'low'	: candles[1].low,
			'close'	: candles[1].close,
			'sequence'	: candles[1].sequence
		};
	} else {
		after = {
			'time'	: candles[0].time,
			'open'	: candles[0].open,
			'high'	: candles[0].high,
			'low'	: candles[0].low,
			'close'	: candles[0].close,
			'sequence'	: candles[0].sequence
		};
	}

	//console.log(judgeWeather(before, after));

	return judgeWeather(before, after);
}

function getWeather(currency) {
	var symbol = currency + '/JPY';
	var period = '12h';
	var since = new Date() - 86400000;

	if (symbol && period && since) {
		window.candleSubscribtion = tradable.historic.onUpdate({
			"symbol": symbol,
			"period": period,
			"from": since
		}, function(update) {
			var candles = update.candles;
			if (candles) {
				var weather = calclateMarket(candles);
				setImage(currency, weather);
			}
		});
	}

	// return weather;
}
