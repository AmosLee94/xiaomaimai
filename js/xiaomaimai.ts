// 商品：
//     名称
//     最低价
//     最高价
class Item{
    name: string;
    minPrice: number;
    maxPrice: number;
    presentPrice: number;
    constructor(name: string, minPrice:number, maxPrice: number) {
        this.name = name;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.updatePrice();
    }
    public updatePrice() {
        this.presentPrice = Math.round(this.minPrice + (this.maxPrice - this.minPrice) * Math.random());
        console.log(`name: ${this.name}, presentPrice: ${this.presentPrice}`);
    }
}
class Store{
    private allItem:Item[];
    public shownItem:Item[];
    public shownItemSum:number;
    constructor() {
        this.shownItemSum = 5;
        this.allItem = [new Item("大白菜", 5, 20), new Item("大汽车", 1000, 3000), new Item("小灵通", 200, 400), new Item("小山羊", 2000, 3000), new Item("胡萝卜", 5, 30), new Item("爱疯叉", 8000, 15000), new Item("大冰箱", 8000, 30000)];
        console.log("----------");
        this.shownItem = [];
        this.updateShownItem();
    }
    public updateShownItem(){
        let allItemSum :number = this.allItem.length;
        let shownItemSum :number = this.shownItemSum;
        if (shownItemSum >= allItemSum) {
            // 如果所有的商品过少则所有的展示出来
            this.shownItem = this.allItem;
            for (let i = 0; i < allItemSum; i ++){
                this.allItem[i].updatePrice();
            }
        }else{
            console.log("--------------");
            this.shownItem = [];
            let shownItemIds = [];
            let shownItemSum = this.shownItemSum;
            for (let i = 0; i < shownItemSum; i ++){
                let newId : number;
                do {
                    
                    newId = ~~(Math.random() * shownItemSum);
                } while (shownItemIds.indexOf(newId) > -1);
                shownItemIds.push(newId);
                // console.log(this.shownItem);
                this.shownItem.push(this.allItem[newId]);
                this.allItem[newId].updatePrice();
            }
            // console.log(this.shownItem.length);
            // console.log("--------------");
        }
    }
}

class Good{
    public name:string;
    public price: number;
    public sum:number;
    constructor(name:string,  price: number, sum:number) {
        this.name = name;
        this.price = price;
        this.sum = sum;
    }
}
class Warehouse{
    warehouseVolume: number;
    sum: number;
    goodlist: Good[];
    constructor(warehouseVolume: number) {
        this.warehouseVolume = warehouseVolume;
        this.goodlist = [];
        this.sum = 0;
    }
    private indexOf(goodName:string):number{
        for(let i = 0; i < this.goodlist.length; i ++){
            if(this.goodlist[i].name == goodName){
                return i;
            }
        }
        return -1;
    }
    public push(item :Item, sum :number){
        // console.log(item.presentPrice);
        if(this.sum + sum > this.warehouseVolume){
            console.log("[error]仓库存不下，拒绝入库");
        }else{
            let goodIndex :number = this.indexOf(item.name);
            if(goodIndex == -1){
                // 仓库里还没有这个货物
                let newGood = new Good(item.name, item.presentPrice, sum);
                this.goodlist.push(newGood);
                console.log(`name:${item.name},  price:${item.presentPrice}, sum:${sum}, `);
            } else{
                //仓库已有这个货物
                let priceA = this.goodlist[goodIndex].price;
                let sumA = this.goodlist[goodIndex].sum;
                let priceB = item.presentPrice;
                let sumB = sum;
                console.log(`priceA:${priceA},sumA:${sumA},priceB:${priceB},sumB:${sumB}`);
                this.goodlist[goodIndex].price = Math.round((priceA * sumA + priceB * sumB )/ (sumA + sumB));
                this.goodlist[goodIndex].sum = sumA + sumB;
                console.log(`name:${item.name},  price:${this.goodlist[goodIndex].price}, sum:${this.goodlist[goodIndex].sum}, `);
            }
            this.sum += sum;
        }
    }
    public test(aaa){
        console.log(aaa);
    }
}
// 玩家信息
//     现金
//     存款
//     仓库容量
//     健康程度
//     名声
class Player{
    cash: number;
    deposit: number;
    health: number;
    reputation: number;
    constructor(cash: number, deposit:number,  health:number, reputation: number) {
        this.cash = cash;
        this.deposit = deposit;
        this.health = health;
        this.reputation = reputation;
    }
}
class Game{
    store:Store;
    warehouse :Warehouse;
    player:Player;
    constructor() {
        this.store = new Store();
        this.warehouse = new Warehouse(100);
        this.player = new Player(3000, 0,  100, 100);
    }
    public buy(item,sum){
        let priceSum :number = item.presentPrice * sum;
        let cash :number = this.player.cash;
        let deposit :number = this.player.deposit;
        if(cash + deposit < priceSum){
            console.log(`现金(${cash})和存款(${deposit})共${cash + deposit},不足支付货物(${item.name} * ${sum})的货款(${item.presentPrice * sum}), 购买失败`);
            return false;
        }else if(this.warehouse.sum + sum > this.warehouse.warehouseVolume){
            console.log(`仓库容量不足, 购买失败`);
            return false;
        }else{
            if(cash >= priceSum){
                this.player.cash -= priceSum;
            }else{
                this.player.deposit -= priceSum - cash;
                this.player.cash = 0;
            }
            this.warehouse.push(item,sum);
        }
    }
}
// let game = new Game();
// console.log(game.buy);
// game.buy(game.store.shownItem[0],10);
// console.log(game);
// game.warehouse.push(game.store.shownItem[1], 10);
// game.store.updateShownItem();
// game.warehouse.push(game.store.shownItem[2], 34);
// game.store.updateShownItem();
// game.warehouse.push(game.store.shownItem[2], 32);

// console.log(game);
// console.log(Math);