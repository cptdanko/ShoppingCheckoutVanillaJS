class Item {

    constructor(sku, name, price, bundledWith) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.bundledWith = (bundledWith === undefined) ? null: bundledWith;
    }
}
/*
Each Discount (rule) would have a method apply
apply would take in items and then apply 
a rule which would adjust it's price 
*/
class Discount {
    constructor(sku, apply) {
        this.sky = sku;
        //apply function would perform discount
        //operation on the items and return result
        this.apply = apply;
    }
}

let tvRule = new Discount("atv", (items) => {
    let actualQty = items.length - Math.floor(items.length / 3);
    return actualQty * items[0].price;
});
let ipadRule = new Discount("ipd", (items) => {
    let totalPrice;
    if(items.length > 4) {
        totalPrice = items.length * 499.99;
    } else {
        totalPrice = items.length * items[0].price;
    }
    return totalPrice;
});
Array.prototype.partitionWith = function(f) {
    return this.reduce((a, x) => a[f(x)+0].push(x) && a, [[],[]])
}
//the rule is, all items part of the bundle are free 
let bundleRule = new Discount("mbp", (items) => {
    //find all the elements without a bundleWith
    //find the item with bundlewith nil
    let uItems = items.filter(item => item.bundledWith == null);
    //let's remove the items from items array
    //create a map of the bundled items 
    let total = (uItems.length * uItems[0].price);
    let bundleMap = new Map();
    items.forEach(it => {
        if(it.sku !== uItems[0].sku) {
            let existingArray = bundleMap.get(it.sku);
            if(existingArray) {
                existingArray.push(it);
            } else {
                existingArray = [it];
            }
            bundleMap.set(it.sku, existingArray);
        }
    });
    bundleMap.forEach(function(value, key){
        let toCount = value.length - uItems.length;
        if(toCount > 0) {
            total  += toCount * value[0].price;
        }
    });
    return total;
    //here we have a map of all the items that aren't part of the array


})
function defaultRules(){
    return {
        "atv": tvRule,
        "ipd" : ipadRule,
        "mbp": bundleRule,
    };
}
class Checkout {
    constructor(rules) {
        //only added this condition here as a 
        //convenience
        if(rules == undefined) {
            this.rules = defaultRules();
        } else {
            this.rules = rules;    
        }
        this.items = new Map();
    }
    
    appendItem(sku, item, items) {
        let existingItems = items.get(sku);
        if (existingItems) {
            existingItems.push(item);
        } else {
            existingItems = [item];
        }
        items.set(sku, existingItems);
    }
    scan(item) {
        if(item.bundledWith != null) {
            this.appendItem(item.bundledWith, item, this.items);
        } else {
            this.appendItem(item.sku, item, this.items);
        }
    }
    //if Java or Typescript, this would be anything
    //that would be implementing the interface rule
    //which will have an apply method that takes items
    addRule(rule) {
        this.rules.push(rule);
    }
    /* using the old style here, should refactor it to use ES6 reduce */
    getItemScanMap() {
        //map each sku to an item array
        //let itemQtyMap = new Map();
        this.items.forEach(item => {
            //the belo condition isn't good but not sure
            //how to bundle vga and mac together?
            if(item.bundledWith != null) {
                itemQtyMap.set(item.sku, existingItems);
            } else if(itemQtyMap.has(item.sku)) {
                let existingItems = itemQtyMap.get(item.sku);
                existingItems.push(item);
                itemQtyMap.set(item.sku, existingItems);
            } else {
                itemQtyMap.set(item.sku, [item]);
            }
        });
        return itemQtyMap;
    }
    total() {
        //do we log total to console?'
        //first seggregate all the items in the cart using reduce
        //reduce it to an array of objects {sku: qty}
        let itemQtyMap = this.items;
        //now we have a map of items and their quantaties
        //apply the rules
        let total = 0;
        itemQtyMap.forEach((value, key) => {
            let rule = this.rules[key];
            let itemsCost = 0;
            if(rule != undefined && rule != null) {
                itemsCost = rule.apply(value);    
            } else if(value[0] != undefined) {
                //there could be a case where a rule is not defined
                itemsCost = value.length * value[0].price;
            }
            total += itemsCost;
        });
        return total;
    }
}

let ipad = new Item("ipd", "Super iPad", 549.99);
let mbp = new Item("mbp", "MacBook Pro", 1399.99);
let atv = new Item("atv", "Apple TV", 109.50);
let vga = new Item("vga", "VGA Adapter", 30, "mbp");


let checkout = new Checkout(defaultRules());
checkout.scan(mbp);
checkout.scan(mbp);
checkout.scan(mbp);
checkout.scan(atv);
checkout.scan(vga);
checkout.scan(vga);
checkout.scan(vga);
checkout.scan(vga);
//checkout.scan(vga);
//checkout.scan(vga);
//checkout.total();
console.log(`Total is => ${checkout.total()}`);

module.exports = {
    "checkout": Checkout,
    "item": Item,
    "defaultRules": defaultRules
}