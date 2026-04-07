const url = 'https://uatamrit.piramalswasthya.org/flw-api/user/getUserDetail?userId=961';
const key = 'bf79b45edd45ae11e761ef1cd84ff438188ec02055d69f7bbe2c01933bf90a20';

fetch(url, {
    method: 'GET',
    headers: {
        'X-API-Key': key,
    },
})
.then(response => response.text())
.then(data => {
    console.log('Response:', data);
})
.catch((error) => {
    console.error('Error:', error);
});