(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputLocalStorage', InputLocalStorage);
		
    InputLocalStorage.$inject = ['$rootScope', '$http', '$q'];    
	
	function InputLocalStorage($rootScope, $http, $q) {
        var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            inputs: [],

            getInputs: getInputs,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setInput: setInput,

            uploadInput: uploadInput,
            _sort: sort
        };
		
        function getInputs() {
            if (InputLocalStorage.inputs === undefined) {
                var inputs = localStorage.getItem('warehouse_inputs');
                inputs = JSON.parse(inputs);
                InputLocalStorage.inputs = inputs;
            }

            if (InputLocalStorage.inputs === null) {
                InputLocalStorage.inputs = [];
            }

            return InputLocalStorage.inputs.sort(sort);
        }
		
        function addItem(item) {
            InputLocalStorage.inputs.push(item);
            setInput();
        }
		
        function editItem(item) {
            var inputs = InputLocalStorage.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == item.id) {
                    inputs.splice(i, 1, item);
                    setInput();
                    break;
                }
            }
        }
		
        function deleteItem(id) {
            var inputs = InputLocalStorage.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == id) {
                    inputs.splice(i, 1);
                    setInput();
                    break;
                }
            }
        }

        function setInput() {
            localStorage.setItem('warehouse_inputs', JSON.stringify(InputLocalStorage.inputs));
        }

        function uploadInput(inputs) {
            localStorage.setItem('warehouse_inputs', JSON.stringify(inputs));
            InputLocalStorage.inputs = undefined;
        }

        function sort(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
    }
})();
