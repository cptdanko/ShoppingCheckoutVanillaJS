const sModule = require("./shopping");

function mockItems() {
    let ipad = new sModule.item("ipd", "Super iPad", 549.99);
    let mbp = new sModule.item("mbp", "MacBook Pro", 1399.99);
    let atv = new sModule.item("atv", "Apple TV", 109.50);
    let vga = new sModule.item("vga", "VGA Adapter", 30);
    return {
        "ipad": ipad,
        "mbp": mbp,
        "atv": atv,
        "vga": vga
    };
}

describe("Test whether the classes work as expected", () => {
    it("should verify the rules", () => {
        expect(sModule.defaultRules["random"]).toBeUndefined();
        expect(sModule.defaultRules()["atv"]).toBeTruthy();
        //expect(sModule.defaultRules()["mbp"]).toBeTruthy();
    });

    it("should create item class", () => {
        let checkout = new sModule.item();
        expect(checkout).toBeTruthy();
    });
    it("should create checkout class", () => {
        let checkout = new sModule.checkout();
        expect(checkout).toBeTruthy();
    });

    it("should have empty items in checkout", () => {
        let checkout = new sModule.checkout();
        expect(checkout.items.size).toBe(0);
    });
    it("checkout to update cart on item scan", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        expect(checkout.items.get(mock.atv.sku).length).toBe(2);
    })
});

describe("calculations for single item purcahse in varying quantities ", () => {

    it("should only charge for 2/3 apple tvs", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        expect(checkout.total()).toBe(219);
    });

    it("should only charge for 4/5 apple tvs", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        expect(checkout.total()).toBe(438);
    });

    it("should only charge for 4/6 apple tvs", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        expect(checkout.total()).toBe(438);
    });
    
    it("1 iPad should have no discount", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.ipad);
        expect(checkout.total()).toBe(549.99);
    });

    it("3 iPads should have no discount", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        expect(checkout.total()).toBe(1649.97);
    });
    it("4 iPads should have no discount", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        expect(checkout.total()).toBe(2199.96);
    });
    it("More than 4 iPads should have a discount", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        checkout.scan(mock.ipad);
        expect(checkout.total()).toBe(2499.95);
    });
});
describe("calculations for purchasing different items", () => {

    it("Should get the right total for 3 Apple TVs and 1 adapter", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.vga);
        expect(checkout.total()).toBe(249);
    });
});