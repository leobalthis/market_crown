App.factory('APIService', ['$http','$q',function ($http,$q) {

	var headers = {'Content-Type': 'application/json'};
	var urlBase = 'https://marketcrown.com/api/v1'

	function getHttp(url,data){
		var data = data?data:{};
		return request({
			method: 'GET',
			url:urlBase+url,
			headers:headers,
			data:data
		})
	}

	function postHttp(url,data){
		var data = data?data:{};
		return request({
			method: 'POST',
			url:urlBase+url,
			headers:headers,
			data:data
		})
	}


	function request(req){
		return $q(function(resolve, reject) {
			$http(req).then(function (resp) {
				if (!res || !res.data) {
					console.error('Responce error');
					reject('Responce error');
				} else if (res.data.error) {
					console.error('Responce error',res.data.error);
					reject(res.data.error)
				} else {
					console.log('<<',res.data);
					resolve(null, res.data)
				}
			}, function (err) {
				reject(err)
			})
		});
	}

	return {
		getHttp:getHttp,
		postHttp:postHttp
	};
}]);
