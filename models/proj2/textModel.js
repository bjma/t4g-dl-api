/**
 * fileName: textModel.js
 * 
 * Model for text data to be used in Project 2,
 * which deals with sentiment analysis in text queries from StackOverflow.
 * 
 * We have 3 main fields: 
 * 1. Question - This is the query that was asked. Our goal is to match queries with 
 *    an answer in a specific category, expanded in "Feautres".
 * 2. Answer - StackOverflow answer to original query; we specifically chose the 
 *             "Accepted Answers", rather than the highest voted.
 * 3. Features - The model will most likely be using ML algorithms like sigmoid activation, 
 *               so we need to specify a couple of fields that a query might be classified as.
 * 
 */

 const mongoose = require("mongoose");

 const textSchema = mongoose.Schema({
     query: {
         type: String,
         required: true,
     },
     answer: {
        type: String,
        required: true,
     },
     features: {
        type: Object,
        required: true,
     }
 });

 // Export Text model
 module.exports = mongoose.model("Text", textSchema, "text-query-data");