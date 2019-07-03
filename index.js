var branchesArr = []

class BranchModel {
    constructor(branchName, sha, date) {
        this._branchName = branchName
        this._sha = sha
        //this._date = date
    }

    set updateDate(date) {
        this._date = date
    }
}

window.onload = function () {

    var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }

            anHttpRequest.open("GET", aUrl, true);
            anHttpRequest.send(null);
        }
    }

    function getCommitDate(repoOwner, repoName, sha, index) {

        // https://api.github.com/repos/:owner/:repo/git/commits/:commit_sha
        var commitUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/commits/" + sha
        var client = new HttpClient()

        client.get(commitUrl, function (response) {
            // do something with response
            //console.log(response);
            var arr = JSON.parse(response)
            console.log(arr.author.date)

            branchesArr[index].updateDate = new Date(arr.author.date)

        });

    }

    function branchSort(a, b) {
        return a._date - b._date;
    }

    function getBranchNames(jsonObj, repoOwner, repoName) {
        var arr = JSON.parse(jsonObj)
        var outputStr = ""

        for (var i = 0; i < arr.length; i++) {
            //console.log(arr[i].ref)
            // split string
            var str = arr[i].ref
            var splitStrArr = str.split("/")
            console.log(splitStrArr[splitStrArr.length - 1])
            var branchName = splitStrArr[splitStrArr.length - 1]
            var sha = arr[i].object.sha
            //date = getCommitDate(jsonObj, repoOwner, repoName, sha)

            // testing BranchModel object
            branchesArr.push(new BranchModel(branchName, sha))
            //branchesArr.push(new BranchModel(branchName, sha, date))
            getCommitDate(repoOwner, repoName, sha, i)

            //- [Branch 1](url to branch)
            outputStr += "- [" + branchName + "](https://github.com/" + repoOwner + "/" + repoName + "/tree/" + branchName + ")\n"

        }
        console.log(outputStr)
        document.getElementById("markdown").value = outputStr

        for (var k = 0; k < branchesArr.length; k++) {
            console.log(branchesArr[k])
        }

        console.log("---------------------------------\n")

        // testing sorting
        branchesArr.sort(branchSort)

        for (var k = 0; k < branchesArr.length; k++) {
            console.log(branchesArr[k])
        }
    }

    function getRefs() {
        var repoOwner = document.getElementById("repoOwner").value;
        var repoName = document.getElementById("repoName").value;

        // testing values
        //repoOwner = "kodaman2"
        //repoName = "TTT-Book"

        var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/refs"
        //var url = "https://api.github.com/repos/kodaman2/Data_Preserve/git/refs"
        //alert("I am an alert box!");
        var client = new HttpClient();

        client.get(url, function (response) {
            // do something with response
            console.log(response);

            getBranchNames(response, repoOwner, repoName)

            // need to create an object array
            // with branch name, and sha, and date

            //then checks commit date with sha, update dates

            // lastly sort by date
        });
    }

    function main() {
        getRefs()
    }

    var el = document.getElementById("generateIndex");
    if (el.addEventListener)
        el.addEventListener("click", main, false);
    else if (el.attachEvent)
        el.attachEvent('onclick', main);

}