// export const globalData = [
//     {
//         profile_image: "/src/assets/public/sample_1.jpg",
//         name: "Sample Data 1",
//         generation: "G1",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
//     {
//         profile_image: "/src/assets/public/sample_2.jpg",
//         name: "Sample Data 2",
//         generation: "G2",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
//     {
//         profile_image: "/src/assets/public/sample_3.jpg",
//         name: "Sample Data 3",
//         generation: "G3",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
//     {
//         profile_image: "/src/assets/public/sample_4.jpg",
//         name: "Sample Data 4",
//         generation: "G4",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
//     {
//         profile_image: "/src/assets/public/sample_5.jpg",
//         name: "Sample Data 5",
//         generation: "G5",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
//     {
//         profile_image: "/src/assets/public/sample_6.jpg",
//         name: "Sample Data 6",
//         generation: "G5",
//         mother: "Barbara Gordon",
//         father: "Tony Stark",
//         gender: "M",
//         dob: "5/27/15",
//     },
// ];

// [
//     {
//       "name": "Ram Bahadur Kafle",
//       "name_in_nepali": "राम बहादुर काफ्ले",
//       "pusta_number": "1",
//       "contact_details": {
//         "email": "ram.kafle@example.com",
//         "phone_numbers": ["+977-9812345678", "+977-9801122334"],
//         "social_links": ["https://facebook.com/ram.kafle"],
//         "current_address": {
//           "city": "Kathmandu",
//           "street": "Thamel Marg",
//           "country": "Nepal"
//         }
//       },
//       "family_relations": {
//         "father": "Shyam Bahadur Kafle",
//         "mother": "Gita Devi Kafle"
//       },
//       "date_of_birth": "1980-01-15",
//       "status": "Alive",
//       "date_of_death": null,
//       "photo_url": "https://example.com/photos/ram_kafle.jpg",
//       "profession": "Teacher",
//       "gender": "Male",
//       "same_vamsha_status": true
//     },
//     {
//       "name": "Sita Devi Kafle",
//       "name_in_nepali": "सीता देवी काफ्ले",
//       "pusta_number": "2",
//       "contact_details": {
//         "email": "sita.kafle@example.com",
//         "phone_numbers": ["+977-9823456789"],
//         "social_links": ["https://facebook.com/sita.kafle"],
//         "current_address": {
//           "city": "Pokhara",
//           "street": "Lakeside Road",
//           "country": "Nepal"
//         }
//       },
//       "family_relations": {
//         "father": "Ram Bahadur Kafle",
//         "mother": "Gita Devi Kafle"
//       },
//       "date_of_birth": "2005-08-12",
//       "status": "Alive",
//       "date_of_death": null,
//       "photo_url": "https://example.com/photos/sita_kafle.jpg",
//       "profession": "Student",
//       "gender": "Female",
//       "same_vamsha_status": true
//     }
//   ]


import sample1 from '/src/assets/public/sample_1.jpg';
import sample2 from '/src/assets/public/sample_2.jpg';
import sample3 from '/src/assets/public/sample_3.jpg';
import sample4 from '/src/assets/public/sample_4.jpg';
// import sample5 from '/src/assets/public/sample_5.jpg';
// import sample6 from '/src/assets/public/sample_6.jpg';

export const globalData = [
    {
        "id": 1,
        "name": "Ram Bahadur Kafle",
        "name_in_nepali": "राम बहादुर काफ्ले",
        "pusta_number": "1",
        "contact_details": {
            "email": "ram.kafle@example.com",
            "phone_numbers": ["+977-9812345678", "+977-9801122334"],
            "social_links": ["https://facebook.com/ram.kafle"],
            "current_address": {
                "city": "Kathmandu",
                "street": "Thamel Marg",
                "country": "Nepal"
            }
        },
        "family_relations": {
            "father": "Shyam Bahadur Kafle",
            "mother": "Gita Devi Kafle"
        },
        "date_of_birth": "1980-01-15",
        "status": "Dead",
        "date_of_death": null,
        "photo_url": sample1,
        "profession": "Teacher",
        "gender": "Female",
        "same_vamsha_status": true
    },
    {
        "id": 2,
        "name": "Sita Devi Kafle",
        "name_in_nepali": "सीता देवी काफ्ले",
        "pusta_number": "2",
        "contact_details": {
            "email": "sita.kafle@example.com",
            "phone_numbers": ["+977-9823456789"],
            "social_links": ["https://facebook.com/sita.kafle"],
            "current_address": {
                "city": "Pokhara",
                "street": "Lakeside Road",
                "country": "Nepal"
            }
        },
        "family_relations": {
            "father": "Ram Bahadur Kafle",
            "mother": "Gita Devi Kafle"
        },
        "date_of_birth": "2005-08-12",
        "status": "Alive",
        "date_of_death": null,
        "photo_url": sample2,
        "profession": "Student",
        "gender": "Female",
        "same_vamsha_status": true
    },
    {
        "id": 3,
        "name": "Ram Bahadur Kafle",
        "name_in_nepali": "राम बहादुर काफ्ले",
        "pusta_number": "1",
        "contact_details": {
            "email": "ram.kafle@example.com",
            "phone_numbers": ["+977-9812345678", "+977-9801122334"],
            "social_links": ["https://facebook.com/ram.kafle"],
            "current_address": {
                "city": "Kathmandu",
                "street": "Thamel Marg",
                "country": "Nepal"
            }
        },
        "family_relations": {
            "father": "Shyam Bahadur Kafle",
            "mother": "Gita Devi Kafle"
        },
        "date_of_birth": "1980-01-15",
        "status": "Alive",
        "date_of_death": null,
        "photo_url": sample3,
        "profession": "Teacher",
        "gender": "Male",
        "same_vamsha_status": true
    },
    {
        "id": 4,
        "name": "Sita Devi Kafle",
        "name_in_nepali": "सीता देवी काफ्ले",
        "pusta_number": "2",
        "contact_details": {
            "email": "sita.kafle@example.com",
            "phone_numbers": ["+977-9823456789"],
            "social_links": ["https://facebook.com/sita.kafle"],
            "current_address": {
                "city": "Pokhara",
                "street": "Lakeside Road",
                "country": "Nepal"
            }
        },
        "family_relations": {
            "father": "Ram Bahadur Kafle",
            "mother": "Gita Devi Kafle"
        },
        "date_of_birth": "2005-08-12",
        "status": "Alive",
        "date_of_death": null,
        "photo_url": sample4,
        "profession": "Student",
        "gender": "Female",
        "same_vamsha_status": true
    }

];
