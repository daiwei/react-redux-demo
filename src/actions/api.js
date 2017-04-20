import 'whatwg-fetch'
import data from './fake/data.json';

const URL  = 'url'

const DEBUG         = true

export default {

    fetchURL: (user, callback) => {
        console.log('HTTP request: ' + URL);
        if (DEBUG) {
            setTimeout(() => {
                callback(data)
            }, 100)
            return
        }

        $.ajax({
            url: URL,
            method: "POST",
            data: {user: user}
        }).done(function(resp) {
            console.log(resp);
            if (resp.success)
                callback(resp.data)
            else
                console.log("resp.success is false")
        }).fail(function() {
            console.log( "error" );
        })

        // let data = new FormData()
        // data.append('user', user)

        // fetch(URL, {
        //     method: "POST",
        //     body: data,
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // }).then(function(response) {
        //     console.log(response);
        //     return response.json()
        // }).then((jresp) => {
        //     console.log(response);
        //     callback(jresp)
        // }).catch((error) => {
        //     console.log(error)
        // });
    },

}
