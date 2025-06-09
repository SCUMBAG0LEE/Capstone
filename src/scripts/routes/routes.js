import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AuthPage from '../pages/auth/auth-page';
import PredictPage from '../pages/predict/predict-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/auth': new AuthPage(),
  '/predict': new PredictPage(),
};

export { routes, NotFoundPage };
export default routes;