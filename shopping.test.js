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
        expect(sModule.rules["random"]).toBeUndefined();
        expect(sModule.rules["atv"]).toBeTruthy();
        expect(sModule.rules["mbp"]).toBeTruthy();
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
        expect(checkout.items.length).toBe(0);
    });
    it("checkout to update cart on item scan", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        expect(checkout.items.length).toBe(2);
    })
});

describe("Calcualte shopping total", () => {
    it("Should get the right total for 3 Apple TVs and 1 adapter", () => {
        let checkout = new sModule.checkout();
        let mock = mockItems();
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.atv);
        checkout.scan(mock.vga);
        expect(checkout.total()).toBe(249);
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