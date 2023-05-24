import { getAllBlog, insertBlog, searchBlogByTitle } from "../functions/blogFunction";
import * as Utils from "../functions/utils";
export const getBlogInformation = async (event, context, callback) => {
  try {
    const requestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const data = await getAllBlog(requestBody);
    callback(null, Utils.createJsonSuccessMessage(data, { event }));
  } catch (error) {
    const responseError = catchError({
      message: "Something went wrong when get data",
      file: "src/handlers/blogHandler",
      throwError: false,
      event,
      error,
    });
    callback(
      null,
      Utils.createJsonErrorMessage(responseError.message, responseError)
    );
  }
};

export const updateInformation = async (event, context, callback) => {
  try {
    const requestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const data = await insertBlog(requestBody);
    callback(null, Utils.createJsonSuccessMessage(data, { event }));
  } catch (error) {
    const responseError = catchError({
      message: "Something went wrong when Search data",
      file: "src/handlers/blogHandler",
      throwError: false,
      event,
      error,
    });
    callback(
      null,
      Utils.createJsonErrorMessage(responseError.message, responseError)
    );
  }
};

export const searchBlogInformation = async (event, context, callback) => {
  try {
    const requestBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const data = await searchBlogByTitle(requestBody);
    callback(null, Utils.createJsonSuccessMessage(data, { event }));
  } catch (error) {
    const responseError = catchError({
      message: "Something went wrong when search data",
      file: "src/handlers/blogHandler",
      throwError: false,
      event,
      error,
    });
    callback(
      null,
      Utils.createJsonErrorMessage(responseError.message, responseError)
    );
  }
};

