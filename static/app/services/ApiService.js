App.factory('APIService', ['$http',function ($http) {

	var headers = {'Content-Type': 'application/json'};

	function getHttp(url,data,done){
		request({
			method: 'GET',
			url:url,
			headers:headers,
			data:data
		},done)
	}

	function postHttp(url,data,done){
		request({
			method: 'POST',
			url:url,
			headers:headers,
			data:data
		},done)
	}


	function request(req,done){
		$http(req).then(function(resp){
			if(!res || !res.data){
				console.error('Responce error');
				done('Responce error');
			}else if(res.data.error){
				done(res.data.error)
			}else{
				done(null,res.data)
			}
		},function(err){
			done(err)
		})
	}

	return {
		getHttp:getHttp,
		postHttp:postHttp
	};
}]);
