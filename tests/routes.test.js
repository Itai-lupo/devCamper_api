const bootcamps = require('../routes/bootcamps');
const courses = require('../routes/coures');


describe("check bootcamp routes", () => {
    test("test that the bootcamp route exist", () =>{
        expect(bootcamps).toBeTruthy();
    })

    test("test that the bootcamp have 4 routes", () =>{
        expect(bootcamps.stack.length).toBe(4); 
    })
 
    test("test that the bootcamp have the right paths", () =>{
        expect(bootcamps.stack[0].route.path).toBe("/");
        expect(bootcamps.stack[1].route.path).toBe("/:id");
        expect(bootcamps.stack[2].route.path).toBe("/radius/:zipcode/:distance");
        expect(bootcamps.stack[3].route.path).toBe("/:bootcampId/courses");
    })

    test("test that the bootcamp have all the requred methods in the right routes", () =>{
        expect(bootcamps.stack[0].route.methods.get).toBeTruthy();
        expect(bootcamps.stack[0].route.methods.post).toBeTruthy();

        expect(bootcamps.stack[1].route.methods.get).toBeTruthy();
        expect(bootcamps.stack[1].route.methods.put).toBeTruthy();
        expect(bootcamps.stack[1].route.methods.delete).toBeTruthy();

        expect(bootcamps.stack[2].route.methods.get).toBeTruthy();

        expect(bootcamps.stack[3].route.methods.get).toBeTruthy();
    })
})

describe("check the courses routes", () => {
    test("test that the courses route exist", () =>{
        expect(courses).toBeTruthy();
    })

    test("test that the bootcamp have 1 routes", () =>{
        expect(courses.stack.length).toBe(1);
    })
 
    test("test that the bootcamp have the right paths", () =>{
        expect(courses.stack[0].route.path).toBe("/");
    })

    test("test that the bootcamp have all the requred methods in the right routes", () =>{
        expect(courses.stack[0].route.methods.get).toBeTruthy();
         
    })
})