var user_logged_in = false;

const CLIENT_ID = encodeURIComponent('ccd5e2b799eb4d0c9daf57324aa666ba');
const RESPONSE_TYPE = encodeURIComponent('token');
const REDIRECT_URI = encodeURIComponent('https://kadmnknigebjmjggichkgpjlphenacje.chromiumapp.org/');
const SCOPE = encodeURIComponent('user-read-email');
const SHOW_DIALOG = encodeURIComponent('true');
let STATE = '';
let ACCESS_TOKEN = '';

function authorize(){
    STATE = encodeURIComponent('csh' + (Math.random() * (998999999) + 1000000).toString().substring(3,9));
    let ouathurl = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&scope=${SCOPE}
&state=${STATE}
&show_dialog=${SHOW_DIALOG}`;

    console.log(ouathurl);

    return ouathurl;
}


chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
    if (request.message === 'login'){
        if (user_logged_in){
            console.log("user already signed in!");
        }
        else{
            chrome.identity.launchWebAuthFlow({
                url: authorize(),
                interactive: true 
            }, function(redirect_url) {
                    if (chrome.runtime.lastError) {
                        sendResponse({message: 'fail'});
                    } 
                    else {
                       if (redirect_url.includes('callback?error=access_denied')){
                        sendResponse({message: 'fail'});
                       }
                       else{
                        user_logged_in = true;

                        setTimeout(() => {
                            ACCESS_TOKEN = '';
                            user_logged_in = false;
                        }, 3600000);
                        
                        console.log(redirect_url);
                        ACCESS_TOKEN = redirect_url.substring(redirect_url.indexOf('access_token=') + 13);
                        ACCESS_TOKEN = ACCESS_TOKEN.substring(0,access_token.indexOf('&'));
                        let stateToken = redirect_url.substring(redirect_url.indexOf('state') + 6);
                        if (stateToken === STATE){
                            sendResponse({message: 'success'});
                        }
                        else{
                            sendResponse({message: 'fail'}); 
                        }  
                    } 
                    }
                });
            }
        return true;
    }
    else if(request.message === 'logout'){
        user_logged_in = false;
        chrome.action.setPopup({popup:'./popup.html'}, () => {
            sendResponse({message:'success'});
        });
        return true;
    }
});




