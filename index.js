console.log("Running Graph QL")
// var fs = require('fs')
import fs from 'fs'
// var fetch = require('node-fetch')
import fetch from 'node-fetch'
fs.writeFileSync('notes.txt', 'hello')

const query = `
{
    productVariants(first: 250) {
          nodes {
              id
              sku
          }
          pageInfo {
              hasNextPage
              endCursor
      }
      }
  }`

  let skuArray = []

async function getData(query){
    let results = await fetch('https://sg-fashiontofigure-dev.myshopify.com/admin/api/unstable/graphql.json', {
        mode: 'cors',
        method : 'POST',
        headers : {
            "X-Shopify-Access-Token" : "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",
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Methods':'POST',
        },
        body : JSON.stringify({
            query : query
        })
    })
    let data = await results.json()
    return data.data
}


async function fetchData(){
    
    let primaryData = await getData(query)
    primaryData.productVariants.nodes.forEach(element => {
        skuArray.push(element)
    });
    console.log(primaryData)
    async function checkNextPage(){

        if(primaryData.productVariants.pageInfo.hasNextPage){
            let nextQuery = `
            {
                productVariants(first: 250, after : "${primaryData.productVariants.pageInfo.endCursor}") {
                      nodes {
                          id
                          sku
                      }
                      pageInfo {
                          hasNextPage
                          endCursor
                  }
                  }
              }`
            
            primaryData = await getData(nextQuery)
            primaryData.productVariants.nodes.forEach(element => {
                skuArray.push(element)
            });
              console.log(primaryData)
              
                checkNextPage()
        }else{
            console.log("skuArray",skuArray)
            fs.writeFileSync('sku-data.txt', JSON.stringify(skuArray))
            return
        }
    }
    checkNextPage()
}

fetchData()

// const btn = document.querySelector('button')
// btn.addEventListener('click',()=> {
//     window.requestFileSystem()
// })