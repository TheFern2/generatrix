# Generatrix
Generates a content list from a repo based on branches or tags, and outputs to markdown. Useful when you create a tutorial series, and you have separated the content by branches or tags. At the moment the default sorting occurs by date oldest -> newest order.

# TODO
- Add auth login to avoid api hourly limit
- Sort by date or by number if a number is added to the branch name
    - Example: Setup-01, Modify-Setup-02...
- Dropdown tags, branches, both
- progress bar when doing promise.All if there are a lot of branches
- Add input validation before hitting the button
- Revamp the UI
