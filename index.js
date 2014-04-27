$(function () {
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
	}

	for (var currency in positions) {
		// decide the weather
		var weather = 'sunny';

		// place the icon
		var position = positions[currency];
		var iconImage = $('<img/>')
			.attr( { src: 'images/' + weather + '.png'  } );
		var iconLink = $('<a></a>')
			.attr( { href: 'detail.html?currency=' + currency } )
			.append(iconImage)
		var icon = $('<div></div>')
			.css( { top: position.y + '%', left: position.x + '%' } )
			.addClass('weather icon ' + weather)
			.append(iconLink);
		$('#forexcast').append(icon);
	}
});
