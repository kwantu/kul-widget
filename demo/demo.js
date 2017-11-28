var $scope = document.querySelector('dom-bind')
var URLParams = window.utils.URLParams
$scope.configId = URLParams['id']
$scope.modelId = URLParams['model'] 