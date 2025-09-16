## Verify Bank Details
The purpose of this API is to validate bank account of users using a penny-drop mechanism

#### Authorization:
```
Bearer - Auth Token
```

### Sample Request Body:

```
{
    "beneficiaryAccount": "123456789",
    "beneficiaryName": "John Doe",
    "beneficiaryIFSC": "SBIN000123",
}
```

### Sample Response Body:
**Status Code:** `200`
```
{
   "success": true,
}
```

### Sample Response Body:
in case of name mismatch

**Status Code:** `400`
```
{
   "success": false,
}
```