var branchesArr = []

class BranchModel {
    constructor(branchName, sha) {
        this._branchName = branchName
        this._sha = sha
    }

    set updateDate(date) {
        this._date = date
    }
}

// type: commit, or tag
// object.type
async function getCommitDate(repoOwner, repoName, sha, type){

    // repoOwner = 'kodaman2'
    // repoName = 'gtrix_test'

    if(type === 'commit'){
        var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/commits/" + sha
    } else {
        var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/tags/" + sha
    }

    // https://api.github.com/repos/:owner/:repo/git/commits/:commit_sha
    //var commitUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/git/commits/" + sha
    let response = await fetch(url)
    let json = await response.json()
    let date = null

    if(type === 'commit'){
        date = json.author.date
    } else{
        date = json.tagger.date
    }

    return {
        refDate: date,
        refSha: sha
    }
}

function branchSort(a, b) {
    console.log("Attempting sort")
    return a._date - b._date;
}

function main() {

    var repoOwner = document.getElementById("repoOwner").value;
    var repoName = document.getElementById("repoName").value;

    // var repoOwner = 'kodaman2'
    // var repoName = 'gtrix_test'
    const refsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`
    var datePromises = []

    // get refs
    fetch(refsUrl)
    .then(response => response.json())
    .then(json => {
        //console.log(json)
        for(var i = 0; i < json.length; i++){
            var refName = json[i].ref
            // "refs/heads/Add-Deps-02" -> we need the name Add-Deps-02 for branch name
            var splitRefName = refName.split("/")
            var branchName = splitRefName[splitRefName.length - 1]
            var sha = json[i].object.sha
            var type = json[i].object.type // type is commit or tag

            // create branches array (also with tags btw :)
            branchesArr.push(new BranchModel(branchName, sha))

            // here will need to push all promises to array
            datePromises.push(getCommitDate(repoOwner, repoName, sha, type))
        }
        return Promise.all(datePromises)
    })
    .then((response) => {
        // then do something with the dates
        outputStr = ''

        for(let i = 0; i < response.length; i++){
            
            // set date for each branch
            // sanity check: ensure sha matches for each arr item
            if(branchesArr[i]._sha === response[i].refSha){
                branchesArr[i].updateDate = new Date(response[i].refDate)
            } else{
                console.log(new Error('Something went wrong when retrieving dates'))
            }
        }
        
        // Sort array by date with custom sort function
        branchesArr.sort(branchSort)
        //console.log(branchesArr)

        // lastly output to the dom
        for(let i = 0; i < branchesArr.length; i++){
            outputStr += "- [" + branchesArr[i]._branchName + "](https://github.com/" + repoOwner + "/" + repoName + "/tree/" + branchesArr[i]._branchName + ")\n"
        }

        document.getElementById("markdown").value = outputStr
    })
    .catch(err => console.log(err))
}

window.onload = function () {

    var el = document.getElementById("generateIndex");
    if (el.addEventListener)
        el.addEventListener("click", main, false);
    else if (el.attachEvent)
        el.attachEvent('onclick', main);

}