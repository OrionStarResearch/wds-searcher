const WDS_CATALOG = "http://ad.usno.navy.mil/wds/Webtextfiles/wdsnewerweb3.txt";
const PROXY = "https://cors-anywhere.herokuapp.com/";
const WDS_START = 5;

var wdsCatalog;

var stars = [];

function getStarRaw(index)
{
    return wdsCatalog[index + WDS_START];
}

function searchWds(predicate)
{
    let options = [];
    for (let i = 0; i < stars.length; i++)
    {
        if (predicate(stars[i])) options.push(stars[i]);
    }
    return options;
}

function starToString(star)
{
    return star.starId + " Epoch (" + star.epoch.start + "," + star.epoch.end + " out of " + star.epoch.count + ") Theta (" + star.theta.first + "," + star.theta.last + ") Rho (" + star.rho.first + "," + star.rho.last + ") Magnitude (" + star.magnitude.primary + "," + star.magnitude.secondary + ")";
}

function parseWds()
{
    for (let i = 0; i < wdsCatalog.length-WDS_START-1; i++)
    {
        let linedata = getStarRaw(i);
        let data = 
        {
            starId: linedata.substr(0,23).replace(/[ \t]+$/,""),
            epoch: {
                start: parseInt(linedata.substr(23,4)),
                end:   parseInt(linedata.substr(28,4)),
                count: parseInt(linedata.substr(33,4))
            },
            theta:{
                first: parseInt(linedata.substr(37,4)),
                last: parseInt(linedata.substr(41,4)),
            },
            rho:{
                first: parseFloat(linedata.substr(45,6)),
                last: parseFloat(linedata.substr(51,6))
            },
            magnitude:{
                primary: parseFloat(linedata.substr(57,5)),
                secondary: parseFloat(linedata.substr(62,5))
            },
            //value:(parseFloat(linedata.substr(45,6))+parseFloat(linedata.substr(51,6)))/2+Math.abs(parseFloat(linedata.substr(57,5))-parseFloat(linedata.substr(62,5))),
            ID:i
            
        };

        stars.push(data);

    }

}

function sendWdsForm(sortParam, minMag, maxMag, minRho, maxRho, callback) 
{
    stars = [];
    let http = new XMLHttpRequest();


    

    http.open("GET", PROXY + WDS_CATALOG, true);

    http.onreadystatechange = function() 
    {
        if (http.readyState == 4)
        {
            wdsCatalog = http.responseText.split('\n');
            parseWds();
            let st = searchWds((star)=>{ 
                let magDiff = Math.abs(star.magnitude.primary-star.magnitude.secondary);
                let rho = star.rho.last;
                return (magDiff>=minMag&&magDiff <=maxMag) && (rho=>minRho&&rho<=maxRho);
            });
            st.sort(function(a, b) { return (sortParam ? Math.abs(a.magnitude.primary-a.magnitude.secondary) : (a.rho.last)) - (sortParam ? Math.abs(b.magnitude.primary-b.magnitude.secondary) : (b.rho.last)) });
            // for (let i = 0; i < st.length; i++)
            // {
            //     console.log(getStarRaw(st[i].ID));
            // }
            callback(st);
            
        }
    };

    http.send();

}