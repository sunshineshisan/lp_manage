import $http from '../http.js';
export default {
	login: function(data) {
		return $http.get('/api/get/login',data)
	},
	addDating: function(data) {
		return $http.get('/api/add/dating',data)
	},
	delDating: function(data) {
		return $http.get('/api/del/dating',data)
	},
	updateDating: function(data) {
		return $http.get('/api/update/dating',data)
	},
	getDating: function(data) {
		return $http.get('/api/get/dating',data)
	},

	
	addSquare: function(data) {
		return $http.get('/api/add/square',data)
	},
	getSquare: function(data) {
		return $http.get('/api/get/square',data)
	},
	delSquare: function(data) {
		return $http.get('/api/del/square',data)
	},
	updateSquare: function(data) {
		return $http.get('/api/update/square',data)
	},
	
	
	addConvension: function(data) {
		return $http.get('/api/add/convension',data)
	},
	getConvension: function(data) {
		return $http.get('/api/get/convension',data)
	},
	updateConvension: function(data) {
		return $http.get('/update/convension',data)
	},
	delConvension: function(data) {
		return $http.get('/del/convension',data)
	},
	delUser: function(data) {
		return $http.get('/api/del/users',data)
	},
	getUser: function(data) {
		return $http.get('/api/get/user',data)
	},
	updateUser: function(data) {
		return $http.get('/api/update/user',data)
	},
	
	getOrder: function(data) {
		return $http.get('/api/get/order',data)
	},
	addOrder: function(data) {
		return $http.get('/api/get/set_order',data)
	},
	setOrder: function(data) {
		return $http.get('/api/update/order',data)
	},
	validOrder: function(data) {
		return $http.get('/api/set/validOrder',data)
	},
	updateMoney: function(data) {
		return $http.get('/api/set/updateMoney',data)
	},
	delOrder: function(data) {
		return $http.get('/api/del/order',data)
	},
	
	addVote: function(data) {
		return $http.get('/api/add/vote',data)
	},
	getVote: function(data) {
		return $http.get('/api/get/vote',data)
	},
	delVote: function(data) {
		return $http.get('/api/del/vote',data)
	},
	setVote: function(data) {
		return $http.get('/api/set/vote',data)
	},
	//system
	getSys: function(data) {
		return $http.get('/api/get/sys',data)
	},
	setSys: function(data) {
		return $http.get('/api/set/sys',data)
	},
	//staff
	addStaff: function(data) {
		return $http.get('/api/add/staff',data)
	},
	delStaff: function(data) {
		return $http.get('/api/del/staff',data)
	},
	setStaff: function(data) {
		return $http.get('/api/set/staff',data)
	},
	getStaff: function(data) {
		return $http.get('/api/get/staff',data)
	},
	//vip
	addVip: function(data) {
		return $http.get('/api/add/vip',data)
	},
	delVip: function(data) {
		return $http.get('/api/del/vip',data)
	},
	setVip: function(data) {
		return $http.get('/api/set/vip',data)
	},
	getVip: function(data) {
		return $http.get('/api/get/vip',data)
	},
}