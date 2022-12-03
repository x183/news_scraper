import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import Post from "../interfaces/Post";
import fs from "fs";
import allPosts from "../interfaces/AllPosts";

const pageLink = "https://chalmers.it/posts?page=";
const articleLink = "https://chalmers.it";

const fetchPostPages = async () => {
  let foundPage = true;
  let pageI = 0;
  const articlesList = [];
  while (foundPage) {
    pageI++;
    const post = await fetchPage(pageLink + pageI);
    if (!post) {
      break;
    }
    const $ = load(post);
    foundPage = $("article").length > 0 && pageI < 2;
    if (foundPage) {
      const articles = findPosts($);
      if (!articles) break;
      articlesList.push(articles);
      continue;
    }
    foundPage = false;
  }
  return await fetchArticles(articlesList);
};

const fetchPage = async (page: string) => {
  try {
    const response = await axios(page);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const findPosts = ($: CheerioAPI) => {
  let articles: string[] = [];
  $("article").each((parentIndex, parentElement) => {
    if (!parentIndex) return;
    if (!parentElement) return;
    const article = $(parentElement).find("a").first().attr("href");
    if (article) {
      articles.push(article);
    }
  });
  return articles;
};

const extractArticleData = async (article: string) => {
  const newPost = {
    id: 0,
    title: "",
    body: "",
    date: "",
    created_at: "",
  };
  const page = await fetchPage(articleLink + article);
  if (!page) return null;
  const $ = load(page);
  const actualPage = $("article").first();
  const title = actualPage.find("h1").first().find("a").first().text();
  if (title) newPost.title = title;
  const body = actualPage.find(".article-content").first().text();
  if (body) newPost.body = body;
  const date = actualPage.find(".icon-clock").first().text();
  if (date) newPost.date = date;
  const created_at = actualPage
    .find("header")
    .first()
    .find("time")
    .first()
    .attr("datetime");
  if (created_at) newPost.created_at = created_at;
  const id = parseInt(article.split("/")[2].split("-")[0]);
  if (id) newPost.id = id;
  else return null;
  return newPost;
};
const fetchArticles = async (articleList: string[][]) => {
  let postList: Post[] = [];
  for (let i = 0; i < articleList.length; i++) {
    for (let j = 0; j < articleList[i].length; j++) {
      const post = await extractArticleData(articleList[i][j]);
      if (post) postList.push(post);
    }
  }
  //addArticleToCache(postList);
  return postList;
};
const cacheLink = "src/data/cache.json";

const addArticleToCache = async (post: Post[]) => {
  const retData: allPosts = {
    posts: post,
  };
  fs.writeFileSync(cacheLink, JSON.stringify(retData));
};

export const getPosts = async (page: number) => {
  const articleList = await fetchPostPages();
  return articleList;
};
