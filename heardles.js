const heardles = [
	[ 'Original' , 'https://www.spotify.com/heardle/' ],
	[ '60s' , 'https://www.60s.heardledecades.com/' ],
	[ '70s' , 'https://www.70s.heardledecades.com/' ],
	[ '80s' , 'https://heardle80s.com/' ],
	[ '80s #1s' , 'https://www.80s.heardledecades.com/' ],
	[ '90s' , 'https://www.90s.heardledecades.com/' ],
	[ '90s US' , 'https://us90s-heardle.glitch.me/' ],
	[ '90s R&B/Hip-Hop' , 'https://ya-heardle.glitch.me/' ],
	[ '2000s' , 'https://2000sheardle.glitch.me/' ],
	[ 'Pop' , 'https://popheardle.glitch.me/' ],
	[ 'Rock' , 'https://bestestes-rock-heardle.glitch.me/' ],
	// [ 'Disney' , 'https://disney-heardle.glitch.me/' ],
	[ 'Green Day' , 'https://green-day-heardle.glitch.me/' ],
	[ 'Metallica' , 'https://heardle-em-all.glitch.me/' ],
	[ 'Rhythm Games' , 'https://rhythmgame-heardle.glitch.me/' ],
];

const list = document.querySelector( '#list' );
const screenshotButton = document.querySelector( '#screenshot' );

screenshotButton.addEventListener( 'click' , () => {
	[].forEach.call( list.children , child => {
		if ( child.id === 'date' ) return;

		const key = child.firstChild.textContent;
		const info = JSON.parse( localStorage[ `heardle-${key}` ] || '{}' );

		if ( info.guesses == null ) {
			child.style.display = 'none';
		}
	} );

	html2canvas( list ).then( canvas => {
	    // document.body.appendChild( canvas );
	    canvas.toBlob( blob => { 
		    const item = new ClipboardItem( { "image/png": blob } );
		    navigator.clipboard.write( [ item ] ); 
		} );

		[].forEach.call( list.children , child => {
			child.removeAttribute( 'style' );
		} );
	} );
} );

const date = document.querySelector( '#date' );
date.textContent = `0/0 - ${new Date().toDateString()}`;

const gResetTime = ( () => {
	let now = new Date();
	now.setHours( 0 );
	now.setMinutes( 0 );
	now.setSeconds( 0 );
	now.setMilliseconds( 0 );

	return now.getTime();
} )();

const xCalcCorrectAnswers = () => {
	const [ total , right ] = heardles.map( ( [ title ] ) => {
		const saved = JSON.parse( localStorage[ `heardle-${title}` ] ?? `{}` );
		if ( saved.lastAttemptTime >= gResetTime ) return saved.guesses;
		return null;
	} ).reduce( ( obj , num ) => {
		if ( num == null ) return obj;

		obj[ 0 ]++;
		if ( num < 6 ) obj[ 1 ]++;

		return obj;
	} , [ 0 , 0 ] );

	date.textContent = `${right}/${total} - ${new Date().toDateString()}`;
};

const xCreateHeardleBox = ( [ name , href ] ) => {
	const lsKey = `heardle-${name}`
	let info = JSON.parse( localStorage[ lsKey ] ?? '{}');
	if ( typeof info === 'number' ) {
		info = { lastAttemptTime: info };
		localStorage[ lsKey ] = JSON.stringify( info );
	}

	const { lastAttemptTime } = info;
	const lastAttempt = new Date( lastAttemptTime ?? 0 );

	if ( lastAttempt < gResetTime ) {
		localStorage[ lsKey ] = JSON.stringify( { lastAttemptTime: lastAttempt.getTime() } )
	}

	const row = document.createElement( 'div' );
	row.classList.add( 'row' );

	const link = document.createElement( 'a' );
	link.href = href;
	link.classList.add( 'link' );

	const text = document.createElement( 'div' );
	text.textContent = name;
	text.classList.add( 'text' );

	link.appendChild( text );

	link.addEventListener( 'mousedown' , () => {
		const info = JSON.parse( localStorage[ lsKey ] ?? '{}' );
		info.lastAttemptTime = Date.now();
		localStorage[ lsKey ] = JSON.stringify( info );

		if ( event.button === 0 ) {
			event.preventDefault();
			window.open( href );
		}
	} );

	const guesses = document.createElement( 'div' );
	guesses.classList.add( 'guesses' );

	for ( let i = 0 ; i < 7 ; i++ ) {
		const guess = document.createElement( 'div' );
		guess.classList.add( 'guess' );
		guess.addEventListener( 'click' , event => {
			const info = JSON.parse( localStorage[ lsKey ] ?? '{}' );
			info.guesses = i;
			info.lastAttemptTime = Date.now();
			localStorage[ lsKey ] = JSON.stringify( info );

			let beforeMarked = true;
			for ( const child of guesses.children ) {
				child.classList.remove( 'wrong' );
				child.classList.remove( 'correct' );
				if ( i === 6 ) {
					child.classList.add( 'wrong' );
				} else if ( child === guess ) {
					beforeMarked = false;
					child.classList.add( 'correct' );
				} else if ( beforeMarked ) {
					child.classList.add( 'wrong' );
				}
			}

			xCalcCorrectAnswers();
		} );

		guesses.appendChild( guess );
	}

	if ( lastAttempt >= gResetTime && info.guesses != null ) {
		for ( let i = 0 ; i < guesses.children.length ; i++ ) {
			if ( i < info.guesses || i === 6 ) {
				guesses.children[ i ].classList.add( 'wrong' );
			} else if ( i === info.guesses ) {
				guesses.children[ i ].classList.add( 'correct' );
				break;
			} else {
				break;
			}
		}
	}

	xCalcCorrectAnswers();

	row.appendChild( link )
	row.appendChild( guesses );

	return row;
};

heardles.map( xCreateHeardleBox ).forEach( li => list.appendChild( li ) );
