---
name: Bug Fix PR
about: Template for bug fixes
title: "[DEV/MAIN-BugFix] <short description of the bug fix>"
ai agent instructions:
  - definitions:
      - new commits : meaning the diff commits between the current branch and the target branch, this DOES NOT INCLUDE merge requests showing as commits
  - when creating a new PR follow these instructions :
      - The new commits messages are your most important source of information, prompt and files are next in importance.
      - get new commits and craft a general title
      - extract the bugs and add each one in a separate lines
      - When creating notes, each subject should have only 1 note, do not spread them across multiple notes
      - When creating note, choose one of the given labels (the labels between parenthesis)
      - When no tests are mentioned in the commit context, do not add anything to the testing section
      - When no extra context is mentioned in the prompt, do not add anything to the context section
---

## **Bug fixes:**

- Describe the bug that was fixed here


## **Notes**

any notes, opinions, mention, impact :

- [Note] (notes, opinions, mention, impact) : describe your note

## **How Has This Been Tested?**

Describe the testing performed:

- Test cases added
- Manual testing performed
- Integration testing
- Test results

## **Related Issues**


## **Screenshots or logs (if applicable)**


## **Additional Context**

