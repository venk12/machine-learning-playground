/**
* @file Name            : mainController.js
* @desc                 : controller for main landing page
* @created On           : 2017-03-06
* @created By           : Venki
* @Revision History
* @Sr  Rev    Date       Owner     Change Description
// * @1  0.1  2017-02-13    Venki    Bug Fixes
*/
 
 angular.module('serverManageApp').controller("mainController",mainController)

 mainController.$inject=['$rootScope', '$scope', '$state', '$parse', '$timeout', 'postDataService', 'urlService', 'fetchDataService']
 
function mainController($rootScope, $scope, $state, $parse, $timeout, postDataService, urlService, fetchDataService){
		$state.go("main");
										
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		var x = canvas.width / 2;
		var y = canvas.height - 30;

		var dx = 2;
		var dy = -2;

		var ballRadius = 10;

		var paddleHeight = 10;
		var paddleWidth = 75;
		var paddleX = (canvas.width - paddleWidth) / 2;

		var rightPressed = false;
		var leftPressed = false;

		var brickRowCount = 4;
		var brickColumnCount = 7;
		var brickWidth = 75;
		var brickHeight = 20;
		var brickPadding = 20;
		var brickOffsetTop = 30;
		var brickOffsetLeft = 30;

		var score=0;
		var trainSwitch=true;
		var mode = "train";
		var recordedVar = {
				x:0,
				y:0,
				dx:0,
				dy:0,
				paddleX:0,
				flag:0
		}
		
		$scope.between = function(x, a, b){
			if (x > a && x < b) {
				return true;
			} else {
				return false;
			}
		}

		var bricks = [];

		for (c = 0; c < brickColumnCount; c++) {
			bricks[c] = [];
			for (r = 0; r < brickRowCount; r++) {
				bricks[c][r] = {
					x: 0,
					y: 0,
					status: 1
				};
			}
		}

		var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
		var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
		
		$scope.resetGame = function(){
				console.log("game should be reset")
		}
		
		$scope.modeSwitch = function(args){
				mode=args;
				console.log(mode)
				$scope.resetGame();
		}
		
		$scope.drawBricks = function(){
			for (c = 0; c < brickColumnCount; c++) {
				for (r = 0; r < brickRowCount; r++) {
					if (bricks[c][r].status == 1) {
						var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
						var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
						bricks[c][r].x = brickX;
						bricks[c][r].y = brickY;
						ctx.beginPath();
						ctx.rect(brickX, brickY, brickWidth, brickHeight);
						ctx.fillStyle = "#0095DD";
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}

		$scope.drawBall = function(){
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
			if (y + dy <= canvas.height - paddleHeight - ballRadius) {
				ctx.fillStyle = "yellow";
			} else {
				ctx.fillStyle = "orange";
			}
			ctx.fill();
			ctx.closePath();
		}


		$scope.drawPaddle = function() {
			ctx.beginPath();
			ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
			if (y + dy <= canvas.height - paddleHeight - ballRadius) {
				ctx.fillStyle = "red";
			} else {
				ctx.fillStyle = "orange";
			}
			ctx.fill();
			ctx.closePath();
		}

		$scope.keyDownHandler = function(e) {
			if (e.keyCode == 39) {
				rightPressed = true;
			} else if (e.keyCode == 37) {
				leftPressed = true;
			}
		}

		$scope.keyUpHandler = function(e) {
			if (e.keyCode == 39) {
				rightPressed = false;
			} else if (e.keyCode == 37) {
				leftPressed = false;
			}
		}

		document.addEventListener("keydown", $scope.keyDownHandler, false);
		document.addEventListener("keyup", $scope.keyUpHandler, false);

		$scope.mouseMoveHandler = function(e) {
			var relativeX = e.clientX -canvas.offsetLeft;
			if(relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth/2;
			}
		}

		document.addEventListener("mousemove", $scope.mouseMoveHandler, false);

		$scope.drawScore = function(){
			ctx.font = "14px Calibri";
			ctx.fillStyle = "blue";
			ctx.fillText("Score: "+score, 8, 20)
		}
		
		$scope.collisionDetection = function() {
				for (c = 0; c < brickColumnCount; c++) {
					for (r = 0; r < brickRowCount; r++) {
						var b = bricks[c][r];
						if (b.status == 1) {
							if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
								dy = -dy
								b.status = 0;
								score++;
								if(score == brickRowCount*brickColumnCount) {
								alert("YOU WIN, CONGRATULATIONS!");
								// document.location.reload();
								trainSwitch=false;
								}
							}
						}
					}
				}
		}

		$scope.drawThreshold = function(){
			// ctx.beginPath();
			// ctx.moveTo(0,200);
			// ctx.lineTo(canvas.width,200);
			// ctx.strokeStyle = "blue";
			// ctx.stroke();
			
			// ctx.beginPath();
			// ctx.moveTo(0,canvas.height-paddleHeight-ballRadius);
			// ctx.lineTo(canvas.width,canvas.height-paddleHeight-ballRadius);
			// ctx.strokeStyle = "orange";
			// ctx.stroke();
		}
		
		$scope.checkRecord = function(){
			console.log(recordedVar)
		}
		
		$scope.connectPython=function(args,method){		
			clickvar= JSON.parse(JSON.stringify(postDataService.getPostData()))
			clickvar[0].x=args.x
			clickvar[0].y=args.y
			clickvar[0].dx=args.dx
			clickvar[0].dy=args.dy
			clickvar[0].paddleX=args.paddleX
			clickvar[0].flag=args.flag
			
			if(method=="train"){
				clickvar[0].trainOrTest=0
				console.log("comes to train")
				console.log(clickvar)
				fetchDataService.getData("POST",urlService.getBaseUrl,urlService.getTrainUrl,clickvar)
								.then(function(response) {
										console.log(response);
								})
			}
			
			if(method=="test"){
				clickvar[0].trainOrTest=1
				console.log("comes to test")
				console.log(clickvar)
				fetchDataService.getData("POST",urlService.getBaseUrl,urlService.getTestUrl,clickvar)
								.then(function(response) {
										paddleX=response;
										console.log(response);
								})
			}
		}
		
		$scope.drawRecordStatus = function(){
			if(mode=="train"){
				ctx.beginPath();
				ctx.arc(420, 15, 5, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'red';
				ctx.fill()
				ctx.font = "14px Calibri";
				ctx.fillStyle = "white";
				ctx.fillText("Now observing...",430,20)
			}
			if(mode=="test"){
				ctx.beginPath();
				ctx.arc(420, 15, 5, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'yellow';
				ctx.fill()
				ctx.font = "14px Calibri";
				ctx.fillStyle = "white";
				ctx.fillText("Playing on my own...",430,20)
			}
		}
		
		$scope.draw = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			$scope.drawBall();
			$scope.drawPaddle();
			$scope.drawBricks();
			$scope.collisionDetection();
			$scope.drawScore();
			$scope.drawThreshold();
			$scope.drawRecordStatus();
			
			// For boundary and paddle collision
			if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
				dx = -dx;
			}
			if (y + dy < ballRadius) {
				dy = -dy;
			} else if (y + dy > canvas.height - paddleHeight - ballRadius) {
				if (x > paddleX && x < paddleX + paddleWidth) {
					dy = -dy;
				} else {
					// alert("GAME OVER");
					trainSwitch=false;
					// document.location.reload();
				}
			}

			// For brick collision
			if (rightPressed && paddleX < canvas.width - paddleWidth) {
				paddleX += 7;
			} else if (leftPressed && paddleX > 0) {
				paddleX -= 7;
			}
			
			//For recording events
			if(y+dy==200 && y<200){	
				recordedVar.x=x;
				recordedVar.y=y;
				recordedVar.dx=dx;
				recordedVar.dy=dy;
				if(mode=="test"){
					$scope.connectPython(recordedVar,mode)
				}
			}
									
			if(y + dy == canvas.height - paddleHeight - ballRadius && y <= canvas.height - paddleHeight - ballRadius){
				recordedVar.paddleX=paddleX;
			}
			
			if(y + dy > canvas.height - paddleHeight - ballRadius && y == canvas.height - paddleHeight - ballRadius){
				recordedVar.flag=0;
				if(mode=="train"){
				   $scope.connectPython(recordedVar,mode)
				}
				dx=0;
				dy=0;
			}
			
			if(y + dy < canvas.height - paddleHeight - ballRadius && y == canvas.height - paddleHeight - ballRadius){
				recordedVar.flag=1;		
				if(mode=="train"){
				   $scope.connectPython(recordedVar,mode)
				}
			}
			

			x += dx;
			y += dy;
			requestAnimationFrame($scope.draw);			
		}
		//setInterval(draw, 10);
		$scope.draw();

		$scope.train = function(){
			// console.log("train");
			// if(trainSwitch){
			// console.log(x,y);
			// console.log(paddleX);
			
			
			// }
		}
		setInterval($scope.train,10)

		$scope.test = function(){
			// console.log(paddleX)
		}	

}