// Enter the API key from the Google Develoepr Console - to handle any unauthenticated
// requests in the code.
// The provided key works for this sample only when run from
// https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
// To use in your own application, replace this API key with your own.
var apiKey = 'AIzaSyApTkClIarnL0YxOWSm3A1vrI6p2tO5YWs';

// To enter one or more authentication scopes, refer to the documentation for the API.
var scopes = 'https://www.googleapis.com/auth/plus.me';

function cambiar_fecha_esp(date){
    var dia = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];            
    var mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    
    return dia[date.getDay()] + "  " + date.getDate() + " de " + mes[date.getMonth()];        
}
       
function fechaHoy(){
    var d = new Date();
    function pad(n){
        return n<10 ? '0'+n : n
    }
    
    return d.getUTCFullYear()+ '-' + pad(d.getUTCMonth()+1)+ '-' + pad(d.getUTCDate()) + 'T00:00:00Z';
}

// Use a button to handle authentication the first time.
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('calendar', 'v3', makeRequest);
}


function appendResults(texto, bold) {
    var results = $('#content');        
    if(bold){
        $('<h1/>').appendTo('#content').append(document.createTextNode(texto)); 
        $('<a data-ajax="false" href="mapa.html" onclick="localStorage.setItem(\'ciudad\',\'' + texto + '\');"/>').appendTo('#content').append('Mapa');
    }
    else{
        $('<p/>').appendTo('#content').append(document.createTextNode(texto));
    }
}

function makeRequest(provincia) {
    
    $('#content').html("");  
          
    if (checkConnection()){
    
        var request = gapi.client.calendar.events.list({
            'calendarId': 'toroonada@gmail.com',
            'timeMin': fechaHoy(),
            'orderBy': 'startTime',
            'singleEvents': 'true',
            'q': decodeURIComponent(provincia)
        });  
                                
        request.execute(function(response) {         
            if (response.items){            
                for(i=0; i<response.items.length; i++){   
                    var date = new Date(response.items[i].start.dateTime);     
                    appendResults(response.items[i].location, true);
                    appendResults(cambiar_fecha_esp(date), false);
                    appendResults(date.toLocaleTimeString() + " " + response.items[i].description, false);
                }
            }
        });
    }
}
  
function changeProvincia(){
    makeRequest($('#provincia').val());
}

function checkConnection() {
    var networkState = navigator.network.connection.type;

    if (networkState == Connection.NONE){
        alert('Esta aplicacion requiere acceso a la red: Active datos moviles o wifi para descargar datos');    
        return false;
    }
    
    return true;
}
