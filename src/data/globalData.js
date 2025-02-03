import sample1 from '/src/assets/public/sample_1.jpg';
import sample2 from '/src/assets/public/sample_2.jpg';
import sample3 from '/src/assets/public/sample_3.jpg';
import sample4 from '/src/assets/public/sample_4.jpg';

export const globalData = [
    {
        "id": 1,
        "name": "Ram Bahadur Kafle",
        "name_in_nepali": "राम बहादुर काफ्ले",
        "pusta_number": "P001",
        "contact_details": {"phone": "9800000001"},
        "father": null,
        "mother": null,
        "date_of_birth": "1940-01-01",
        "status": "Deceased",
        "date_of_death": "2010-01-01",
        "photo": sample1,
        "profession": "Farmer",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 2,
        "name": "Sita Devi Kafle",
        "name_in_nepali": "सीता देवी काफ्ले",
        "pusta_number": "P002",
        "contact_details": {"phone": "9800000002"},
        "father": null,
        "mother": null,
        "date_of_birth": "1945-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": sample2,
        "profession": "Homemaker",
        "gender": "Female",
        "same_vamsha_status": true
    },
    {
        "id": 3,
        "name": "Father",
        "name_in_nepali": "बाबा",
        "pusta_number": "P003",
        "contact_details": {"phone": "9800000003"},
        "father": {
            "id": 1,
            "name": "Grandfather",
            "profession": "Farmer",
            "gender": "Male",
            "pusta_number": "P001"
        },
        "mother": {
            "id": 2,
            "name": "Grandmother",
            "profession": "Homemaker",
            "gender": "Female",
            "pusta_number": "P002"
        },
        "date_of_birth": "1970-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": sample3,
        "profession": "Teacher",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 4,
        "name": "Mother",
        "name_in_nepali": "आमा",
        "pusta_number": "P004",
        "contact_details": {"phone": "9800000004", "email": "as", "address": "as"},
        "father": null,
        "mother": null,
        "date_of_birth": "1975-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Doctor",
        "gender": "Female",
        "same_vamsha_status": true
    },
    {
        "id": 5,
        "name": "Me",
        "name_in_nepali": "म",
        "pusta_number": "P005",
        "contact_details": {"email": "me@example.com", "phone": "9800000005"},
        "father": {
            "id": 3,
            "name": "Father",
            "profession": "Teacher",
            "gender": "Male",
            "pusta_number": "P003"
        },
        "mother": {
            "id": 4,
            "name": "Mother",
            "profession": "Doctor",
            "gender": "Female",
            "pusta_number": "P004"
        },
        "date_of_birth": "1995-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Software Engineer",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 6,
        "name": "My Brother",
        "name_in_nepali": "भाई",
        "pusta_number": "P006",
        "contact_details": {"phone": "9800000006"},
        "father": {
            "id": 3,
            "name": "Father",
            "profession": "Teacher",
            "gender": "Male",
            "pusta_number": "P003"
        },
        "mother": {
            "id": 4,
            "name": "Mother",
            "profession": "Doctor",
            "gender": "Female",
            "pusta_number": "P004"
        },
        "date_of_birth": "1997-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Engineer",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 7,
        "name": "My Brother's Wife",
        "name_in_nepali": "भाईको श्रीमती",
        "pusta_number": "P007",
        "contact_details": {"phone": "9800000007"},
        "father": null,
        "mother": null,
        "date_of_birth": "1998-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Nurse",
        "gender": "Female",
        "same_vamsha_status": false
    },
    {
        "id": 8,
        "name": "My Uncle",
        "name_in_nepali": "काका",
        "pusta_number": "P008",
        "contact_details": {"phone": "9800000008"},
        "father": {
            "id": 1,
            "name": "Grandfather",
            "profession": "Farmer",
            "gender": "Male",
            "pusta_number": "P001"
        },
        "mother": {
            "id": 2,
            "name": "Grandmother",
            "profession": "Homemaker",
            "gender": "Female",
            "pusta_number": "P002"
        },
        "date_of_birth": "1972-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Businessman",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 9,
        "name": "My Aunt",
        "name_in_nepali": "काकी",
        "pusta_number": "P009",
        "contact_details": {"phone": "9800000009"},
        "father": null,
        "mother": null,
        "date_of_birth": "1973-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Teacher",
        "gender": "Female",
        "same_vamsha_status": false
    },
    {
        "id": 10,
        "name": "My Brother's Child",
        "name_in_nepali": "भाईको बच्चा",
        "pusta_number": "P010",
        "contact_details": {"phone": "9800000010"},
        "father": {
            "id": 6,
            "name": "My Brother",
            "profession": "Engineer",
            "gender": "Male",
            "pusta_number": "P006"
        },
        "mother": {
            "id": 7,
            "name": "My Brother's Wife",
            "profession": "Nurse",
            "gender": "Female",
            "pusta_number": "P007"
        },
        "date_of_birth": "2021-01-01",
        "status": "Alive",
        "date_of_death": null,
        "photo": null,
        "profession": "Child",
        "gender": "Male",
        "same_vamsha_status": true
    }
]
