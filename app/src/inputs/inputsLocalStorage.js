(function () {
    'use strict';

    angular
        .module('app')
        .factory('InputsLocalStorage', InputsLocalStorage);

    function InputsLocalStorage() {
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
            if (InputsLocalStorage.inputs === undefined) {
                var inputs = localStorage.getItem('ui-warehouse.inputs');
                inputs = JSON.parse(inputs);
                InputsLocalStorage.inputs = inputs;
            }

            if (InputsLocalStorage.inputs === null) {
                InputsLocalStorage.inputs = [];
            }

            return InputsLocalStorage.inputs.sort(sort);
        }

        function addItem(item) {
            InputsLocalStorage.inputs.push(item);
            setInput();
        }

        function editItem(item) {
            var inputs = InputsLocalStorage.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == item.id) {
                    inputs.splice(i, 1, item);
                    setInput();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var inputs = InputsLocalStorage.inputs;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id == id) {
                    inputs.splice(i, 1);
                    setInput();
                    break;
                }
            }
        }

        function setInput() {
            localStorage.setItem('ui-warehouse.inputs', JSON.stringify(InputsLocalStorage.inputs));
        }

        function uploadInput(inputs) {
            localStorage.setItem('ui-warehouse.inputs', JSON.stringify(inputs));
            InputsLocalStorage.inputs = undefined;
        }

        function sort(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
    }
})();
