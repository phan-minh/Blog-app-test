import { batchWriteItems, queryFullResults, scanFullResults } from "./dynamoDbUltil";
import { catchError } from "./utils";
import crypto from "crypto";
const TableName = "dev-test-blog";
export const getAllBlog = async({ lastEvaluatedKey = null, limit = 1000 }) => {
  try {
    const params = {
      TableName,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    };
    const data = await scanFullResults("scan", params);
    return data;
  } catch (error) {
    catchError({
      message: "An unexpected error occurred while handling get All Blog",
      file: "src/functions/blogFunction",
      error,
    });
  }
  return [];
};

export const searchBlogByTitle = async ({ title = "" }) => {
  try {
    const query = {
      TableName,
      KeyConditionExpression: "#title = :title",
      ExpressionAttributeNames: {
        "#title": "title",
      },
      IndexName: "titleIndex",
      ExpressionAttributeValues: {
        ":title": title,
      },
    };
    const result = await queryFullResults(query);
    return result;
  } catch (error) {
    catchError({
      message: "An unexpected error occurred while handling search Blog",
      file: "src/functions/blogFunction",
      error,
    });
  }
};

export const insertBlog = async (blogs = []) => {
  try {
    const dataMapping = blogs.map((item) => ({
      ...item,
      id: crypto.createHash("md5").update(item.title).digest("hex"),
      createdDate: new Date().toJSON(),
    }));
    const data = await batchWriteItems(dataMapping, TableName);
    return data;
  } catch (error) {
    catchError({
      message: "An unexpected error occurred while handling update Blog",
      file: "src/functions/blogFunction",
      error,
    });
  }
};
