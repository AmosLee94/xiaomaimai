function isNum(s) {
    return (s != null && s != "") ? !isNaN(s) : false;
}
// 商品：
//     名称
//     最低价
//     最高价
var Item = /** @class */ (function () {
    function Item(name, minPrice, maxPrice) {
        this.name = name;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.updatePrice();
    }
    Item.prototype.updatePrice = function () {
        this.presentPrice = Math.round(this.minPrice + (this.maxPrice - this.minPrice) * Math.random());
        console.log("name: " + this.name + ", presentPrice: " + this.presentPrice);
    };
    return Item;
}());
var Store = /** @class */ (function () {
    function Store() {
        this.shownItemSum = 5;
        this.allItem = [
            new Item("大白菜", 5, 20),
            new Item("大汽车", 15000, 35000),
            new Item("小灵通", 200, 400),
            new Item("小山羊", 800, 1500),
            new Item("胡萝卜", 5, 30),
            new Item("爱疯叉", 8000, 15000),
            new Item("大冰箱", 8000, 30000)
        ];
        console.log("----------");
        this.shownItem = [];
        this.updateShownItem();
    }
    Store.prototype.updateShownItem = function () {
        var allItemSum = this.allItem.length;
        var shownItemSum = this.shownItemSum;
        if (shownItemSum >= allItemSum) {
            // 如果所有的商品过少则所有的展示出来
            this.shownItem = this.allItem;
            for (var i = 0; i < allItemSum; i++) {
                this.allItem[i].updatePrice();
            }
        }
        else {
            console.log("--------------");
            this.shownItem = [];
            var shownItemIds = [];
            var shownItemSum_1 = this.shownItemSum;
            for (var i = 0; i < shownItemSum_1; i++) {
                var newId = void 0;
                do {
                    newId = ~~(Math.random() * allItemSum);
                } while (shownItemIds.indexOf(newId) > -1);
                shownItemIds.push(newId);
                // console.log(this.shownItem);
                this.shownItem.push(this.allItem[newId]);
                this.allItem[newId].updatePrice();
            }
            // console.log(this.shownItem.length);
            // console.log("--------------");
        }
    };
    Store.prototype.indexOf = function (itemName) {
        for (var i = 0; i < this.shownItem.length; i++) {
            if (this.shownItem[i].name == itemName) {
                return i;
            }
        }
        return -1;
    };
    return Store;
}());
var Good = /** @class */ (function () {
    function Good(name, price, sum) {
        this.name = name;
        this.price = price;
        this.sum = sum;
    }
    return Good;
}());
var Warehouse = /** @class */ (function () {
    function Warehouse(warehouseVolume) {
        this.warehouseVolume = warehouseVolume;
        this.goodlist = [];
        this.sum = 0;
    }
    Warehouse.prototype.indexOf = function (goodName) {
        for (var i = 0; i < this.goodlist.length; i++) {
            if (this.goodlist[i].name == goodName) {
                return i;
            }
        }
        return -1;
    };
    Warehouse.prototype.push = function (item, sum) {
        // console.log(item.presentPrice);
        if (this.sum + sum > this.warehouseVolume) {
            console.log("[error]仓库存不下，拒绝入库");
        }
        else {
            var goodIndex = this.indexOf(item.name);
            if (goodIndex == -1) {
                // 仓库里还没有这个货物
                var newGood = new Good(item.name, item.presentPrice, sum);
                this.goodlist.push(newGood);
                console.log("name:" + item.name + ",  price:" + item.presentPrice + ", sum:" + sum + ", ");
            }
            else {
                //仓库已有这个货物
                var priceA = this.goodlist[goodIndex].price;
                var sumA = this.goodlist[goodIndex].sum;
                var priceB = item.presentPrice;
                var sumB = sum;
                console.log("priceA:" + priceA + ",sumA:" + sumA + ",priceB:" + priceB + ",sumB:" + sumB);
                this.goodlist[goodIndex].price = Math.round((priceA * sumA + priceB * sumB) / (sumA + sumB));
                this.goodlist[goodIndex].sum = sumA + sumB;
                console.log("name:" + item.name + ",  price:" + this.goodlist[goodIndex].price + ", sum:" + this.goodlist[goodIndex].sum + ", ");
            }
            this.sum += sum;
        }
    };
    Warehouse.prototype.unload = function (good, sum) {
        console.log("good.sum:" + good.sum + ",sum:" + sum);
        // console.log(item.presentPrice);
        if (sum > good.sum) {
            console.log("[error]数据错误，仓库内并没有这么多货物");
            return false;
        }
        else {
            if (sum == good.sum) {
                this.goodlist.splice(this.indexOf(good.name), 1);
                good.sum -= sum;
            }
            else {
                good.sum -= sum;
            }
            this.sum -= sum;
            return true;
        }
    };
    return Warehouse;
}());
// 玩家信息
//     现金
//     存款
//     仓库容量
//     健康程度
//     名声
var Player = /** @class */ (function () {
    function Player(cash, deposit, health, reputation) {
        this.cash = cash;
        this.deposit = deposit;
        this.health = health;
        this.reputation = reputation;
    }
    return Player;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.store = new Store();
        this.warehouse = new Warehouse(100);
        this.player = new Player(3000, 0, 100, 100);
        this.dayNum = 1;
        this.dateLine = 365;
    }
    Game.prototype.deductCash = function (cashNum) {
        if (this.player.cash >= cashNum) {
            this.player.cash -= cashNum;
        }
        else {
            this.player.deposit -= cashNum - this.player.cash;
            this.player.cash = 0;
        }
    };
    Game.prototype.buy = function (item) {
        var cash = this.player.cash;
        var deposit = this.player.deposit;
        var warehouseSurplus = this.warehouse.warehouseVolume - this.warehouse.sum;
        var maxPurchase = parseInt((((cash + deposit) / item.presentPrice)).toString());
        // console.log(warehouseSurplus +':'+maxPurchase);
        // console.log(`cash: ${cash}, deposit: ${deposit}, warehouseSurplus: ${warehouseSurplus}, maxPurchase: ${maxPurchase}`);
        maxPurchase = maxPurchase <= warehouseSurplus ? maxPurchase : warehouseSurplus;
        var sum = parseInt(prompt("\u8BF7\u8F93\u5165\u4F60\u60F3\u8D2D\u4E70\u7684\u6570\u91CF(\u6700\u591A\u53EF\u4EE5\u8D2D\u4E70" + maxPurchase + ")", maxPurchase.toString()));
        if (isNum(sum)) {
            var priceSum = item.presentPrice * sum;
            if (cash + deposit < priceSum) {
                console.log("\u73B0\u91D1(" + cash + ")\u548C\u5B58\u6B3E(" + deposit + ")\u5171" + (cash + deposit) + ",\u4E0D\u8DB3\u652F\u4ED8\u8D27\u7269(" + item.name + " * " + sum + ")\u7684\u8D27\u6B3E(" + item.presentPrice * sum + "), \u8D2D\u4E70\u5931\u8D25");
                return false;
            }
            else if (this.warehouse.sum + sum > this.warehouse.warehouseVolume) {
                console.log("\u4ED3\u5E93\u5BB9\u91CF\u4E0D\u8DB3, \u8D2D\u4E70\u5931\u8D25");
                return false;
            }
            else {
                this.deductCash(priceSum);
                this.warehouse.push(item, sum);
            }
        }
    };
    Game.prototype.sell = function (good) {
        var index = this.store.indexOf(good.name);
        if (index < 0) {
            console.log("[error]\u8D27\u7269(" + good.name + ")\u4E0D\u5728\u5C55\u793A\u5546\u54C1\u5217\u8868\u4E2D");
            return false;
        }
        else {
            var price = this.store.shownItem[index].presentPrice;
            var sum = parseInt(prompt("\u8BF7\u8F93\u5165\u4F60\u60F3\u51FA\u552E\u7684\u6570\u91CF(\u6700\u591A\u53EF\u4EE5\u51FA\u552E" + good.sum + ")", good.sum.toString()));
            console.log("sum               " + sum);
            console.log("\u5546\u54C1\u4EF7\u683C\uFF1A" + price);
            if (isNum(sum))
                if (this.warehouse.unload(good, sum)) {
                    this.player.cash += price * sum;
                }
                else {
                    console.log("卸货失败，卖货失败");
                }
        }
    };
    Game.prototype.nextDay = function () {
        if (this.dayNum >= this.dateLine) {
            alert("游戏结束");
            return false;
        }
        else {
            this.dayNum += 1;
            this.store.updateShownItem();
        }
    };
    Game.prototype.saveCash = function () {
        this.player.deposit += this.player.cash;
        this.player.cash = 0;
    };
    Game.prototype.drawCash = function () {
        this.player.cash += this.player.deposit;
        this.player.deposit = 0;
    };
    Game.prototype.buyWarehouse = function () {
        var price = 100;
        var maxPurchase = parseInt(((this.player.cash + this.player.deposit) / price).toString());
        var sum = parseInt(prompt("\u8BF7\u8F93\u5165\u4F60\u60F3\u8D2D\u4E70\u4ED3\u5E93\u7684\u6570\u91CF(\u6700\u591A\u53EF\u4EE5\u8D2D\u4E70" + maxPurchase + ")", parseInt((maxPurchase / 2).toString()).toString()));
        if (isNum(sum))
            if (price * sum > this.player.cash + this.player.deposit) {
                console.log("金币不足购买这么多的仓库");
            }
            else {
                this.deductCash(price * sum);
                this.warehouse.warehouseVolume += sum;
            }
    };
    return Game;
}());
