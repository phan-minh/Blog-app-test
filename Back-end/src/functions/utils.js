import { v4 as uuidv4 } from 'uuid';
export const catchError = ({
  message,
  error = null,
  file = "",
  throwError = true,
  event = {},
  errorCode = null,
}) => {
  if (typeof error !== "object" || error === null) {
    error = {
      message: error,
    };
  }

  const referenceCode = uuidv4();
  const requestId = getNestedValue(event, "requestContext.requestId");
  const { statusCode } = error;

  if (throwError) {
    throw new Error("Something went wrong", {
      referenceCode,
      requestId,
      code,
      statusCode,
    });
  }
  return {
    requestId,
    referenceCode,
    message,
    code: errorCode,
    statusCode,
  };
};
const _createJsonMessage = (
  data,
  { statusCode, code, headers, message, success, metadata, requestId, event }
) => {
  headers = headers || {};
  defaultHeaders["Access-Control-Allow-Origin"] = "*";
  Object.assign(headers, defaultHeaders);
  const response = {
    statusCode,
    headers,
  };
  requestId =
    requestId || getNestedValue(event, "requestContext.requestId", "");
  const responseBody = {
    success,
    code,
    status: statusCode,
    message,
    requestId,
    data,
    metadata,
  };

  response.body = JSON.stringify(responseBody);

  return response;
};

export const createJsonErrorMessage = (
  data,
  {
    statusCode = 400,
    code = null,
    headers = null,
    message = null,
    requestId = "",
    metadata = {},
    event = {},
  } = {}
) => {
  if (data instanceof Error) {
    message = message === null ? data.message : message;
    data = data.data ? data.data : {};
  }

  return _createJsonMessage(data, {
    success: false,
    statusCode,
    code,
    headers,
    message: message === null && typeof data === "string" ? data : message,
    requestId,
    metadata,
    event,
  });
};

export const getNestedValue = (object, propertyPath, defaultValue) => {
  if (typeof propertyPath !== "string" && typeof propertyPath !== "number") {
    return defaultValue;
  }

  const pathArray = propertyPath
    .toString()
    .split(".")
    .filter((key) => key);
  const pathArrayFlat = pathArray.flatMap((_part) =>
    typeof _part === "string" && Number.isNaN(_part) ? _part.split(".") : _part
  );
  const value = pathArrayFlat.reduce(
    (obj, key) => (obj === null ? undefined : obj && obj[key]),
    object
  );
  return value === undefined ? defaultValue : value;
};

export const createJsonSuccessMessage = (
  data,
  {
    statusCode = 200,
    code = null,
    headers = null,
    message = "OK",
    metadata = {},
    requestId = "",
    event = {},
  } = {}
) =>
  _createJsonMessage(data, {
    success: true,
    statusCode,
    code,
    headers,
    message,
    metadata,
    requestId,
    event,
});
