import express from "express";
import homeController from "../controller/homeController"
import userController from "../controller/userController"
let router = express.Router();

let initWebRoutes = (app) => {
      router.get('/', homeController.getHomepage);
      router.get('/test', homeController.getAboutPage);
      router.get('/vuong', (req, res) => { return res.send('Hello world, toi la vuong dz') });
      router.get('/crud', homeController.getCRUD);
      router.post('/post-crud', homeController.postCRUD);
      router.get('/get-crud', homeController.displayGetCRUD);
      router.get('/edit-crud', homeController.getEditCRUD);
      router.post('/put-crud', homeController.putCRUD);
      router.get('/delete-crud', homeController.deleteCRUD);
      router.post('/api/login', userController.handleLogin);
      return app.use("/", router);
}

module.exports = initWebRoutes;