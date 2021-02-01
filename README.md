# Shopping problem solving exercise

A simple shopping app with item scanning and discount application. You can checkout other solutions to Javascript problem solving e.g. [RxJS Observables vs Promise here] 
# Problem
Build the checkout system. We will start with the following products in our catalogue


| SKU     | Name        | Price    |
| --------|:-----------:| --------:|
| ipd     | Super iPad  | $549.99  |
| mbp     | MacBook Pro | $1399.99 |
| atv     | Apple TV    | $109.50  |
| vga     | VGA adapter | $30.00   |

As we're launching our new computer store, we would like to have a few opening day specials.

- we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only
- the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4
- we will bundle in a free VGA adapter free of charge with every MacBook Pro sold

As our Sales manager is quite indecisive, we want the pricing rules to be as flexible as possible as they can change in the future with little notice.

Our checkout system can scan items in any order.

The interface to our checkout looks like this (shown in java):

```java
  Checkout co = new Checkout(pricingRules);
  co.scan(item1);
  co.scan(item2);
  co.total();
```

Your task is to implement a checkout system that fulfils the requirements described above.

Example scenarios
-----------------

SKUs Scanned: atv, atv, atv, vga
Total expected: $249.00

SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd
Total expected: $2718.95

SKUs Scanned: mbp, vga, ipd
Total expected: $1949.98"

# Solution
The Solution is built using Javascript using some of the new Ecmascript 6 features.

### Tech Stack
- Vanilla Javascript with ES6 classes
- HTML
- JEST for unit testing
- Node to execute tests

### Installation
git clone 
npm install

## Program Structure
The app contains only 3 classes

#### Item 
Create an item qwith sku, name, price and whether or not it's bundled with anything.
```
class Item {
    constructor(sku, name, price, bundledWith) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.bundledWith = (bundledWith === undefined) ? null: bundledWith;
    }
}
```
#### Discount
The discount object/rule to apply to each item SKU. To use it,
```
let ipadRule = new Discount("ipd", (items) => {
    let totalPrice;
    if(items.length > 4) {
        totalPrice = items.length * 499.99;
    } else {
        totalPrice = items.length * items[0].price;
    }
    return totalPrice;
});
```

#### Checkout
A checkout class that maintains a list of rules, provides an interface to scan items, add or remove discount rule.

```
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
    scan(item){ ... }
    addRule(rule) { ... }
    removeRule(sku) { ... }
    total() { ... }
```

### Test Coverage
"npm run test" would run the following test cases
```
describe("Test whether the classes work as expected", () => {
    it("should verify the rules", () => { ... });
    it("should create item class", () => { ... });
    it("should create checkout class", () => { ...});
    it("should have empty items in checkout", () => { ... });
    it("checkout to update cart on item scan", () => { ...})
});
describe("calculations for single item purcahse in varying quantities ", () => {
    it("should only charge for 2/3 apple tvs", () => { ... });
    it("should only charge for 4/5 apple tvs", () => { ... });
    it("should only charge for 4/6 apple tvs", () => { ... });
    it("1 iPad should have no discount", () => { ... });
    it("3 iPads should have no discount", () => { ... });
    it("4 iPads should have no discount", () => { ... });
    it("More than 4 iPads should have a discount", () => { ... });
    it("Should charge full price for Macbook pros" , () => { ... });
    it("Should charge full price for vga adapters" , () => { ... });

});
describe("calculations for purchasing different items", () => {
    it("Should get the right total for 3 Apple TVs and 1 adapter", () => { ... });
    it("Should only charge for 1/4 vga adapters", () => { ... });
    it("Should give $50 discount on iPads", () => { ...  });
    it("Should give one vga adapter for free with mbp", () => { ... });
    it("Should charget for VGA adapter after removing bundle rule", () => { ... });
    it("Should give adapter for free, if scanned before mbp", () => { ... });
});
```

## TO-DO (future improvements)
- The add rule method in checkout class isn't implemented
- Add a method to modify existing rule e.g. > 4 ipads to be $509.50 instead of $499.99
- Parametrise all the object ids, right now 'mbp', 'atv' hard coded right now
- Overall, parts of the code look unecessarily convoluted, improve it (not sure how?)

# Useful Links
- [Ecmascript 6] -> New features overview and comparison
- [Getting started with JEST]
- [Using Matchers in JEST]

[Using Matchers in JEST]: https://jestjs.io/docs/en/using-matchers
[Getting started with JEST]: https://jestjs.io/docs/en/getting-started
[Ecmascript 6]: http://es6-features.org/#ClassDefinition
[RxJS Observables vs Promise here]: https://mydaytodo.com/rxjs-observables-vs-javascript-promise/
