import IAPIManager from '../IO_Mangers/ApiManger/IAPIManager';
import expressApi from '../IO_Mangers/ApiManger/expressApi';
import request = require('supertest');


const api:IAPIManager = new expressApi(parseInt(process.env.PORT) || 5000);

afterAll(() => {
    api.close()
})

describe("check route funcnalty", () => {
    test("add get request at route /test1", () => {
        const  test = () =>{ return true}
        api.addRoute("get", "/test1", test );

        api.getApp()._router.stack.forEach( r =>{
            if (r.route && r.route.path)
            {
              expect(r.route.path).toBe("/test1");
              expect(r.route.methods.get).toBe(true);        
              expect(r.route.stack[0].name).toBe("test");
              return undefined;
            }
          })
    })

    test("add get request at route /test2 and send to it", () => {
        const  test = (req, res) => {
                res.send(200, { sucssus: true });
            }
        api.addRoute("get", "/test1", test );

        request(api.getApp())
            .get('/users')
            .set('Accept', 'application/json')
            .expect(200)
            .expect(JSON.stringify({ sucssus: true }))
            .end(function(err, res){
                return err;
            });

        api.getApp()._router.stack.forEach( r => {
            if (r.route && r.route.path)
            {
              return undefined;
            }
        })
    })
})




