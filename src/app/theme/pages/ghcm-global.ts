export const GlobalVariable = Object.freeze({
    BASE_API_URL: 'https://g1.iot.tmrnd.com.my/api',
    API_KEY: 'tz3qDkZA9ovNSmChTuGF6eKYoyi1ihmSLT57WGhv', // previously known ad API_KEY
    //USER_LEVEL: getUserInfo('level'),
    //USER_ROLE: getUserInfo('role'),
    //USER_TOKEN: getUserInfo('token'),
});

/*
function getUserInfo(type){
    let ret='';
    console.log(">>1 ");
    let currentUser:any;
    if (JSON.parse(localStorage.getItem('currentUser')) !== null){
        console.log(">> 2");
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        switch (type){
            case 'level': ret=currentUser.userlevel; break;
            case 'role': ret=currentUser.job_role; break;
            case 'token': ret=currentUser.token; break;
        } 
    } else {  ret=null; }
    console.log(">> "+ret);
    return ret;
}*/