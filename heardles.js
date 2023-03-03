const heardles = [
	[ 'Original' , 'https://www.spotify.com/heardle/' ],

	[ '60s' , 'https://www.60s.heardledecades.com/' ],
	[ '70s' , 'https://www.70s.heardledecades.com/' ],
	[ '80s' , 'https://heardle80s.com/' ],
	[ '80s 2nd' , 'https://like-its-the-80s-heardle.glitch.me/' ],
	[ '80s #1s' , 'https://www.80s.heardledecades.com/' ],
	[ '90s' , 'https://www.90s.heardledecades.com/' ],
	[ '90s 2nd' , 'https://90s-heardle.glitch.me/' ],
	[ '90s R&B/Hip-Hop' , 'https://ya-heardle.glitch.me/' ],
	[ '90s US' , 'https://us90s-heardle.glitch.me/' ],
	[ '2000s' , 'https://2000sheardle.glitch.me/' ],
	// [ '' , '' ],

	[ 'Anime' , 'https://animle.app/' ],
	// [ 'Disney' , 'https://disney-heardle.glitch.me/' ],
	[ 'Lyrics' , 'https://www.lyricle.app/' ],
	[ 'Movie/TV Themes' , 'https://themedle.com/' ],
	[ 'Pop' , 'https://popheardle.glitch.me/' ],
	[ 'Rhythm Games' , 'https://rhythmgame-heardle.glitch.me/' ],
	[ 'Rock' , 'https://bestestes-rock-heardle.glitch.me/' ],
	// [ '' , '' ],

	[ 'Britney Spears' , 'https://britney-heardle.glitch.me/' ],
	[ 'Boyz II Men' , 'https://boyziimen-heardle.glitch.me/' ],
	[ 'Green Day' , 'https://green-day-heardle.glitch.me/' ],
	[ 'Halsey' , 'https://halsey-heardle.glitch.me/' ],
	[ 'Paramore' , 'https://paramore-heardle.glitch.me/' ],
	[ 'Queen' , 'https://queenheardle.glitch.me/' ],
	[ 'Metallica' , 'https://heardle-em-all.glitch.me/' ],
	// [ '' , '' ],

	[ 'Cine 2 Nerdle' , 'https://www.cinenerdle2.app/' ],

];

const list = document.querySelector( '#list' );
const ignored = document.querySelector( '#ignored' );
const screenshotButton = document.querySelector( '#screenshot' );
const toggleVisibleButton = document.querySelector( '#toggleVisible' );
let ignoredList = JSON.parse( localStorage.ignoredList || '[]' );

screenshotButton.addEventListener( 'click' , () => {
	[].forEach.call( list.children , child => {
		if ( child.id === 'date' ) return;

		const key = child.firstElementChild.nextElementSibling.textContent;
		const info = JSON.parse( localStorage[ `heardle-${key}` ] || '{}' );

		if ( info.guesses == null ) {
			child.style.display = 'none';
		}
	} );

	list.classList.add( 'takingSS' );

	html2canvas( list ).then( canvas => {
	    // document.body.appendChild( canvas );
	    canvas.toBlob( blob => { 
		    const item = new ClipboardItem( { "image/png": blob } );
		    navigator.clipboard.write( [ item ] ); 
		} );

		list.classList.remove( 'takingSS' );
		[].forEach.call( list.children , child => {
			child.removeAttribute( 'style' );
		} );
	} );
} );

toggleVisibleButton.addEventListener( 'click' , () => {
	ignored.classList.toggle( 'hidden' );
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


	const hidden = ignoredList.some( key => key === name );

	const row = document.createElement( 'div' );
	row.classList.add( 'row' );
	if ( hidden ) row.classList.add( 'hidden' );

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

	const hideHeardle = document.createElement( 'div' );
	hideHeardle.className = 'toggleHide';
	hideHeardle.textContent = hidden ? '+' : '-';
	hideHeardle.addEventListener( 'click' , () => {
		row.classList.toggle( 'hidden' );

		ignoredList = JSON.parse( localStorage.ignoredList || '[]' );

		if ( row.classList.contains( 'hidden' ) ) {
			hideHeardle.textContent = '+';
			ignored.appendChild( row );
			ignoredList.push( name );
		} else {
			hideHeardle.textContent = '-';
			list.appendChild( row );
			const idx = ignoredList.findIndex( key => key === name );
			ignoredList.splice( idx , 1 );
		}

		localStorage.ignoredList = JSON.stringify( ignoredList );
	} )

	row.appendChild( hideHeardle );
	row.appendChild( link );
	row.appendChild( guesses );

	return [ hidden , row ];
};

heardles
	.map( xCreateHeardleBox )
	.forEach( ( [ hidden , li ] ) => {
		if ( hidden ) {
			ignored.appendChild( li );
		} else {
			list.appendChild( li );
		}
	} );
