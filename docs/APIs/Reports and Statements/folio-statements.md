## Folio Statement Reports
This document describes the APIs needed for fetching the folio and folio-wise investments

### 1. Get All Folios

#### Method
```
GET
```

#### Query Parameter
```
ucc = BFC00002
```

#### Authorization
```
Bearer - Auth Token
```

#### Route
```
/statements/get-all-folios
```

#### Sample Request
```
https://prodigypro-new.bfcsofttech.in/api/v2/statements/get-all-folios?ucc=BFC00002
```

#### Sample Response
```
{
    "success":true,
    "data": [
        {
            "primary_user": "Chitranshu Srivastava",
            "second_holder": "Pallavi Singh",
            "third_holder": "Rajkumar Gupta",
            "folio_number": "400012012",
            "total_invested": 200000,
            "current_value": 300000,
            "bank_name": "HDFC Bank",
            "bank_account_number": "38743151942",
            "bank_ifsc" : "HDFC000123",
            "nominee_1": "ABCD",
            "nominee_2": "XYZ",
            "nominee_3": "PQRST",
            "schemes_invested": [
                {
                    "accord_scheme_code": 2301,
                    "accord_amc_code": 400023,
                    "scheme_name": "Canara Recobo Multi Cap Fund",
                    "invested_value": 100000,
                    "current_value": 150000,
                    "gain_loss": 50000
                },
                {
                    "accord_scheme_code": 2301,
                    "accord_amc_code": 400023,
                    "scheme_name": "Canara Recobo Multi Cap Fund",
                    "invested_value": 100000,
                    "current_value": 150000,
                    "gain_loss": 50000
                }
            ]
        },
        {
            "primary_user": "Chitranshu Srivastava",
            "second_holder": "Pallavi Singh",
            "third_holder": "Rajkumar Gupta",
            "folio_number": "400012012",
            "total_invested": 200000,
            "current_value": 300000,
            "bank_name": "HDFC Bank",
            "bank_account_number": "38743151942",
            "bank_ifsc" : "HDFC000123",
            "nominee_1": "ABCD",
            "nominee_2": "XYZ",
            "nominee_3": "PQRST",
            "schemes_invested": [
                {
                    "accord_scheme_code": 2301,
                    "accord_amc_code": 400023,
                    "scheme_name": "Canara Recobo Multi Cap Fund",
                    "invested_value": 100000,
                    "current_value": 150000,
                    "gain_loss": 50000
                },
                {
                    "accord_scheme_code": 2301,
                    "accord_amc_code": 400023,
                    "scheme_name": "Canara Recobo Multi Cap Fund",
                    "invested_value": 100000,
                    "current_value": 150000,
                    "gain_loss": 50000
                }
                ...
            ]
        }
        ...
    ]
}
```