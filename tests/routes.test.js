const bootcamps = require('../routes/bootcamps');

// bootcamps.stack[1].route

describe("check bootcamp routes", () => {
    test("test that the bootcamp route exist", () =>{
        expect(bootcamps).toBeTruthy();
    })

    test("test that the bootcamp have two routes", () =>{
        expect(bootcamps.stack.length).toBe(3);
    })

    test("test that the bootcamp have a defualt route and a route with parmeter", () =>{
        expect(bootcamps.stack[0].route.path).toBe("/");
        expect(bootcamps.stack[1].route.path).toBe("/:id");
        expect(bootcamps.stack[2].route.path).toBe("/radius/:zipcode/:distance");
    })

    test("test that the bootcamp have all the requred methods in the right routes", () =>{
        expect(bootcamps.stack[0].route.methods.get).toBeTruthy();
        expect(bootcamps.stack[0].route.methods.post).toBeTruthy();

        expect(bootcamps.stack[1].route.methods.get).toBeTruthy();
        expect(bootcamps.stack[1].route.methods.put).toBeTruthy();
        expect(bootcamps.stack[1].route.methods.delete).toBeTruthy();

        expect(bootcamps.stack[2].route.methods.get).toBeTruthy();
    })
})
