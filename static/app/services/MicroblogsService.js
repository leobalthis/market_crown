App.factory('MicroblogsService', ['APIService', '$q', function (API,$q) {
	return {
		createTopic: function(user, message, market) {
			return API.postHttp('/personal/feed/entry',
			{
					"theme_type" : "topic",
					"user" : user,
					"message": message,
					"image": null,
					"avatar": null,
					"market": market
			});
		},

		getDefaultMicroblogsService: function(user, market, query_type) {
			return API.postHttp('/personal/feed/query',
			{
					"user" : user,
					"market" : market,
					"query_type" : query_type
			});
		},

		getMicroblogsService: function(query) {
			return $q(function(resolve, reject) {
				API.postHttp('/personal/feed/query', query).then(function(res){
					res.opop = 'asddd';
					resolve(res)
				},reject);
			});
		},


		getOnlyMeMicroblogsService: function(user, market) {
			return API.postHttp('/personal/feed/query',
				{
					"user" : user,
					"market" : market,
					"query_type" : "onlyme"
				});
		},

		getRepliesService: function(user, market, theme_id) {
			return API.postHttp('/personal/feed/query',{
					"user" : user,
					"market" : market,
					"query_type" : "response",
					"theme_id" : theme_id
				});
		},

		sendReplyService: function(user, theme_id, replyData) {
			return API.postHttp('/personal/feed/reply',{
					"theme_type" :"reply",
					"theme_id" : theme_id,
					"user" : user,
					"reply": replyData,
					"image":null,
					"avatar":null
				});
		}
	};
}]);
