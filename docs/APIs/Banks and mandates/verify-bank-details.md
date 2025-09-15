## Verify Bank Details
The purpose of this API is to validate bank account of users using a penny-drop mechanism

#### Authorization:
```
Bearer - Auth Token
```

### Sample Request Body:

```
{
    "account_number": "123456789",
    "account_name": "John Doe",
    "account_type": "Saving",
    "account_ifsc": "SBIN000123",
    "account_branch": "Pune",
    "bank_name": "State Bank of India"
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