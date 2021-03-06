$(function(){
	/*var names = [
			{"0" : "cero","1" : "uno","2" : "dos","3" : "tres","4" : "cuatro","5" : "cinco", "6" : "seis","7" : "siete", "8" : "ocho", "9" : "nueve","10" : "diez"},
			{"11" : "once","12" : "doce", "13" : "trece","14" : "catorce", "15" : "quince"},
			["dieci", "veinti", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "noventa"], 
			["cien", "ciento", "cientos", "mil"]
		];*/

	var names = [
			["zero","one","two","three","four","five","six","seven","eight","nine","ten"],
			//{'10': "ten", "11" : "eleven","12" : "twelve", "13" : "thirteen","14" : "fourteen", "15" : "fifteen", "16" : "sixteen", "17" : "seventeen", "18" : "eighteen", "19" : "nineteen"},
			["ten", "eleven","twelve", "thirteen","fourteen","fifteen","sixteen","seventeen", "eighteen", "nineteen"],
			{"2":"twenty", "3" : "thirty", "4": "forty", "5": "fifty", "6": "sixty", "7": "seventy", "8":"eighty", "9": "ninety"}, 
			["","hundred", "thousand", "million","billion","trillion","quadrillion","quintillion","sextillion", "septillion", "nonillion", "decillion", "undecillion","duodecillion","tredecillion", "quattuordecillion", "quindecillion","sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion", "googol"]
		];

	function solve2 (n1, n2, c){
		var r2 = '', r3 = '';
		if(n1==="1"){
			r2 = names[1][parseInt(n2)];
			r3 = '';
		}else if (n1 ==="0"){
			r2 = '';
			r3 = names[0][parseInt(n2)];

		}else{
			
			r2 = names[2][n1];
			r3 = names[0][parseInt(n2)];
		}

		if(n2==="0"){
			r3 = '';
		}

		return r2 + " " + r3 + " " + names[3][c>0 ? c+1 : c];
	}

	function solve3 (a, c){
		var r1 = '', r2 = '', r3 = '';
		//console.log('c= ' + c);
		if(a.length > 2){

			return " " + names[0][a[0]] + " " + names[3][1] + " " +  solve2(a[1],a[2], c)+ " ";

		}
	}

	function extractNumbers(a, count){
		var ex, ret = "", c = count + 1, n = a;

		if (n.length === 1){
			ret += names[0][n[0]] + " " +  names[3][c>0 ? c+1 : c];
		}

		if (n.length === 2){
			ret += solve2(n[0],n[1], c);
		}


		if (n.length === 3){
			ret += solve3([n[0],n[1],n[2]], c);
		}

		
		if (n.length > 3){

			ex = n.splice(n.length-3, 3)

			ret = extractNumbers(n, c) + solve3(ex, c);
		}

		

		return ret;
	}

	function getLetters(num){
		var nums = num.split("");
		if(nums.length > 1 && nums[0]==="0"){
			nums = nums[0] === "0" ? nums.splice(1,nums.length-1) : nums;
			console.log(nums);
		}
		
		if(nums.length>0)
			return extractNumbers(nums, -1);

		return "";
	}

	





	$status = $('#status');

	socket = io.connect();

	socket.on('connect', function(){
		$status.text('Connected');
	});

	socket.on('disconnect', function(){
		$status.text('Disconnected');
	});

	socket.on('reconnecting', function(seconds){
		$status.text("Reconecting in #{seconds} seconds");
	});

	socket.on('reconnect', function(){
		$status.text('Reconnected');
	});

	socket.on('reconnect_failed', function(){
		$status.text('Failed to reconnect');
	});

	socket.on('message', function(msg){
		switch(msg.kind){
			case "setLeader":
				$('#inputContainer').show();
				console.log("CLIENT NUMBER 1");
				break;
			case "sendNumbers":
				$('#resultNumber').text(getLetters(msg.val.toString()));
				$('#txtNumber').val(msg.val.toString());
				console.log(getLetters(msg.val.toString()));
				break;

		}
		
		console.log(msg.kind);
	});

	socket.on('secret', function(msg){
		console.log(msg);
	});

	$input = $('#txtNumber');		

	$input.keyup(function(event){
		$(this).val($(this).val().replace(/[^0-9]/g, ''));

		num = jQuery.trim(event.srcElement.value);
		socket.emit('publish', (Number(num) === 0 && num !== "") ? 0 : num);	
	});



});