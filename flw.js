const url = 'https://uatamrit.piramalswasthya.org/common-api/user/userAuthenticate';
const data = {
    "userName": "amina",
    "password": "856c253a5be36cb8c2e3de157477916609de5a3bac5bda4ecea45acde2ab3ccda94b45b20d2d560627d815bda3654153Vkn76j4YEwwYNZtYcRrVKg==",
    "doLogout": true,
    "withCredentials": true
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch((error) => {
    console.error('Error:', error);
});