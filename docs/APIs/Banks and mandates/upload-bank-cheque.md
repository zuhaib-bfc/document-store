## Upload Bank Cheque 

The purpose of this API is to upload bank related document to improve the accuracy of bank verification at NSE.

#### Authorization
```
Bearer - Auth Token
```

#### Sample Request body:
```
{
  "ucc" : "50002933221"
  "fileName": "2183189023.jpg", // account-number
  "fileType": "image/jpeg",
  "data": "/9j/4AAQSkZJRgABAQEASABIAAD..."   // base64 encoded image data
}
```

#### Sample Response:
**Status Code:** `200`
```
{
    "success": true,
    "url": "https://aws.south-east------dnpwew8nxe2.jpg"
}
```

#### Sample Response:
**Status Code:** `400`
```
{
    "success": false,
    "msg": "Image too large to process"
}
```

---