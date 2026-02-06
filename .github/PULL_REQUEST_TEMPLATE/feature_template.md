---
name: Feature PR
about: Template for new features
title: "[DEV/MAIN-Feat] <short description of the feature>"
ai agent instructions:
  - definitions:
    - new commits : meaning the diff commits between the current branch and the target branch, this DOES NOT INCLUDE merge requests showing in the commits
  - when creating a new PR with this template follow these instructions :
      - The commit messages are your most important source of information, prompt and files are next in importance.
      - get the diff commits and craft a general title
      - extract the features and add each one in a separate lines
      - If lesser commits include improvements, create an extra section for them. otherwise add them to the features list
      - When creating notes, each subject should have only 1 note, do not spread them across multiple notes
      - When creating notes, choose one of the given labels (the labels between parenthesis) based on the context of the commits
      - When no tests are mentioned in the commit context, do not add anything to the testing section
      - When no extra context is mentioned in the prompt, do not add anything to the context section
---

## **features:**

- Describe the new feature(s) here


## **Notes**

any notes, opinions, mention, impact :

- [Note] (notes, opinions, mention, impact, dependency) : describe your note


## **Motivation and Context**

Why is this change being made? Provide context here.

## **How Has This Been Tested?**


## **Screenshots (if applicable)**

Add screenshots to help explain your changes.

## **Types of changes**

- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update



## **Related Issues**


## **Additional Context**

