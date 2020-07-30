class Item {

    constructor(sku, name, price) {
        this.sku = sku;
        this.name = name;
        this.price = price;
    }
}
class Rule {
    constructor(sku, operation) {
        this.sky = sku;
        //operation is the function to perform on the numbers
        this.operation = operation;
    }
    
}
let ipad = new Item("ipd", "Super iPad", 549.99);
let mbp = new Item("mbp", "MacBook Pro", 1399.99);
let atv = new Item("atv", "Apple TV", 109.50);
let vga = new Item("vga", "VGA Adapter", 30);

let itemMap = {
    "atv": atv,
    "mbp": mbp,
    "ipd": ipad,
    "vga": vga
};
class Checkout {
    constructor(rules) {
        this.rules = rules;
        this.items = [];
    }
    
    scan(item) {
        this.items.push(item);
    }
    getItemScanMap() {
        //map each sku to an item array
        let itemQtyMap = new Map();
        this.items.forEach(item => {
            //create a map of unique items added to cart
            if(itemQtyMap.has(item.sku)) {
                let count = itemQtyMap.get(item.sku);
                itemQtyMap.set(item.sku, count += 1);
            } else {
                itemQtyMap.set(item.sku,1);
            }
        });
        return itemQtyMap;
    }
    total() {
        //do we log total to console?'
        //first seggregate all the items in the cart using reduce
        //reduce it to an array of objects {sku: qty}
        let itemQtyMap = this.getItemScanMap();
        //now we have a map of items and their quantaties
        //apply the rules
        let total = 0;
        itemQtyMap.forEach((value, key) => {
            let iForPrice = itemMap[key];
            if(key === "atv") {
                let actualQty = value - (value / 3);
                total += actualQty * iForPrice.price;
            } else if (key === "ipad") {
                //price drops to 3
                if(value > 4) {
                    total += value * 499.99;
                } else {
                    total += value * iForPrice.price;
                }
            } else {
                total += value * iForPrice.price;
            }
        });
        return total;
    }
}

let rules = {
    "atv": {
        rule: "3 for price of 2"
    }, 
    "ipd" : {
        rule: "> 4 price = 499"
    },
    "mbp": {
        rule: "free adapter for every pro"
    },
    "vga": {
        rule: "free with every macbook pro"
    }
};


let checkout = new Checkout(rules);
checkout.scan(atv);
checkout.scan(atv);
checkout.scan(atv);
checkout.scan(vga);
checkout.total();
//console.log(`Total is => ${checkout.total()}`);

module.exports = {
    "checkout": Checkout,
    "item": Item,
    "rules": rules,
}