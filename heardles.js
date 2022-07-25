const heardles = [
	[ 'Original'    ,  'https://www.spotify.com/heardle/'  ],
	[ '60s'         ,  'https://www.60s.heardledecades.com/'  ],
	[ '70s'         ,  'https://www.70s.heardledecades.com/'  ],
	[ '80s'         ,  'https://heardle80s.com/'  ],
	[ '80s #1s'     ,  'https://www.80s.heardledecades.com/'  ],
	[ '90s'         ,  'https://www.90s.heardledecades.com/'  ],
	[ '2000s'       ,  'https://2000sheardle.glitch.me/'  ],
	[ 'Pop'         ,  'https://popheardle.glitch.me/'  ],
];

const gResetTime = ( () => {
	let now = new Date();
	now.setHours( 0 );
	now.setMinutes( 0 );
	now.setSeconds( 0 );
	now.setMilliseconds( 0 );

	return now.getTime();
} )();

const createHeardleBox = ( [ name , href ] ) => {
	const lsKey = `heardle-${name}`

	const row = document.createElement( 'a' );
	row.href = href;
	row.classList.add( 'row' );

	const link = document.createElement( 'div' );
	link.textContent = name;
	link.classList.add( 'link' );

	const lastAttmeptTime = parseInt( localStorage[ lsKey ] ?? '0' );
	const lastAttempt = new Date( lastAttmeptTime );

	const checkbox = document.createElement( 'div' );
	checkbox.classList.add( 'checkbox' );
	checkbox.textContent = lastAttempt < gResetTime ? '\u274C' : '\u2611\uFE0F';

	row.appendChild( checkbox );
	row.appendChild( link );

	row.addEventListener( 'mousedown' , () => {
		localStorage[ lsKey ] = Date.now();
		checkbox.textContent = '\u2611\uFE0F';
	} );

	return row;
};

const list = document.querySelector( '#list' );
heardles.map( createHeardleBox ).forEach( li => list.appendChild( li ) );