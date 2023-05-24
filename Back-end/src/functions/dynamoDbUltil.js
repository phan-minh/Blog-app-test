const DYNAMO_OPS = [
  "get",
  "query",
  "delete",
  "update",
  "put",
  "scan",
  "batchWrite",
  "transactWrite",
];
export const operate = (op, query) => {
  const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || "eu-west-1",
  });
  return new Promise((resolve, reject) => {
    if (DYNAMO_OPS.indexOf(op) === -1) {
      reject("Operation not supported");
    }
    if (!query.ReturnValues) query.ReturnValues = "ALL_OLD";
    if (query.ReturnValues === "NONE") query.ReturnValues = "ALL_OLD";

    docClient[op](query, (err, data) => {
      if (err) {
        reject(new Error(`Unable to ${op} item. Error JSON: ${err}`));
      } else {
        resolve(data);
      }
    });
  });
};
export const scanFullResults = async (params) => {
  try {
    const { Items = [], LastEvaluatedKey } = await operate("scan", params);
    const data = Items;

    if (LastEvaluatedKey) {
      params.ExclusiveStartKey = LastEvaluatedKey;
      const _data = await scanFullResults(params);
      data.push(..._data);
    }

    return data;
  } catch (error) {
    catchError({
      message: "Some thing went wrong went scan data",
      file: "src/functions/dynamoDBUltil",
      throwError: false,
      error,
    });
    return [];
  }
};

export const queryFullResults = async (params) => {
  try {
    const { Limit = 0 } = params;
    const {
      Items = [],
      LastEvaluatedKey,
      Count = 0,
    } = await operate("query", params);
    if (Limit && Count <= Limit) {
      params.Limit = Limit - Count;
    }

    const data = Items;

    if (LastEvaluatedKey && params.Limit !== 0) {
      params.ExclusiveStartKey = LastEvaluatedKey;
      const _data = await queryFullResults(params);
      data.push(..._data);
    }

    return data;
  } catch (error) {
    catchError({
      message: "Some thing went wrong went query data",
      file: "src/functions/dynamoDBUltil",
      throwError: false,
      error,
    });

    return [];
  }
};

export const chunkArray = (array, size = 25) => {
    if (!Array.isArray(array)) return [];
  
    return array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);
};

export const combineChunksArray = (array) => {
    if (!Array.isArray(array)) return [];
  
    return array.reduce(
      (combined, chunk) => combined.concat(Array.isArray(chunk) ? chunk : [chunk]),
      [],
    );
  };

export const batchWriteItems = async (data = [], TableName , throwError = false) => {
    try {
      const batchItems = chunkArray(
        data.filter((item) => item),
        25,
      );

      const result = batchItems.map((items) => {
        const writeItems = items.map((item) => {
          return {
            PutRequest: {
              Item: item,
            },
          };
        });
        const batchRequestParams = {
          RequestItems: {
            [TableName] : writeItems,
          },
        };
        return operate('batchWrite', batchRequestParams)
          .then((batchResult) => {
            const {
              UnprocessedItems: { PutRequest: UnprocessedItems = [] } = {},
            } = batchResult;

            return UnprocessedItems;
          })
          .catch((error) => {
            catchError({
              message: 'Some thing went wrong went batchWrite data',
              file: "src/functions/dynamoDBUltil",
              throwError,
              error,
            });

            return writeItems;
          });
      });

      return Promise.all(result).then(combineChunksArray);
    } catch (error) {
      catchError({
        message: "Some thing went wrong went batchWrite data",
        file: "src/functions/dynamoDBUltil",
        throwError,
        error,
      });

      return data;
    }
  }
