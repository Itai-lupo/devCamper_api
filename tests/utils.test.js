const dotenv = require("../utils/dotenvInit");
const geocoder = require("../utils/Geocoder");


test("check the env vars defined", () => 
{
    expect(process.env.NODE_ENV).toBeTruthy();
    expect(process.env.PORT).toBeTruthy();
    expect(process.env.MONGO_URI).toBeTruthy();
    expect(process.env.GEOCODER_PROVIDER).toBeTruthy();
    expect(process.env.GEOCODER_API_KEY).toBeTruthy();
})

describe("test the geocoder", () =>
{
    test("test that the options ar define and equal the the right options", () => {
        expect(geocoder._geocoder.name).toBe(process.env.GEOCODER_PROVIDER);
        expect(geocoder._geocoder.apiKey).toBe(process.env.GEOCODER_API_KEY);

    }) 

    
    test("test if the geocoder return geo code",  () => {
        return; //dont run evry time becose there is requst limit and I dont want to reach to it becose of this test
        return geocoder.geocode("45 Upper College Rd Kingston RI 02881")
        .then(data =>{ 
            console.log(data);
            expect(data[0].formattedAddress)
                .toBe('45 Upper College Rd, Kingston, RI 02881-2003, US')});
    })
});