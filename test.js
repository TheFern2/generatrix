var branchesArr = []

class BranchModel {
    constructor(branchName, sha) {
        this._branchName = branchName
        this._sha = sha
        //this._date = date
    }

    set updateDate(date) {
        this._date = date
    }
}

function getBranch(url){
    return new Promise((resolve, reject) =>{
        fetch(url)
        .then((resp) => {
            return resp.json()
        })

        .then((data) => {
            getCommitDates(data, '', '')
        })
    })
}

function getCommitDate(repoOwner, repoName, sha, index){

    repoOwner = 'kodaman2'
    repoName = 'gtrix_test'

     // https://api.github.com/repos/:owner/:repo/git/commits/:commit_sha
     var commitUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/commits/" + sha

    return new Promise((resolve, reject) =>{
        fetch(commitUrl)
        .then((resp) => {
            // console.log(resp.json())
            //resp.json()

            branchesArr[index].updateDate = new Date(resp.author.date)
            //return arr.author.date
                    
        })

        .then((data) => {
            //var arr = JSON.parse(data)
            resolve(data)
            console.log(data.author.date)
        })
    })
}

function branchSort(a, b) {
    console.log("Attempting sort")
    return a._date - b._date;
}

function getCommitDates(json, repoOwner, repoName){

    repoOwner = 'kodaman2'
    repoName = 'gtrix_test'
    
    var jsonArr = json
    var outputStr = ""

        for (var i = 0; i < jsonArr.length; i++) {
            var str = jsonArr[i].ref
            var splitStrArr = str.split("/")
            console.log(splitStrArr[splitStrArr.length - 1])
            var branchName = splitStrArr[splitStrArr.length - 1]
            var sha = jsonArr[i].object.sha
            //date = getCommitDate(jsonObj, repoOwner, repoName, sha)

            // testing BranchModel object
            branchesArr.push(new BranchModel(branchName, sha))
            getCommitDate(jsonArr, repoOwner, repoName, sha, i)

            //- [Branch 1](url to branch)
            outputStr += "- [" + branchName + "](https://github.com/" + repoOwner + "/" + repoName + "/tree/" + branchName + ")\n"

        }
        console.log(outputStr)
        document.getElementById("markdown").value = outputStr

        console.log("------------ sorting -----------\n")

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

function main() {
    const branchesUrl = 'https://api.github.com/repos/kodaman2/gtrix_test/git/refs'

    // fetch(Url)
    // .then(data => {return data.json()})
    // .then(res => {console.log(res)})

    getBranch(branchesUrl)
    
}

window.onload = function () {

    var el = document.getElementById("generateIndex");
    if (el.addEventListener)
        el.addEventListener("click", main, false);
    else if (el.attachEvent)
        el.attachEvent('onclick', main);

}