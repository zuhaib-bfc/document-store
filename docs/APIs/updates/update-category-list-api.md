## Update Category List API in Explore Funds Filters

To add a query parameter to get categories based on `asset_code`.

### API Updates

| | **URL**  |**Method**  | **Query Param**  
| ---  |--- | --- | --- |
| **Current API** |product/get-categoryTypes-list | GET | None|
| **Updated API** | product/get-categoryTypes-list?asset_code=1 | GET | asset_code=2 |

### Authorization
```
Bearer - Auth token
```

### Sample Request
`GET:` https://prodigypro-new.bfcsofttech.in/api/v2/product/get-categoryTypes-list?asset_code=2

### Sample Response
``` json
{ 
  "success": true, 
  "msg": "Success...!!!", 
  "length": 76, 
  "data": [ 
    {
      "asset_code": 2, 
      "category": "Aggressive Hybrid Fund", 
      "sub_category": "", 
      "classcode": 12 
    }, 
    {
      "asset_code": 2, 
      "category": "Arbitrage Fund", 
      "sub_category": "", 
      "classcode": 19 
    }, 
    {
      "asset_code": 2, 
      "category": "Balanced Advantage", 
      "sub_category": "", 
      "classcode": 75 
    }, 
    {
      "asset_code": 2, 
      "category": "Balanced Hybrid Fund", 
      "sub_category": "", 
      "classcode": 13 
    }, 
    {
      "asset_code": 2, 
      "category": "Capital Protection Funds", 
      "sub_category": "", 
      "classcode": 15 
    }, 
    {
      "asset_code": 2, 
      "category": "Conservative Hybrid Fund", 
      "sub_category": "", 
      "classcode": 14 
    }, 
    {
      "asset_code": 2, 
      "category": "Dynamic Asset Allocation", 
      "sub_category": "", 
      "classcode": 74 
    }, 
    {
      "asset_code": 2, 
      "category": "Equity Savings", 
      "sub_category": "", 
      "classcode": 57 
    }, 
    {
      "asset_code": 2, 
      "category": "Multi Asset Allocation", 
      "sub_category": "", 
      "classcode": 54 
    }, 
    {
      "asset_code": 2, 
      "category": "Multi Asset Allocation", 
      "sub_category": null, 
      "classcode": 89 
    }, 
    {
      "asset_code": 2, 
      "category": "Multi Asset Allocation", 
      "sub_category": null, 
      "classcode": 90 
    }, 
    {
      "asset_code": 2, 
      "category": "Real Estate", 
      "sub_category": "", 
      "classcode": 11 
    }
  ] 
}
```
--- 
**Please Note**
The API should also work without query parameter and should return all the categories in this case, to maintain compatibility with older versions.

### Old Sample Request (Test Case)

`GET:` https://prodigypro-new.bfcsofttech.in/api/v2/product/get-categoryTypes-list

### Sample Response
```json
{
  "success": true, 
  "msg": "Success...!!!", 
  "length": 76, 
  "data": [
    {
      "asset_code": 2, 
      "category": "Aggressive Hybrid Fund", 
      "sub_category": "", 
      "classcode": 12 
    },
    {
      "asset_code": 2, 
      "category": "Arbitrage Fund", 
      "sub_category": "", 
      "classcode": 19 
    },
    {
      "asset_code": 2, 
      "category": "Balanced Advantage", 
      "sub_category": "", 
      "classcode": 75 
    },
    {
      "asset_code": 2, 
      "category": "Balanced Hybrid Fund", 
      "sub_category": "", 
      "classcode": 13 
    },
    {
      "asset_code": 3, 
      "category": "Banking and PSU Fund", 
      "sub_category": "", 
      "classcode": 72 
    },
    {
      "asset_code": 2, 
      "category": "Capital Protection Funds", 
      "sub_category": "", 
      "classcode": 15 
    },
    {
      "asset_code": 2, 
      "category": "Conservative Hybrid Fund", 
      "sub_category": "", 
      "classcode": 14 
    },
    {
      "asset_code": 1, 
      "category": "Contra", 
      "sub_category": "", 
      "classcode": 36 
    },
    {
      "asset_code": 3, 
      "category": "Corporate Bond", 
      "sub_category": "", 
      "classcode": 70 
    },
    ...
  ]
}
```