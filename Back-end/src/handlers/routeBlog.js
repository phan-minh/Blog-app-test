import Routes from './baseRoute';
import { getBlogInformation, searchBlogInformation, updateInformation } from './blogHandler';
const routes = new Routes();

const ROUTE_MAPPING = {
  'getAllBlog': {
    handleFunction: getBlogInformation,
    validate:false,
    middlewares:[]
  },
  'insertBlog': {
    handleFunction: updateInformation,
    validate:false,
    middlewares:[]
  },
  'searchBlog': {
    handleFunction: searchBlogInformation,
    validate:false,
    middlewares:[]
  },
};

routes.post(ROUTE_MAPPING);

export const handler = routes.handler.bind(routes);
