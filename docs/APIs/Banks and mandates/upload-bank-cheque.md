## Upload Bank Cheque 

The purpose of this API is to upload bank related document to improve the accuracy of bank verification at NSE.

#### Authorization
```
Bearer - Auth Token
```

#### Sample Request body:
```json
{
  "ucc" : "50002933221",
  "account_type":"SB",
  "account_number":"38743151942",
  "ifsc_code":"SBIN0007275",
  "fileName": "2183189023.jpg", // account-number
  "fileType": "image/jpeg",
  "data": "/9j/4AAQSkZJRgABAQEASABIAAD..."   // base64 encoded image data
}
```

#### Sample Response:
**Status Code:** `200`
```json
{
    "success": true,
    "url": "https://aws.south-east------dnpwew8nxe2.jpg"
}
```

#### Sample Response:
**Status Code:** `400`
```json
{
    "success": false,
    "msg": "Image too large to process"
}
```

---