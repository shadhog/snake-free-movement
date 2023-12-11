const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$( document ).ready(function() {
	
	
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	
	var mkw =4; 
	

	var winDiv = $('#win');
	var container = document.getElementById('container');
	var canvas = document.getElementById('background');
	canvasSize = 600;
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	var c = canvas.getContext('2d');
	
	window.addEventListener('resize', function(event) {
		canvasWidth = container.offsetWidth;
		if(canvasWidth > canvasSize) canvasWidth = canvasSize;
		canvas.width = canvasSize;
		canvas.height = canvasSize;
	});
	
	var centerX = canvas.width / 2,
		centerY = canvas.height / 2,
		run = true,
		healthDiv = $('#health'),
		score = 0,
		scoreDiv = $('#score'),
		mainBackgroundColor = 'rgba(0,0,0)',
		mainBorderColor = '#ffffff',
		count = 0,
		map = [],
		numOfPlayers = 1,
		numberOfLoops = 3,
		playerKeys = [{'right': 39, 'down': 40, 'left': 37, 'up': 38},
					  {'right': 68, 'down': 83, 'left': 65, 'up': 87},
					  {'right': 76, 'down': 75, 'left': 74, 'up': 73},
					  {'right': 102, 'down': 101, 'left': 100, 'up': 104}];

	var isUp,
		isLeft,
		isRight,
		isDown,
		isShift,
		lastDirection;
			
	
	
	function Ball(keys) {
		this.id = players.length + 1;
		this.width = 10;
		this.height = this.width;
		this.posX = canvasSize / 2 - this.width/2;
		this.posY = canvasSize / numOfPlayers  * (this.id - 0.5);
		this.defaultColor = randomColor();			
		this.color = this.defaultColor;
		this.acc = 0.06;
		this.dec = 0.075;
		this.angle = 0;
		this.speedX = 0;
		this.speedY = 0.2;
		this.right = keys.right;
		this.down = keys.down;
		this.left = keys.left;
		this.up = keys.up;
		this.health = 100;
		this.healthDiv = $('<span>', {text: this.health});
		this.delay = 100;
		this.delayAnimation = 0;
		this.loop = -1;
		this.onLine = false;
		this.length = 1;
		this.newLength = 180;
		this.tail = [];
		
		for(var i = 0 ; i < this.length ; i++) {
			this.tail.push([this.posX, this.posY]);
		}
		
		$('<p>', {html: 'Player ' + this.id + '<br>'}).append(this.healthDiv).appendTo(healthDiv);
		
		function randomColor() {
			var randomR = Math.floor(Math.random() * 255);
			var randomG = Math.floor(Math.random() * 255);
			var randomB = Math.floor(Math.random() * 255);
			return ('rgb(' + randomR + ',' + randomG + ',' + randomB + ', 1)');
		}
		
		this.move = function() {
			this.makeAstep();
			/*this.draw();*/
			this.drawHealthTag();
		}
		
		this.grow = function() {
			this.newLength--;
			this.length++;
			this.tail.push([this.tail[0][0], this.tail[0][1]]);
		}
		
		this.makeAstep = function() {

			if(!map[this.left] && !map[this.right] && this.angle !== 0) {
				//this.speedX = this.speedX > 0 ? this.speedX -= this.dec : this.speedX += this.dec;
				//if(this.angle > 2) this.speedY = this.angle -= this.dec
				//if(this.angle < 2) this.speedY = this.angle += this.dec
			}

			if(map[this.left]) {
				this.angle -= this.acc;
				//this.speedX -= this.acc;
				//lastDirection = 'left';				
			}

			if(map[this.right]) {
				this.angle += this.acc;
				//this.speedX += this.acc;
				//lastDirection = 'right';
			}
			
			this.speedX = Math.cos(this.angle);
			this.speedY = Math.sin(this.angle);
			
			this.posX += this.speedX;
			this.posY += this.speedY;
			
			if(this.newLength > 0) {
				this.grow();
			}
			this.tail[this.length-1] = [this.posX, this.posY];
			for(i=0; i< this.length ; i++) {
				if(i > 0)
					this.tail[i-1] = this.tail[i];
				this.drawTail(this.tail[i], i==this.length-1 ? true:false);
			}
			this.tail[this.length-1] = [this.posX, this.posY];
			
			//this.hitMyself();
			
			//this.tail[0] = [this.posX, this.posY];
			
			/*var i = this.length;
			if(this.newLength > 0) {
				this.grow();
				i--;
			}
			for(; i > 0  ; i--) {
				if(i+1 != this.length)
				this.tail[i+1] = this.tail[i];
				this.drawTail(this.tail[i]);
				
			}
			this.tail[this.length-1] = [this.posX, this.posY];*/
			//this.tail[0] = [this.posX, this.posY];
			
			
			/*if(!map[this.up] && !map[this.down] && this.speedY !== 2) {
				//this.speedY = this.speedY > 2 ? this.speedY -= this.dec : this.speedY += this.dec;
				if(this.speedY > 2) this.speedY = this.speedY -= this.dec
				if(this.speedY < 2) this.speedY = this.speedY += this.dec
				
			}*/

			/*if(map[this.up]) {
				this.speedY += this.acc;
				//lastDirection = 'up';				
			}*/

			/*if(map[this.down]) {
				this.speedY -= this.acc;
				//lastDirection = 'down';
			}*/

			
				
			/*if(this.checkBoundaries()) {
				this.posX += this.speedX;
				this.posY += this.speedY;
			}*/
			

		}
		
		this.hitWall = function() {
			/*if(this.posX - this.width + this.speedX < 0) {
				this.posX = this.width;
				this.speedX = 0;
				this.speedY = 0;
				return false;
			}
			if(this.posX + this.width + this.speedX > canvasSize) {
				this.posX = canvasSize - this.width;
				this.speedX = 0;
				this.speedY = 0;
				return false;
			}
			if(this.posY - this.height + this.speedY < 0) {
				this.posY = this.height;
				this.speedX = 0;
				this.speedY = 0;
				return false;
			}
			if(this.posY + this.height + this.speedY > canvasSize) {
				this.posY = canvasSize - this.height;
				this.speedX = 0;
				this.speedY = 0;
				return false;
			}
			return true;*/
			if(this.posX - this.width < 0 || this.posX + this.width > canvasSize ||
			this.posY - this.height < 0 || this.posY + this.height > canvasSize) return true;
			return false;
		}
		
		this.hitMyself = function() {
			/*var circle1 = {'posX': this.tail[0][0], 'posY': this.tail[0][1], 'width': this.width};
			var circle2;
			for(var i = this.width*4 ; i < this.length ; i++) {
				circle2 = {'posX': this.tail[i][0], 'posY':this.tail[i][1], 'width': this.width};
				if(circleColision(circle1,circle2)) {
					return true;
				}
			}
			return false;*/
			
			
			/*var eventLocation = getEventLocation(this,e);*/
			var coord = "x=" + this.posX + ", y=" + (this.posY-this.height-1);
			
			// Get the data of the pixel according to the location generate by the getEventLocation function
			
			var pixelData = c.getImageData(this.posX, this.posY, this.width, this.height).data; 

			// If transparency on the image
			if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
						coord += " (Transparent color detected, cannot be converted to HEX)";
			}
			
			var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
			
			// Draw the color and coordinates.
			console.log(coord, hex);
			$('body').css('background', hex);
			
			/*for(var i = 1 ; i < this.length ; i++) {
				if(this.tail[0][0] == this.tail[i][0] && this.tail[0][1] == this.tail[i][1]) return false;
			}
			return false;*/
		}
		
		function getElementPosition(obj) {
			var curleft = 0, curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
				return { x: curleft, y: curtop };
			}
			return undefined;
		}

		function getEventLocation(element,event){
				var pos = getElementPosition(element);
			
			return {
					x: (event.pageX - pos.x),
				y: (event.pageY - pos.y)
			};
		}

		function rgbToHex(r, g, b) {
			if (r > 255 || g > 255 || b > 255)
				throw "Invalid color component";
			return ((r << 16) | (g << 8) | b).toString(16);
		}
		
		/*this.draw = function() {
			c.beginPath();
			c.arc(this.posX, this.posY, this.width, 0, 2*Math.PI);
			c.fillStyle = this.color;
			c.fill();
		}	*/
		
		this.drawTail = function(tail,head) {
			c.beginPath();
			c.arc(tail[0], tail[1], this.width, 0, 2*Math.PI);
			c.fillStyle = this.color;
			c.fill();
			if(head) {
				/*c.lineWidth = 2;
				c.strokeStyle = 'rgba(0,0,0,0.2)';
				c.stroke();*/
				c.fillStyle = 'rgba(0,0,0,0.2)';
				c.fill();
			}
		}	
		
		this.showHealthTag = function() {
			this.delayAnimation = this.delay;
		}
		
		this.drawHealthTag = function() {
			if(this.delayAnimation > 0) {
				c.beginPath();
				c.font = '16px Arial';
				c.fillStyle = 'rgba(255,255,255,'+ this.delayAnimation/100 +')';
				c.textAlign = 'center';
				c.fillText(this.loop + '/' + numberOfLoops, this.posX, this.posY - this.height - 10);
			}
			this.delayAnimation--;
		}	
	}
	
		
		
	/*function Enemy(posX = 0, posY = 0, width = 3, speedX = 1, speedY = 1, angle = 35) {
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = this.width;
		this.speedX = speedX;
		this.speedY = speedY;
		this.color = 'rgba(255,255,255,0.75)';
		this.angle = angle;
		
		this.move = function() {
			this.posX += cosDegrees(this.angle)*this.speedX;
			this.posY += sinDegrees(this.angle)*this.speedY;
			
			this.checkBoundaries();
			this.draw();
		}
		
		this.draw = function() {
			c.beginPath();
			c.arc(this.posX, this.posY, this.width, 0, 2*Math.PI);
			c.fillStyle = this.color;
			c.fill();
		}
		
		this.checkBoundaries = function() {
			if(this.posX - this.width > canvasSize) {
				this.posX = -this.width;
			}
			if(this.posY - this.height > canvasSize) {
				this.posY = -this.height;
			}
			if(this.posX + this.width < 0) {
				this.posX = canvasSize + this.width/2;
			}
			if(this.posY + this.height < 0) {
				this.posY = canvasSize + this.height/2;
			}
		}
	}*/
	
	function Wall(posX = 0, posY = 0, width = 20, height = 40) {
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.color = 'rgba(139,195,74,1)';
		
		this.draw = function() {
			c.beginPath();
			c.rect(this.posX, this.posY, this.width, this.height);
			c.fillStyle = this.color;
			c.fill();
		}
	}
	
	function sinDegrees(angle) {return Math.sin(angle/180*Math.PI);}
	function cosDegrees(angle) {return Math.cos(angle/180*Math.PI);}
	
	function circleColision(circle1, circle2) {
		var dx = circle1.posX - circle2.posX;
		var dy = circle1.posY - circle2.posY;
		var distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < circle1.width + circle2.width) {
			return true;
		}
		return false;
	}
	
	function RectCircleColliding(circle, rect) {
		
		var cx = circle.posX,
			cy = circle.posY,
			radius = circle.width,
			rx = rect.posX,
			ry = rect.posY,
			rw = rect.width,
			rh = rect.height;

		var testX = cx;
		var testY = cy;

		// which edge is closest?
		if (cx < rx)         testX = rx;      // test left edge
		else if (cx > rx+rw) testX = rx+rw;   // right edge
		if (cy < ry)         testY = ry;      // top edge
		else if (cy > ry+rh) testY = ry+rh;   // bottom edge

		// get distance from closest edges
		var distX = cx-testX;
		var distY = cy-testY;
		var distance = Math.sqrt( (distX*distX) + (distY*distY) );
		lastHitX = distX;
		lastHitY = distY;
		// if the distance is less than the radius, collision!
		if (distance <= radius) {
		return true;
		}
		return false;
	}
	
	
	function Rect(posX = centerX, posY = 30, width = 8, height = 90) {
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.color = 'white';
		
		this.draw = function() {
			c.beginPath();
			c.rect(this.posX, this.posY, this.width, this.height);
			c.fillStyle = this.color;
			c.fill();
		}
	}
	

		
	if( typeof mkw !== 'undefined' && mkw > 0 && mkw <= 4) {
		//numOfPlayers = mkw;
		console.log('>> MKW: ' + numOfPlayers);

		var players = [];
		for(var j=0 ; j < numOfPlayers ; j++) {
			players.push(new Ball(playerKeys[j]));
		}

		//var finishLine = new Rect();
			
		//var walls = [];
			//createWalls();
			
		
		loop();
		
		/*function createWalls() {
			var wallSize = 30;
			var boxSize = 60;
			
			walls.push(new Wall(0,0,canvas.width,wallSize));
			walls.push(new Wall(0,canvas.height - wallSize,canvas.width,wallSize));
			walls.push(new Wall(0,0,wallSize,canvas.height));
			walls.push(new Wall(canvas.width - wallSize,0,wallSize,canvas.height));
			
			walls.push(new Wall(canvas.width - 480,canvas.height * 0.25 - boxSize / 2,280,boxSize));
			walls.push(new Wall(canvas.width - 480,canvas.height * 0.75 - boxSize / 2,280,boxSize));
			walls.push(new Wall(0,centerY - boxSize / 2,280,boxSize));
			walls.push(new Wall(canvas.width - 200,canvas.height * 0.25 - boxSize / 2,boxSize,canvas.height * 0.5 + boxSize));

		}*/
		


		function clearBoard() {
			c.beginPath();
			c.rect(0, 0, canvas.width, canvas.height); 
			//c.fillStyle = 'rgba(0,0,0,0.2)';
			c.fillStyle = mainBackgroundColor;
			c.strokeStyle = mainBorderColor;
			c.fill();
			c.stroke();
		}

		function gameStart() {
			c.beginPath();
			c.font = (100 - count%100) * 5 + 'px Arial';
			console.log(count%100);
			c.fillStyle = 'rgba(255,0,0,' + (count%100)/80 + ')';
			c.textAlign = 'center';
			c.fillText(1+  parseInt(count/100),centerX, centerY);
		}
		
		function drawInfo() {
			c.beginPath();
			c.font = '16px Arial';
			c.fillStyle = 'white';
			c.textAlign = 'center';
			for(var j=0 ; j < players.length ; j++) {
				c.fillText('P' + players[j].id,players[j].posX, players[j].posY - players[j].height - 10);
			}
		}
		
		function drawFrame() {
			//finishLine.draw();
			//for(var i=0 ; i < walls.length ; i++) walls[i].draw();
			for(var j=0 ; j < players.length ; j++) players[j].move();
			
		}
		
		
		
		function loop() {
			if(run) requestAnimationFrame(loop);
			
			clearBoard();

			drawFrame();
			
			initializeColors();
			
			//checkPlayerCollisions();
			checkColisions();

			addScore();
		
		
			count++;
			//if(count > 50) run = false;
			
			startListening();
			/*if(count <= 0) {
				startListening();
			}
			else {
				gameStart();
				drawInfo();
				count--;
			}	*/
		}



		function initializeColors() {
			for(var j=0 ; j < players.length ; j++) {
				players[j].color = players[j].defaultColor;
			}
			mainBorderColor = '#ffffff';
			mainBackgroundColor = 'rgba(0,0,0)';
		}
		
		function addScore() {
			score += 10;
			scoreDiv.text(numberWithCommas(score));
		}

		

		
		function checkPlayerCollisions() {
			if(players.length > 1) {
				for(var i=0 ; i < players.length ; i++) {
					for(var j=i+1 ; j < players.length ; j++) {
						if(circleColision(players[i], players[j])) {
							players[j].speedX = 0;
							players[j].speedY = 0;
							players[i].speedX = 0;
							players[i].speedY = 0;
						}
					}
				}
			}
		}
		
				
		function checkColisions() {
			for(var j=0 ; j < players.length ; j++) {
				if(players[j].hitWall() /*|| players[j].hitMyself()*/) {
					gameOver();
				}
			}
		}
		
	

		function removePlayer(player) {
			var index = player.id - 1;
			if (index > -1) {
				players.splice(index, 1);
			}
			players.length == 0 ? player.healthDiv.text('Winner!') : player.healthDiv.text('Dead');
			
			for(var j=index ; j < players.length ; j++) {
				players[j].id--;
			}
		}

		function GotHit(player) {
			player.health--;
			if(player.health >= 0) {
				player.healthDiv.text(player.health);
				console.log('Player' + player.id + ': "Ouch!"');
				player.color = 'red';
				mainBorderColor = 'red';
				mainBackgroundColor = 'rgba(100,25,25)';
				player.showHealthTag();
			}
			else {
				removePlayer(player);
				if(CheckIfAllDied())
					gameOver();
			}
		}
		
		function CheckIfAllDied() {
			if(players.length == 0) return true;
			return false;
		}
		
		function checkRaceCompleate(player) {
			if(player.loop == numberOfLoops)
				gameOver();
		}
		
		function gameOver() {
			run = false;
			console.error('Game Over');
		}
		

		function drawGotPoint(x, reyct) {
			c.beginPath();
			c.font = '16px Arial';
			c.textAlign = 'center';
			c.fillStyle = 'white';
			c.fillText('+1',this.posX, this.posY - this.width - 10);
			c.fillStyle = this.color;
			c.fill();
		}
		
		
		function getElementPosition(obj) {
			var curleft = 0, curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
				return { x: curleft, y: curtop };
			}
			return undefined;
		}

		function getEventLocation(element,event){
				var pos = getElementPosition(element);
			
			return {
					x: (event.pageX - pos.x),
				y: (event.pageY - pos.y)
			};
		}

		function rgbToHex(r, g, b) {
			if (r > 255 || g > 255 || b > 255)
				throw "Invalid color component";
			return ((r << 16) | (g << 8) | b).toString(16);
		}
		
		
		canvas.addEventListener("mousemove",function(e){
		    var eventLocation = getEventLocation(this,e);
			var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
			
			/*c.beginPath();
			c.arc(eventLocation.x, eventLocation.y, 10, 0, 2*Math.PI);
			c.strokeStyle = 'red';
			c.stroke();*/
			
			// Get the data of the pixel according to the location generate by the getEventLocation function
			var context = this.getContext('2d');
			var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 

			// If transparency on the image
			if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
						coord += " (Transparent color detected, cannot be converted to HEX)";
			}
			
			var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
			
			// Draw the color and coordinates.
			console.log(coord, hex);
			$('body').css('background', hex);
		},false);

		
	
		function startListening() {
			document.addEventListener("keydown", onKeyPress);
			document.addEventListener("keyup", onKeyPress);
		}	
		
		function onKeyPress(e) {
			e = e || event; 
			map[e.keyCode] = e.type == 'keydown';
		}
	}
	else {
		$('body').html('mkw not defined or currect. Please select how many players with mkw 1-4');
	}


});

