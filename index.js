
window.onload=function(){

    var HttpClient = function() {
        this.get = function(aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
    
            anHttpRequest.open( "GET", aUrl, true );            
            anHttpRequest.send( null );
        }
    }

    function getBranchNames(jsonObj, repoName, repoOwner){
        var arr = JSON.parse(jsonObj)
        var outputStr = ""

        for(var i = 0; i < arr.length; i++){
            //console.log(arr[i].ref)
            // split string
            var str = arr[i].ref
            var splitStrArr = str.split("/")
            console.log(splitStrArr[splitStrArr.length-1])
            var branchName = splitStrArr[splitStrArr.length-1]

            //console.log(arr[i].object.sha)
            //- [Branch 1](https://www.w3schools.com/jsref/prop_textarea_value.asp)
            outputStr += "- [" + branchName + "](https://github.com/" + repoOwner + "/" + repoName + "/tree/" + branchName + ")\n"
            
        }
        console.log(outputStr)
        document.getElementById("markdown").value = outputStr
    }

    function getRefs() {
        var repoOwner = document.getElementById("repoOwner").value;
        var repoName = document.getElementById("repoName").value;
        var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/refs"
        //var url = "https://api.github.com/repos/kodaman2/Data_Preserve/git/refs"
        //alert("I am an alert box!");
        var client = new HttpClient();
        
        client.get(url, function(response) {
        // do something with response
        console.log(response);

        getBranchNames(response, repoName, repoOwner)

         // need to create an object array
         // with branch name, and sha, and date

         //then checks commit date with sha, update dates

         // lastly sort by date
        });
      }

    function main(){
        getRefs()
    }

    var el = document.getElementById("generateIndex");
    if (el.addEventListener)
        el.addEventListener("click", main, false);
    else if (el.attachEvent)
        el.attachEvent('onclick', main);

}