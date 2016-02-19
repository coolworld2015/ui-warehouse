(function () {
    'use strict';

    angular
        .module('app')
        .factory('GoodsLocalStorage', GoodsLocalStorage);

    GoodsLocalStorage.$inject = ['$rootScope'];

    function GoodsLocalStorage($rootScope) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            goods: [],
            numPerPage: 10,

            getGoods: getGoods,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setGoods: setGoods,

            uploadGoods: uploadGoods,
            _sort: sort
        };

        function getGoods() {
            if (GoodsLocalStorage.goods === undefined) {
                var goods = localStorage.getItem('ui-warehouse.goods');
                goods = JSON.parse(goods);
                GoodsLocalStorage.goods = goods;
            }

            if (GoodsLocalStorage.goods === null) {
                GoodsLocalStorage.goods = [];
            }

            return GoodsLocalStorage.goods.sort(sort);
        }

        function addItem(item) {
            GoodsLocalStorage.goods.push(item);
            setGoods();
        }

        function editItem(item) {
            var goods = GoodsLocalStorage.goods;
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == item.id) {
                    goods.splice(i, 1, item);
                    setGoods();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var goods = GoodsLocalStorage.goods;
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].id == id) {
                    goods.splice(i, 1);
                    setGoods();
                    break;
                }
            }
        }

        function setGoods() {
            localStorage.setItem('ui-warehouse.goods', JSON.stringify(GoodsLocalStorage.goods));
        }

        function uploadGoods(goods) {
            localStorage.setItem('ui-warehouse.goods', JSON.stringify(goods));
            GoodsLocalStorage.goods = undefined;
        }
		
        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
    }
})();