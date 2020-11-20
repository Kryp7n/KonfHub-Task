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
        
        // duplicates
        let duplicates = []

        // function to get details of the conference, respectively paid and free
        const getDetails = (data)=>{
            data.forEach(element => {
                let detail = `${element.confName}, ${element.confStartDate}, ${element.venue}, ${element.entryType}, ${element.confUrl}`;
                if(arr[detail]){
                    // these are the duplicates
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
        
        // getting the details of paid and free conferences
        getDetails(jsonData.paid);
        getDetails(jsonData.free);
    
    });
        
}).on("error",err =>{
    console.log("Error: " + err);
});
