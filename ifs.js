//ifs (if = interface, s = source;  interface code)

var sortRadioStatus = 0;

function selectSortRadio(id) {
    sortRadioStatus = id;
    let mag = document.getElementById("Magnitude");
    let sep = document.getElementById("Seperation");
    if (id==0) {
        mag.classList.add("SelectedRadioButton");
        sep.classList.remove("SelectedRadioButton")
    } else {
        sep.classList.add("SelectedRadioButton");
        mag.classList.remove("SelectedRadioButton")
    }
}

function clearStarList() {
    document.getElementById("star-list").innerHTML="";
    document.getElementById("stars").style.opacity = 0;
}

function addStarToList(star) {
    
    document.getElementById("stars").style.opacity = 1;
    let c = document.getElementById("star-list");
    c.innerHTML += "<span class='sa-id'>" + star.starId + "</span> " +
                  "<span class='sa-epoch'> " + star.epoch.start + "-" + star.epoch.end + "</span> " +
                  "<span class='sa-rho'>" + star.rho.last + " </span> "+
                  "<span class='sa-mag'>" + star.magnitude.primary + "</span> " +
                  "<span class='sa-mag'>" + star.magnitude.secondary + "</span> "
                  +"<br>";
}


function sortStars () {
    clearStarList();
    let minMag = parseFloat(document.getElementById("minMag").value);
    let maxMag = parseFloat(document.getElementById("maxMag").value);

    let minRho = parseFloat(document.getElementById("minRho").value);
    let maxRho = parseFloat(document.getElementById("maxRho").value);

    let maxEntries = parseInt(document.getElementById("maxEntries").value);

    sendWdsForm(sortRadioStatus, minMag, maxMag, minRho, maxRho, st=>{

        for (let i = 0; i < Math.min(st.length,maxEntries); i++)
        {
            addStarToList(st[i]);
        }

    });
}