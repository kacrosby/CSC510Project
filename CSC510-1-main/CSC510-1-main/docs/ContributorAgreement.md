# Contributor Agreement

This document will contain any standards or style guidelines that our team
agrees to try and follow when working on this project. These are intended to be
used as a reminder of specific implementation details. They are not intended to
be strict rules that must be followed.

## Git

### Branch Names

We intend to name branches in a consistent way that will identify their purpose
and main contributor in the branch name. The branch name will be composed of
three parts, each of which will be separated by a `/`. The pattern is as
follows:

```
<Category>/<UnityID>/<Description>
```

Example:

```
docs/tsbrenna/start-contributor-agreement
```

1. Category - Will be one of  `docs`, `feature`, or `bug-fix`.
  - `docs` - Used for any updates that only add comments, markdown files, or
    other files that are intended for human reading only.
  - `feature` - Used for any update that provide new functionality to the tool
    or expand on existing functionality.
  - `bug-fix` - Used for any update that is strictly intended to fix existing
    code that has been identified as having a fault.
2. UnityId - You NCSU provided Unity ID.
3. Description - This will be a dash separated explanation of the purpose of
  the branch. This is ideally less than 50 characters. If there is an Issue that
  this branch is intended to resolve, including `#<IssueNumber>` at the
  beginning of the description would be preferred.

## GitHub

### Branch Cleanup

To allow the teaching staff insight into our development process, we will not
delete branches after their pull requests are merged. Branches that are used as
intermediaries when doing git magic can be deleted.

### Pull Requests

#### Approvals

A pull request may be merged once it has received 1 Approval and has no
outstanding change requests. This represents 50% of the team agreeing to merge
the pull requests.

#### Merge Strategy

The intended merge strategy is "Squash & Merge". This will help keep each commit
on the main branch a functional snapshot of the project's history.


