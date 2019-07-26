
const names = [ "Rock", "Paper", "Scissors" ];

const plays = {
	1: 1,
	2: 0,
	3: 2
};

const score = { 
	'computer1': 0, 
	'computer2': 0,
	'tie': 0
};

let i = 0,
		middle,
		lastWinner,
		scoreResults;

const computer1 = {
	name: 'Computer 1',
	nn: new MLP( 3, 3, 3, 0.1, 300 ),
	tmpMove: [],
	x: [],
	y: []
}

const computer2 = {
	name: 'Computer 2',
	nn: new MLP( 3, 3, 3, 0.1, 300 ),
	tmpMove: [],
	x: [],
	y: []
}

const play = function(me){
	let move;
	if( me.y.length < 3 ){
		move = Math.floor( Math.random() * 3 );
	}else{
		if( lastWinner !== me.name ){ 
			me.nn.shuffle( me.x, me.y );
			me.nn.fit( me.x, me.y );
		}
		let prediction = me.nn.predict( me.opponentLastMove ).data;
		move = (prediction.indexOf(Math.max(...prediction)) + 1) % 3;
	}
	return move
}

const learn = function(me, opponentMove){
	const move = Array(3).fill(0);
	move[opponentMove] = 1;
	me.tmpMove.push( move );
	if( me.tmpMove.length == 2 ){
		me.x.push( me.tmpMove.shift() );
		me.y.push( me.tmpMove[0] );
	}
	me.opponentLastMove = move;
}

let loopBot = 1;

const loop = function() {
	const playerOneMove = play(computer1);
	const playerTwoMove = play(computer2);
	console.log(playerTwoMove);
	const win = plays[playerOneMove+playerTwoMove];
	lastWinner = playerOneMove === playerTwoMove || win === undefined ? 'tie' : win === playerOneMove ? 'computer1' : 'computer2';
	score[lastWinner]++;
	updateScore(playerOneMove, playerTwoMove, lastWinner);
	learn(computer1, playerTwoMove);
	learn(computer2, playerOneMove);
}

const updateScore = function(playerOneMove, playerTwoMove, winner){
	for(let player of Object.keys(score) ){
		scoreResults[player].innerHTML = player+"<br>"+score[player];
	}
	middle.innerHTML = `${computer1.name} : ${names[playerOneMove]} vs ${names[playerTwoMove]} : ${computer2.name} <br>${winner}`;
}

const init = function(){
	const top = document.createElement('div');
	top.className = "row";
	scoreResults = {};
	for(let k of Object.keys( score )){
		let d = document.createElement('div');
		d.innerHTML = k+"<br>&nbsp;";
		scoreResults[k] = d;
		top.appendChild( d ); 
	}
	middle = document.createElement('div');
	middle.className = "row";

	document.body.appendChild( top );
	document.body.appendChild( middle );

	setInterval(loop, 1000);
}

init();
