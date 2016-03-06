(function () {
    'use strict';

    angular
        .module('app')
        .factory('OutputsLocalStorage', OutputsLocalStorage);
		
    OutputsLocalStorage.$inject = ['$rootScope'];    
	
    function OutputsLocalStorage($rootScope) {
        var webUrl = $rootScope.myConfig.webUrl;
		
        return {
            outputs: [],
            getOutputs: getOutputs,
	        addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setOutput: setOutput,
            uploadOutput: uploadOutput,
            _sort: sort
        };
		
        function getOutputs() {
            if (OutputsLocalStorage.outputs === undefined) {
                var outputs = localStorage.getItem('ui-warehouse.outputs');
                outputs = JSON.parse(outputs);
                OutputsLocalStorage.outputs = outputs;
            }

            if (OutputsLocalStorage.outputs === null) {
                OutputsLocalStorage.outputs = [];
            }

            return OutputsLocalStorage.outputs.sort(sort);
        }
		
        function addItem(item) {
            OutputsLocalStorage.outputs.push(item);
            setOutput();
        }
		
        function editItem(item) {
            var outputs = OutputsLocalStorage.outputs;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].id == item.id) {
                    outputs.splice(i, 1, item);
                    setOutput();
                    break;
                }
            }
        }
			
        function deleteItem(id) {
            var outputs = OutputsLocalStorage.outputs;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i].id == id) {
                    outputs.splice(i, 1);
                    setOutput();
                    break;
                }
            }
        }

        function setOutput() {
            localStorage.setItem('ui-warehouse.outputs', JSON.stringify(OutputsLocalStorage.outputs));
        }

        function uploadOutput(outputs) {
            localStorage.setItem('ui-warehouse.outputs', JSON.stringify(outputs));
            OutputsLocalStorage.outputs = undefined;
        }

        function sort(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
    }
})();
