App.factory('APIService', ['$http','$q',function ($http,$q) {

	var headers = {'Content-Type': 'application/json'};
	var urlBase = (window.location.host=='192.168.99.100:3000')?'http://192.168.99.100:3000/api/v1':'https://marketcrown.com/api/v1';

console.log(window.location.host)
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
			$http(req).then(function (res) {
				if (!res || !res.data) {
					console.error('Responce error');
					reject('Responce error');
				} else if (res.data.error) {
					console.error('Responce error',res.data.error);
					reject(res.data.error)
				} else {
					console.log('>>[',req.method,'] ' ,req.url ,'\n <<',res.data);
					resolve(res.data)
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
