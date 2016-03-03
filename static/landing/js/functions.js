(function() {

	//back to homepage
	$(".mc-back").click(function() {
		$(".mc-login, .mc-signup, .mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").hide(500, function() {
			$(".mc-home").show(500);
		});
	});

	// show login screen
	$(".mc-loginbtn").click(function() {
		$(".mc-login").toggle(500);
	});

	// show signup screen,hide login
	$(".mc-smsignup").click(function() {

		$(".mc-login").hide(500, function() {
			$(".mc-signup").show(500);
		});
	});

	// show login screen, hide signup
	$(".mc-smlogin").click(function() {

		$(".mc-signup").hide(500, function() {
			$(".mc-login").show(500);
		});
	});

	//show signup screen
	$(".mc-signupbtn").click(function() {
		$(".mc-signup").show(500);

	});

	//learnmore functions
	$(".mc-btnlm1").click(function() {


		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore1").fadeIn(1000);
		});
	});

	$(".mc-btnlm2").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore2").fadeIn(1000);
		});
	});

	$(".mc-btnlm3").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore3").fadeIn(1000);
		});
	});

	$(".mc-btnlm4").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore4").fadeIn(1000);
		});
	});


	$(".mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").click(function() {
		$(".mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").fadeOut(0, function() {
			$(".mc-home").fadeIn(500);

		});
	});

	//$('.mc-pd-submit').click(function(){
	//	console.log('ajaja')
	//	$.ajax({
	//		method: "POST",
	//		url:"api/v1/auth/finish"
	//	})
	//});

	console.log('sad');
	 $.ajax({
		 method: "GET",
		 url:"api/v1/personal/me"
		 })
		.done(function(a,b) {
			console.log( "success", a,b);
		})
		.fail(function() {
			console.log( "error" );
		})
		.always(function() {
			console.log( "complete" );
		});

})();