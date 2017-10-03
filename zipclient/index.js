
(function(){
    "use strict";
    window.onload = function() {
        document.getElementById("button").onclick = textChange;
        getMemory();
    }
    function textChange() {
        var ajax = new XMLHttpRequest();
        var input = document.getElementById("text").value;
        var list = document.getElementById("list");
        ajax.open("GET", "http://localhost:4000/zips/" + input, true);
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                console.log(obj);
                for (var i in obj) {
                    var para = document.createElement("li");
                    console.log(obj[i]);
                    para.innerHTML = obj[i].Code;
                    console.log(para);
                    list.appendChild(para);
                }
            }
        }
        ajax.send();
    }
    function getMemory() {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                document.getElementById("memory").innerHTML = obj.Alloc;
            }
        };
        ajax.open("GET", "http://localhost:4000/memory", true);
        ajax.send();
        
        setTimeout(function(){
            getMemory();
        }, 1000);
    }
})();