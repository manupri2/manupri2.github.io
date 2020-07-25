function showMap() {
        document.getElementById("my_dataviz").innerHTML = "";
        var maptab = document.getElementById('maptab');
        maptab.className = 'active';
        var scatterplottab = document.getElementById('scatterplot');
        scatterplottab.className = 'inactive';
        var bartab = document.getElementById('bar');
        bartab.className = 'inactive';
    }
