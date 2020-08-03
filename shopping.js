//should this be const?
let iPad_DISCOUNT_PRICE = 499.99;

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
        this.sku = sku;
        //apply function would perform discount
        //operation on the items and return result
        this.apply = apply;
    }
}
/* For every 2 tvs bought give 1 free 
not entirely sure how but this function 
can be simplified */
let tvRule = new Discount("atv", (items) => {
    let actualQty = items.length - Math.floor(items.length / 3);
    return actualQty * items[0].price;
});

/* If more than 4 iPads are purchased, then charge 499.99 each */
let ipadRule = new Discount("ipd", (items) => {
    let totalPrice;
    if(items.length > 4) {
        totalPrice = items.length * iPad_DISCOUNT_PRICE;
    } else {
        totalPrice = items.length * items[0].price;
    }
    return totalPrice;
});

/* Macbook Pro(MBP) bundle rule: for every MBP bought give 1 vga adapter free  */
let bundleRule = new Discount("mbp", (items) => {
    //find all the elements without a bundleWith sku
    //they will be primary items, so charge full price for them
    //the rest will be given free
    let total = 0;
    let primaryItems = items.filter(item => item.bundledWith == null);
    
    if(primaryItems.length > 0) {
        total = (primaryItems.length * primaryItems[0].price);
    }
    //create a map of bundled items
    let bundleMap = new Map();
    items.forEach(it => {
        if(it.bundledWith !== null) {
            let existingArray = bundleMap.get(it.sku);
            if(existingArray) {
                existingArray.push(it);
            } else {
                existingArray = [it];
            }
            bundleMap.set(it.sku, existingArray);
        }
    });
    //items = bundledItems, only charge 
    //BUG: what if we bundle more than 1 item 
    //and items have different price?
    bundleMap.forEach(function(items, key) {
        if(primaryItems.length > 0) {
            let toCount = items.length - primaryItems.length;
            if(toCount > 0) {
                total  += toCount * items[0].price;
            }
        } else {
            total  += items.length * items[0].price;
        }
    });
    return total;
});
/* the ids are hard coded? */
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
    /* maintain a map of items in the cart 
    where items are saved by main SKU, unless 
    they have a bundleWith sku set to not null
    in which case, they will be store under main item SKU
    */
    scan(item) {
        if(item.bundledWith != null) {
            this.appendItem(item.bundledWith, item, this.items);
        } else {
            this.appendItem(item.sku, item, this.items);
        }
    }
    /* at present, the test coverage doesn't include this */
    addRule(rule) {
        this.rules.push(rule);
    }
    //new rules to be added to a the shop
    //number of times in the year, Xmas, Easter
    //so remove the old rules
    removeRule(sku) { 
        delete this.rules[sku];
    }
    total() {
        //do we log total to console?'
        //first seggregate all the items in the cart using reduce
        //reduce it to an array of objects {sku: qty}
        let itemQtyMap = this.items;
        //now we have a map of items and their quantaties
        //apply the rules
        let total = 0;
        itemQtyMap.forEach((items, sku) => {
            let rule = this.rules[sku];
            let itemsCost = 0;
            if(rule != undefined && rule != null) {
                itemsCost = rule.apply(items);    
            } else if(items[0] != undefined) {
                //there could be a case where a rule is not defined
                //itemsCost = value.length * value[0].price;
                //looping through each item in the list and adding the price
                //so in case we have a bundled item, it's correct price is
                //added to the total instead of the item it was bundled with
                items.forEach(i => {    
                    total += i.price;
                })
            }
            total += itemsCost;
        });
        return total;
    }
}
module.exports = {
    "checkout": Checkout,
    "item": Item,
    "defaultRules": defaultRules,
}