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
	let info = JSON.parse( localStorage[ lsKey ] ?? '{}');
	if ( typeof info === 'number' ) {
		info = { lastAttemptTime: info };
		localStorage[ lsKey ] = JSON.stringify( info );
	}

	const { lastAttemptTime , success } = info;
	const lastAttempt = new Date( lastAttemptTime ?? 0 );

	const row = document.createElement( 'div' );
	row.classList.add( 'row' );

	const link = document.createElement( 'a' );
	link.href = href;
	link.classList.add( 'link' );

	const text = document.createElement( 'div' );
	text.textContent = name;
	text.classList.add( 'text' );

	const checkbox = document.createElement( 'div' );
	checkbox.classList.add( 'checkbox' );
	checkbox.textContent = lastAttempt < gResetTime ? '\u274C' : '\u2611\uFE0F';

	link.appendChild( checkbox );
	link.appendChild( text );

	link.addEventListener( 'mousedown' , () => {
		const info = JSON.parse( localStorage[ lsKey ] ?? '{}' );
		info.lastAttemptTime = Date.now();;
		localStorage[ lsKey ] = JSON.stringify( info );

		checkbox.textContent = '\u2611\uFE0F';

		if ( event.button === 0 ) {
			event.preventDefault();
			window.open( href );
		}
	} );

	const toggle = document.createElement( 'div' );
	toggle.classList.add( 'toggle' );
	if ( lastAttempt >= gResetTime && success != null ) {
		toggle.classList.add( success ? 'right' : 'wrong' );
	}

	const right = document.createElement( 'div' );
	right.classList.add( 'right-side' );
	right.textContent = 'right';
	right.addEventListener( 'click' , () => {
		toggle.classList.add( 'right' );
		toggle.classList.remove( 'wrong' );
		const info = JSON.parse( localStorage[ lsKey ] ?? '{}' );
		info.success = true;
		localStorage[ lsKey ] = JSON.stringify( info );
	} );

	const wrong = document.createElement( 'div' );
	wrong.classList.add( 'wrong-side' );
	wrong.textContent = 'wrong';
	wrong.addEventListener( 'click' , () => {
		toggle.classList.add( 'wrong' );
		toggle.classList.remove( 'right' );
		const info = JSON.parse( localStorage[ lsKey ] ?? '{}' );
		info.success = false;
		localStorage[ lsKey ] = JSON.stringify( info );
	} );

	toggle.appendChild( right )
	toggle.appendChild( wrong );

	row.appendChild( link )
	row.appendChild( toggle );


	return row;
};

const list = document.querySelector( '#list' );
heardles.map( createHeardleBox ).forEach( li => list.appendChild( li ) );