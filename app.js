const { get } = require("http");
const https = require("https");

https.get("https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences", resp =>{
    let data = "";
    
    // while receiving the data from the given api
    resp.on("data", chunk =>{
        data += chunk;
    });

    // after receiving the data from the given api 
    resp.on("end", chunk =>{

        // parsing the JSON data
        let jsonData = JSON.parse(data);

        // map to store conference id's inorder to remove and to keep track of exact duplicates
        let arr = {}
        let similarity_arr = {}
        
        // duplicates
        let duplicates = []
        let similar_conf = []

        // function to get details of the conference, respectively paid and free
        const getDetails = (data)=>{
            data.forEach(element => {

                // 1.details in human readable format
                let detail = `${element.confName}, ${element.confStartDate}, ${element.venue}, ${element.entryType}, ${element.confUrl}`;
                
                if(arr[detail]){
                    // 2.These are the duplicates, and is stored in array called 'duplicates'
                    duplicates.push(detail);
                    arr[detail]++;
                }
                else{
                    // will only print the details if its not yet mapped
                    console.log(detail);
                    arr[detail] = 1;
                }
            });
        }

         // 3.function to get similar conference names
         const getSimilar = (data)=>{
            data.forEach(element => {
                let loc_detail = `${element.lat}, ${element.long}, ${element.confStartDate}, ${element.confEndDate}`;
                if(similarity_arr[loc_detail]){
                    // if the latitude, longitude , startDate, endDate are the same conferences are more likely to be similar
                    similar_conf.push(`${element.confName},${loc_detail}`);
                    console.log(`${element.confName},${loc_detail}`);
                    similarity_arr[loc_detail]++;
                }
                else{
                    similarity_arr[loc_detail] = 1;
                }
            });
        }
        
        // getting the details of paid and free conferences
        getDetails(jsonData.paid);
        getDetails(jsonData.free);

        // getting the semantically similar conferences
        console.log("\n \n" + "Similar Ones: " + "\n");
        getSimilar(jsonData.paid);
        getSimilar(jsonData.free);
    
    });
        
}).on("error",err =>{
    console.log("Error: " + err);
});

